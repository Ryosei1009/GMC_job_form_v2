const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // 秘密鍵
const archiver = require('archiver');

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: "stecker",
});

const stickerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/stickers');
    },
    filename: (req, file, cb) => {
        const fileName = req.body.name + path.extname(file.originalname);
        const filePath = path.join('images/stickers', fileName);
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                cb(null, fileName);
            } else {
                cb(new Error('ファイルがすでに存在しています。'));
            }
        });
    }
});
const stickerUpload = multer({ storage: stickerStorage });
router.post('/upload', stickerUpload.single('image'), (req, res) => {
    const { name } = req.body;
    const image = `images/stickers/${name}.png`;
    const created_at = Date.now();
    db.query(
        'INSERT INTO steckers (id, unique_code, name, image, created_at, is_cancel, is_add, category) VALUES (NULL, NULL, ?, ?, ?, 0, 0, 0)',
        [name, image, created_at], (err) => {
            if (err) {
                console.log("Database error:", err);
                return res.status(500).send('アイテムの登録に失敗しました。');
            }
            if (req.file) {
                db.query('SELECT unique_code FROM steckers WHERE name = ?', [name], (err, results) => {
                    if (err) {
                        console.log("Database error:", err);
                        return res.status(500).send('アイテムの登録に失敗しました。');
                    }
                    const uuid = results[0].unique_code;
                    res.status(201).send(uuid);
                });
            } else {
                res.status(400).send('ファイルのアップロードに失敗しました。: ' + req.fileValidationError);
            }
        }
    );
});

router.get('/get/self', (req, res) => {
    const uuidHeader = JSON.parse(req.headers.uuid);
    if (!uuidHeader) {
        return res.status(400).send('UUID が提供されていません。');
    }
    const placeholders = uuidHeader.map(() => '?').join(',');
    const query = `SELECT * FROM steckers WHERE unique_code IN (${placeholders}) ORDER BY id DESC`;
    db.query(query, uuidHeader, (err, results) => {
        if (err) {
            return res.status(500).send('データの取得に失敗しました。');
        }
        res.json(results);
    });
});

router.get('/get/all', (req, res) => {
    const token = req.headers['auth'];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('無許可');
        const role = req.headers['role'];
        if (role === 'admin') {
            const query = 'SELECT * FROM steckers ORDER BY id DESC';
            db.query(query, (err, results) => {
                if (err) {
                    return res.status(500).send('データの取得に失敗しました。');
                }
                res.json(results);
            });
        }
    });
});

router.get('/get/approved_and_self', (req, res) => {
    const uuidHeader = req.headers.uuid ? JSON.parse(req.headers.uuid) : [];

    if (!uuidHeader || uuidHeader.length === 0) {
        return res.status(400).send('UUID が提供されていません。');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const showOnlyMine = req.query.showOnlyMine === 'true';

    let query = '';
    let queryParams = [];
    let countQuery = '';
    let countParams = [];

    if (showOnlyMine) {
        const placeholders = uuidHeader.map(() => '?').join(',');
        query = `SELECT * FROM steckers WHERE unique_code IN (${placeholders})`;
        queryParams = [...uuidHeader];
        countQuery = `SELECT COUNT(*) as total FROM steckers WHERE unique_code IN (${placeholders})`;
        countParams = [...uuidHeader];
    } else {
        const placeholders = uuidHeader.map(() => '?').join(',');
        query = `SELECT * FROM steckers WHERE ((is_add = 1 AND is_cancel = 0) OR unique_code IN (${placeholders}))`;
        queryParams = [...uuidHeader];
        countQuery = `SELECT COUNT(*) as total FROM steckers WHERE ((is_add = 1 AND is_cancel = 0) OR unique_code IN (${placeholders}))`;
        countParams = [...uuidHeader];
    }

    if (search) {
        query += ' AND name LIKE ?';
        queryParams.push(`%${search}%`);
        countQuery += ' AND name LIKE ?';
        countParams.push(`%${search}%`);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    db.query(countQuery, countParams, (err, countResults) => {
        if (err) {
            return res.status(500).send('データの取得に失敗しました。');
        }

        const total = countResults[0].total;
        const totalPages = Math.ceil(total / limit);

        db.query(query, queryParams, (err, results) => {
            if (err) {
                return res.status(500).send('データの取得に失敗しました。');
            }

            const response = {
                stickers: results,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalStickers: total,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };

            res.json(response);
        });
    });
});

router.get('/download', (req, res) => {
    const token = req.headers['auth'];
    const category = req.headers['category'];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('無許可');

        const query = `SELECT image FROM steckers WHERE is_cancel = 0 AND is_add = 1 AND category = ${category}`;
        db.query(query, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).send('データの取得に失敗しました。');
            }
            if (results.length === 0) {
                return res.status(404).send('画像が見つかりません。');
            }

            const zipFileName = `stickers.zip`;
            const zipFilePath = path.join(__dirname, zipFileName);

            const output = fs.createWriteStream(zipFilePath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => {
                if (archive.pointer() === 0) {
                    return res.status(404).send('ZIPに追加できるファイルがありません。');
                }
                res.download(zipFilePath, zipFileName, (err) => {
                    if (err) {
                        console.error('ファイル送信エラー:', err);
                    }
                    fs.unlinkSync(zipFilePath);
                });
            });

            archive.on('error', (err) => {
                console.error('アーカイブエラー:', err);
                res.status(500).send({ error: err.message });
            });

            archive.pipe(output);

            let fileAdded = false;
            results.forEach((row) => {
                const imagePath = path.join('/root/gmc_jobs_webapp', row.image);
                if (fs.existsSync(imagePath)) {
                    archive.file(imagePath, { name: path.basename(imagePath) });
                    fileAdded = true;
                } else {
                    console.warn(`ファイルが存在しません: ${imagePath}`);
                }
            });

            archive.finalize();
        });
    });
});


router.post('/cancel/admin', (req, res) => {
    const token = req.headers['auth'];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('無許可');
        const uuid = req.headers['uuid'];
        db.query(
            'UPDATE steckers SET is_cancel = "1" WHERE unique_code = ?',
            [uuid],
            (err) => {
                if (err) {
                    console.log("Database error:", err);
                    return res.status(500).send('');
                }
                res.status(201).send('');
            }
        );

    });
})

router.post('/add/admin', (req, res) => {
    const token = req.headers['auth'];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('無許可');
        const uuid = req.headers['uuid'];
        db.query('SELECT COUNT(*) AS count FROM steckers WHERE is_add = 1', (err, results) => {
            if (err) {
                console.log("Database error:", err);
                return res.status(500).send('アイテムの登録に失敗しました。');
            }

            const count = results[0].count;
            let category = 0;

            if (count < 50) {
                category = 1;
            } else if (count < 100) {
                category = 2;
            } else if (count < 150) {
                category = 3;
            } else if (count < 200) {
                category = 4;
            } else if (count < 250) {
                category = 5;
            } else if (count < 300) {
                category = 6;
            } else if (count < 350) {
                category = 7;
            } else if (count < 400) {
                category = 8;
            } else if (count < 450) {
                category = 9;
            } else if (count < 500) {
                category = 10;
            } else if (count < 550) {
                category = 11;
            } else if (count < 600) {
                category = 12;
            } else if (count < 650) {
                category = 13;
            } else if (count < 700) {
                category = 14;
            } else if (count < 750) {
                category = 15;
            } else if (count < 800) {
                category = 16;
            } else if (count < 850) {
                category = 17;
            } else if (count < 900) {
                category = 18;
            } else if (count < 950) {
                category = 19;
            } else if (count < 1000) {
                category = 20;
            } else if (count < 1050) {
                category = 21;
            } else if (count < 1100) {
                category = 22;
            } else if (count < 1150) {
                category = 23;
            } else if (count < 1200) {
                category = 24;
            } else if (count < 1250) {
                category = 25;
            } else if (count < 1300) {
                category = 26;
            } else if (count < 1350) {
                category = 27;
            } else if (count < 1400) {
                category = 28;
            } else if (count < 1450) {
                category = 29;
            } else if (count < 1500) {
                category = 30;
            } else if (count < 1550) {
                category = 31;
            } else if (count < 1600) {
                category = 32;
            } else if (count < 1650) {
                category = 33;
            } else if (count < 1700) {
                category = 34;
            } else if (count < 1750) {
                category = 35;
            } else if (count < 1800) {
                category = 36;
            } else if (count < 1850) {
                category = 37;
            } else if (count < 1900) {
                category = 38;
            } else if (count < 1950) {
                category = 39;
            } else if (count < 2000) {
                category = 40;
            } else if (count < 2050) {
                category = 41;
            } else if (count < 2100) {
                category = 42;
            } else if (count < 2150) {
                category = 43;
            } else if (count < 2200) {
                category = 44;
            } else if (count < 2250) {
                category = 45;
            } else if (count < 2300) {
                category = 46;
            } else if (count < 2350) {
                category = 47;
            } else if (count < 2400) {
                category = 48;
            } else if (count < 2450) {
                category = 49;
            } else if (count < 2500) {
                category = 50;
            }
            db.query(
                'UPDATE steckers SET is_add = "1", category = "?" WHERE unique_code = ?',
                [category, uuid],
                (err) => {
                    if (err) {
                        console.log("Database error:", err);
                        return res.status(500).send('');
                    }
                    res.status(201).send('');
                }
            );
        });
    });
})

router.post('/cancel', (req, res) => {
    const uuid = req.headers['uuid'];
    db.query(
        'UPDATE steckers SET is_cancel = "1" WHERE unique_code = ?',
        [uuid],
        (err) => {
            if (err) {
                console.log("Database error:", err);
                return res.status(500).send('');
            }
            res.status(201).send('');
        }
    );
})


module.exports = router;