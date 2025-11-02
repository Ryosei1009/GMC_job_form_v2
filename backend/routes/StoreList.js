const express = require('express');
const router = express.Router();
const db = require("../db")
const multer = require("multer")
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const app = express();
app.use(express.json());

const iconStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/storeicons');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E8) + path.extname(file.originalname));
    }
});
const iconUpload = multer({ storage: iconStorage });

router.post('/owner/editjob', iconUpload.single('image'), (req, res) => {
    const safe = (v) => (v === "undefined" || v === null) ? '' : v;
    try {
        const updated_at = Math.floor(Date.now() / 1000);
        const icon_path = req.file ? req.file.path : req.body.icon_path // アップロードされた画像のパス

        const {
            discord_id,
            job,
            title,
            quickword,
            introduce,
            warn,
            pos_x,
            pos_y,
            menu_path1,
            menu_path2,
            menu_path3,
            menu_path4,
            menu_path5,
        } = req.body;

        if (!discord_id) {
            res.status(500).json({ error: "サーバーエラー" });
            return console.error("Storelist: Discord_id not found");
        }

        const upsert = `
            INSERT INTO storelist (
                discord_id, job, title, quickword, introduce, warn, pos_x, pos_y,
                icon_path, menu_path1, menu_path2, menu_path3, menu_path4, menu_path5, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                quickword = VALUES(quickword),
                introduce = VALUES(introduce),
                warn = VALUES(warn),
                pos_x = VALUES(pos_x),
                pos_y = VALUES(pos_y),
                icon_path = VALUES(icon_path),
                menu_path1 = VALUES(menu_path1),
                menu_path2 = VALUES(menu_path2),
                menu_path3 = VALUES(menu_path3),
                menu_path4 = VALUES(menu_path4),
                menu_path5 = VALUES(menu_path5),
                updated_at = VALUES(updated_at),
                job = VALUES(job);
        `;

        const values = [
            safe(discord_id),
            safe(job),
            safe(title),
            safe(quickword),
            safe(introduce),
            safe(warn),
            safe(pos_x),
            safe(pos_y),
            icon_path ?? '',
            safe(menu_path1),
            safe(menu_path2),
            safe(menu_path3),
            safe(menu_path4),
            safe(menu_path5),
            updated_at
        ];

        db.query(upsert, values, (err, results) => {
            if (err) {
                console.error("Upsert Error:", err);
                res.status(500).json({ error: "登録または更新に失敗しました" });
            } else {
                res.status(200).json({ message: "プロフィール登録・更新に成功しました" });
            }
        });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "サーバーエラー" });
    }
});

router.post('/owner/job_data', async (req, res) => {
    const query = `SELECT * FROM storelist WHERE job = ?`;
    const job = req.body.owner
    db.query(query, [job], (err, results) => {
        try {
            if (results.length === 0) {
                return res.status(200).json({ message: "新規作成" });
            }
            res.json({
                id: results[0].id,
                job: results[0].job,
                title: results[0].title,
                quickword: results[0].quickword,
                introduce: results[0].introduce,
                warn: results[0].warn,
                pos_x: results[0].pos_x,
                pos_y: results[0].pos_y,
                icon_path: results[0].icon_path,
                menu_path1: results[0].menu_path1,
                menu_path2: results[0].menu_path2,
                menu_path3: results[0].menu_path3,
                menu_path4: results[0].menu_path4,
                menu_path5: results[0].menu_path5,
            });
        } catch (err) {
            console.error("StoreList.js:  " + err)
            res.status(500).json({ error: "fetch failed" });
        }
    });
});

router.get('/storelist/jobs', (req, res) => {
    const query = `SELECT * FROM storelist order by CONVERT(job, UNSIGNED)`;
    db.query(query, (err, result) => {
        try {
            if (result.length === 0) {
                return res.status(200).json({ message: "新規作成" });
            }
            res.json(result);
        } catch (err) {
            console.error("StoreList.js:  " + err)
            res.status(500).json({ error: "fetch failed" });
        }
    });
});

router.post('/storelist/job', (req, res) => {
    const query = `SELECT * FROM storelist WHERE id = ? `;
    const job = req.body.storeid
    db.query(query, [job], (err, result) => {
        try {
            res.json(result[0]);
        } catch (err) {
            console.error("StoreList.js:  " + err)
            res.status(500).json({ error: "fetch failed" });
        }
    });
});

module.exports = router;
