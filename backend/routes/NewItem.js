const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // 秘密鍵

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

router.get('/get', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('無許可');

        const { role, job, cancel, add, search, page, limit } = req.query;
        const user_id = decoded.id;

        // If 'page' is present, assume new frontend request.
        if (page) {
            // New logic for current frontend
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 10;
            const offset = (pageNum - 1) * limitNum;

            let countQueryParts = ['SELECT COUNT(*) as total FROM new_item'];
            let queryParts = [
                `SELECT id, item_id, name, description, image, weight, is_craft, material1, material2, material3, is_delivery, number, is_effect, effect_type, effect, item_type, sale_date, sale_shop, job, price, is_wholesale, is_material, other, created_at, created_by, is_cancel, is_added, is_pending, rule_check FROM new_item`
            ];
            const queryParams = [];
            let whereClauses = [];

            // if (role === 'owner') {
            //     whereClauses.push('created_by = ?');
            //     queryParams.push(user_id);
            // }

            if (job) {
                whereClauses.push('job = ?');
                queryParams.push(job);
            }
            if (cancel) {
                whereClauses.push('is_cancel = ?');
                queryParams.push(cancel);
            }
            if (add) {
                whereClauses.push('is_added = ?');
                queryParams.push(add);
            }
            if (search) {
                whereClauses.push('(name LIKE ? OR item_id LIKE ?)');
                queryParams.push(`%${search}%`);
                queryParams.push(`%${search}%`);
            }

            if (whereClauses.length > 0) {
                const whereString = whereClauses.join(' AND ');
                queryParts.push(`WHERE ${whereString}`);
                countQueryParts.push(`WHERE ${whereString}`);
            }

            const countQuery = countQueryParts.join(' ');
            const countQueryParams = [...queryParams];

            queryParts.push('ORDER BY id DESC');
            queryParts.push('LIMIT ? OFFSET ?');
            queryParams.push(limitNum, offset);

            const query = queryParts.join(' ');

            db.query(countQuery, countQueryParams, (err, countResult) => {
                if (err) {
                    console.error("Count query error:", err);
                    return res.status(500).send('データの取得に失敗しました。');
                }

                const totalItems = countResult[0] ? countResult[0].total : 0;

                db.query(query, queryParams, (err, results) => {
                    if (err) {
                        console.error("Data query error:", err);
                        return res.status(500).send('データの取得に失敗しました。');
                    }
                    res.json({ items: results || [], totalItems });
                });
            });
        } else {
            // Old logic for previous frontend
            const queryParts = [
                `SELECT id, item_id, name, description, image, weight, is_craft, material1, material2, material3, is_delivery, number, is_effect, effect_type, effect, item_type, sale_date, sale_shop, job, price, is_wholesale, is_material, other, created_at, created_by, is_cancel, is_added, is_pending, rule_check FROM new_item`
            ];
            const queryParams = [];
            let whereClauses = [];

            // if (role === 'owner') {
            //     whereClauses.push('created_by = ?');
            //     queryParams.push(user_id);
            // }
            if (job) {
                whereClauses.push('job = ?');
                queryParams.push(job);
            }
            if (cancel) {
                whereClauses.push('is_cancel = ?');
                queryParams.push(cancel);
            }
            if (add) {
                whereClauses.push('is_added = ?');
                queryParams.push(add);
            }
            
            if (whereClauses.length > 0) {
                queryParts.push('WHERE ' + whereClauses.join(' AND '));
            }

            queryParts.push('ORDER BY id DESC');
            const query = queryParts.join(' ');

            db.query(query, queryParams, (err, results) => {
                if (err) {
                    return res.status(500).send('データの取得に失敗しました。');
                }
                res.json(results || []); 
            });
        }
    });
});

router.get('/get/material', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        db.query(
            'SELECT * FROM material',
            (err, results) => {
                if (err) {
                    return res.status(500).send('データの取得に失敗しました。');
                }
                res.json(results);
            }
        );
    });
});

const newItemStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/newitem');
    },
    filename: (req, file, cb) => {
        const fileName = req.body.item_id + path.extname(file.originalname);
        const filePath = path.join('images/newitem', fileName);
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                cb(null, fileName);
            } else {
                cb(new Error('ファイルがすでに存在しています。'));
            }
        });
    }
});
const newItemUpload = multer({ storage: newItemStorage });
router.post('/upload', newItemUpload.single('image'), (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        const { item_id, name, description, weight, is_craft, material1, material2, material3, is_delivery, number, is_effect, effect_type, effect, item_type, sale_date, sale_shop, job, price, is_wholesale, is_material, other, created_by } = req.body;
        const image = `images/newitem/${item_id}.png`;
        const created_at = Date.now();
        const sanitizedNumber = number === '' ? null : number;
        const sanitizedEffect = effect === '' ? null : effect;
        const sanitizedPrice = price === '' ? null : price;
        db.query(
            'INSERT INTO new_item (id, item_id, name, description, image, weight, is_craft, material1, material2, material3, is_delivery, number, is_effect, effect_type, effect, item_type, sale_date, sale_shop, job, price, is_wholesale, is_material, other, created_at, created_by, is_cancel, is_added, is_pending, rule_check) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0)',
            [item_id, name, description, image, weight, is_craft, material1, material2, material3, is_delivery, sanitizedNumber, is_effect, effect_type, sanitizedEffect, item_type, sale_date, sale_shop, job, sanitizedPrice, is_wholesale, is_material, other, created_at, created_by], (err) => {
                if (err) {
                    console.log("Database error:", err);
                    return res.status(500).send('アイテムの登録に失敗しました。');
                }
                if (is_material === "1") {
                    db.query(
                        'INSERT INTO material (id, material_id, name, image) VALUES (NULL, ?, ?, ?)',
                        [item_id, name, image], (err) => {
                            if (err) {
                                console.log("Database error:", err);
                                return res.status(500).send('アイテムの登録に失敗しました。');
                            }
                        }
                    );
                }
                if (req.file) {
                    res.status(201).send('アップロードに成功しました。');
                } else {
                    res.status(400).send('ファイルのアップロードに失敗しました。: ' + req.fileValidationError);
                }
            }
        );
    });
});

router.post('/add', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        const { id } = req.body;
        db.query(
            'UPDATE new_item SET is_added = "1" WHERE id = ?',
            [id],
            (err) => {
                if (err) {
                    console.log("Database error:", err);
                    return res.status(500).send('アイテムの追加処理に失敗しました。');
                }
                res.status(201).send('アイテムの追加処理成功しました。');
            }
        );

    });
})

router.post('/add/cancel', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        const { id } = req.body;
        db.query(
            'UPDATE new_item SET is_added = "0" WHERE id = ?',
            [id],
            (err) => {
                if (err) {
                    console.log("Database error:", err);
                    return res.status(500).send('アイテムの追加キャンセルに失敗しました。');
                }
                res.status(201).send('アイテムの追加キャンセルに成功しました。');
            }
        );

    });
})

router.post('/cancel', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        const { id } = req.body;
        db.query(
            'UPDATE new_item SET is_cancel = "1" WHERE id = ?',
            [id],
            (err) => {
                if (err) {
                    console.log("Database error:", err);
                    return res.status(500).send('アイテムの申請キャンセルに失敗しました。');
                }
                res.status(201).send('アイテムの申請キャンセルに成功しました。');
            }
        );

    });
})

router.post('/cancel/cancel', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        const { id } = req.body;
        db.query(
            'UPDATE new_item SET is_cancel = "0" WHERE id = ?',
            [id],
            (err) => {
                if (err) {
                    console.log("Database error:", err);
                    return res.status(500).send('アイテムの申請キャンセルの取り消しに失敗しました。');
                }
                res.status(201).send('アイテムの申請キャンセルの取り消しに成功しました。');
            }
        );

    });
})

router.post('/pending', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        const { id } = req.body;
        db.query(
            'UPDATE new_item SET is_pending = "1" WHERE id = ?',
            [id],
            (err) => {
                if (err) {
                    console.log("Database error:", err);
                    return res.status(500).send('アイテムの申請キャンセルの取り消しに失敗しました。');
                }
                res.status(201).send('アイテムの申請キャンセルの取り消しに成功しました。');
            }
        );

    });
})

router.post('/pending/cancel', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        const { id } = req.body;
        db.query(
            'UPDATE new_item SET is_pending = "0" WHERE id = ?',
            [id],
            (err) => {
                if (err) {
                    console.log("Database error:", err);
                    return res.status(500).send('アイテムの申請キャンセルの取り消しに失敗しました。');
                }
                res.status(201).send('アイテムの申請キャンセルの取り消しに成功しました。');
            }
        );

    });
})

router.post('/rulecheck', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        const { id } = req.body;
        const value = req.query.value;
        db.query(
            'UPDATE new_item SET rule_check = ? WHERE id = ?',
            [value, id],
            (err) => {
                if (err) {
                    console.log("Database error:", err);
                    return res.status(500).send('アイテムの申請キャンセルの取り消しに失敗しました。');
                }
                res.status(201).send('アイテムの申請キャンセルの取り消しに成功しました。');
            }
        );

    });
})

router.get('/get/job_material', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    const job = req.headers['job'];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        db.query(
            'SELECT material1, material2, material3 FROM new_item WHERE job=?;',
            [job],
            (err, results) => {
                if (err) {
                    return res.status(500).send('データの取得に失敗しました。');
                }
                res.json(results);
            }
        );
    });
});

module.exports = router;