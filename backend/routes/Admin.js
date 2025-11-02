require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const db = require("../db")
app.use(express.json())

router.post('/data/admin', (req, res) => {
    const discord_id = req.body.discord_id
    const sql = 'select admin from account WHERE discord_id = ?'
    db.query(sql, discord_id, (err, result) => {  // con.query()でsql文を実行して結果をresultに格納する
        if (err) {
            console.error("Admin.js: " + err)
            res.json({admin: 0})
        } else {
            res.json(result?.admin ?? 0)
        }
    })
})

router.post('/update/admin_addjob', (req, res) => {
    const id = req.body.addjob.id
    const job_id = req.body.addjob.job_id
    const name = req.body.addjob.name
    const created_at = Math.floor(Date.now() / 1000);
    const discord_id = req.body.addjob.discord_id
    const query = `INSERT INTO jobs (id, job_id, name, created_at, discord_id) VALUES (?, ?, ?, ?, ?)`
    db.query(query, [id, job_id, name, created_at, discord_id], (err) => {  // con.query()でsql文を実行して結果をresultに格納する
        if (err) {
            console.error("Admin.js Error" + err)
        }
        res.status(200).json({ message: "ジョブを追加しました" })
    })
})

router.post('/update/admin_dropjob', (req, res) => {
    const { job_id, name } = req.body.deletejob;
    const query = `DELETE FROM jobs WHERE job_id = ? AND name = ? `;
    db.query(query,[job_id, name], (err, result) => {
        if (err) {
            console.error("Admin.js Error", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Deletion successful", affectedRows: result.affectedRows });
    });
});



module.exports = router;