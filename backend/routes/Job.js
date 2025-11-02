const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // 秘密鍵

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

router.post('/upload', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        const { job_id, name } = req.body;
        const created_at = Date.now();
        db.query(
            'INSERT INTO jobs (id, job_id, name, created_at) VALUES (NULL, ?, ?, ?)',
            [job_id, name, created_at], (err) => {
                if (err) {
                    console.log("Database error:", err);
                    return res.status(500).send('ジョブの登録に失敗しました。');
                }
                res.status(201).send('ジョブの登録に成功しました。');
            }
        );
    });
});

router.get('/get', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        db.query(
            'SELECT id, job_id, name, created_at FROM jobs',
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