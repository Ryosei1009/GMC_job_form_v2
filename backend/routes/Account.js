const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // 秘密鍵

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const created_at = Date.now();

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('エラーが発生しました。');
        }

        if (results.length > 0) {
            return res.status(400).send('ユーザーネームが既に存在しています。');
        }

        db.query('INSERT INTO users (username, password, created_at) VALUES (?, ?, ?)', [username, hashedPassword, created_at], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('ユーザー登録に失敗しました。');
            }
            res.status(201).send('ユーザーが正常に登録されました。');
        });
    });
});


router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err || results.length === 0) return res.status(400).send('無効な認証情報');

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) return res.status(400).send('無効な認証情報');

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '9999d' });
        res.json({ token });
    });
});

router.get('/userinfo', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('無許可');

        db.query(
            'SELECT id, username, job, job2, role, created_at FROM users WHERE id = ?',
            decoded.id,
            (err, results) => {
                if (err) {
                    return res.status(500).send('データの取得に失敗しました。');
                }
                res.json(results);
            }
        );
    });
});

router.get('/job', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        const id = req.query.id;
        db.query(
            'SELECT job, job2 FROM users WHERE id = ?',
            id,
            (err, results) => {
                if (err) {
                    return res.status(500).send('データの取得に失敗しました。');
                }
                res.json(results);
            }
        );
    });
});

router.get('/getall', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        const role = req.query.role;
        if (role === 'admin') {
            db.query(
                'SELECT id, username, role, job, job2, created_at FROM users',
                (err, results) => {
                    if (err) {
                        return res.status(500).send('データの取得に失敗しました。');
                    }
                    res.json(results);
                }
            );
        }
    });
});

// ユーザー名を取得するAPIエンドポイント
router.get('/username/:id', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send('認証トークンが必要です。');
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('無許可');

        const { id } = req.params;

        db.query(
            'SELECT username FROM users WHERE id = ?',
            [id],
            (err, results) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).send('データの取得に失敗しました。');
                }

                if (results.length === 0) {
                    return res.status(404).send('ユーザーが見つかりません。');
                }

                res.json({ username: results[0].username });
            }
        );
    });
});

router.post('/job/update', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        const { id, job } = req.body;
        db.query(
            'UPDATE users SET job = ? WHERE id = ?',
            [job, id],
            (err) => {
                if (err) {
                    return res.status(500).send('ジョブの更新に失敗しました。');
                }
                res.status(200).send('ジョブが正常に更新されました。');
            }
        );
    });
});

router.post('/job2/update', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        const { id, job2 } = req.body;
        db.query(
            'UPDATE users SET job2 = ? WHERE id = ?',
            [job2, id],
            (err) => {
                if (err) {
                    return res.status(500).send('ジョブの更新に失敗しました。');
                }
                res.status(200).send('ジョブが正常に更新されました。');
            }
        );
    });
});

router.post('/role/update', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        const { id, role } = req.body;
        db.query(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, id],
            (err) => {
                if (err) {
                    return res.status(500).send('ロールの更新に失敗しました。');
                }
                res.status(200).send('ロールが正常に更新されました。');
            }
        );
    });
});
module.exports = router;