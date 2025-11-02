require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const db = require("../db");
const app = express() // expressを実行
const multer = require("multer")
const path = require('path');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

router.get('/data/jobs', (req, res) => {
    const sql = 'select * from jobs'
    db.query(sql, (err, result) => {  // con.query()でsql文を実行して結果をresultに格納する
        if (err) {                        // エラーが発生した場合はエラーメッセージを返す
            console.error("EditProfile:" + err)
        }
        res.json(result)
    })
})

//profile送信
router.post('/data/profile', async (req, res) => {
    const query = `SELECT * FROM account WHERE discord_id = ?`;
    db.query(query, [req.body.id ?? req.body.discord_id], (err, results,) => {
        try {
            res.json({
                icon_path: results[0].icon_path,
                name: results[0].name,
                job: results[0].job,
                subjob: results[0].subjob,
                birdy: results[0].birdy,
                profile: results[0].profile,
                career: results[0].career,
                admin: results[0].admin,
                owner: results[0].owner,
                subowner: results[0].subowner
            })
        } catch (err) {
            console.error("EditProfile:" + err)
        }
    });
});

// 画像保存設定
const accountStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/accounts');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E8) + path.extname(file.originalname));
    }
});

const accountUpload = multer({ storage: accountStorage });

// プロフィール更新API
router.post('/data/updateprofile', accountUpload.single('image'), (req, res) => {
    try {
        const updated_at = Math.floor(Date.now() / 1000);
        const icon_path = req.file ? req.file.path : req.body.defaulticon // アップロードされた画像のパス
        const { discord_id, name, job, subjob, birdy, profile, career } = req.body;
        const admin = req.body.admin ?? 0
        const owner = req.body.owner ?? 0
        const subowner = req.body.subowner ?? 0
        const checkedjob = job == "null" ? "0" : job
        const checkedsubjob = subjob == "null" ? "0" : subjob
        if (!discord_id) {
            res.status(500).json({ error: "サーバーエラー" });
            return console.error("Editprofile: Discord_id not found");
        }

        const query = `
        UPDATE account
        SET
            updated_at = ?,
            icon_path = ?,
            name = ?,
            job = ?,
            subjob = ?,
            birdy = ?,
            profile = ?,
            career = ?,
            admin = ?,
            owner = ?,
            subowner = ?
        WHERE
            discord_id = ?`;
        db.query(query, [updated_at, icon_path, name, checkedjob, checkedsubjob, birdy, profile, career, admin, owner, subowner, discord_id], (err, results) => {
            if (err) {
                console.error("EditProfile.js Error : ", err);
                res.status(500).json({ error: "failed profile update" })
            } else {
                res.status(200).json({ message: "プロフィールの更新に成功しました" })
            }
        });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "サーバーエラー" });
    }
});

module.exports = router;