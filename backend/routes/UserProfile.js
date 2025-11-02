require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const db = require("../db")
app.use(express.json())

router.post('/data/userprofile', async (req, res) => {
    const query = `SELECT * FROM account WHERE discord_id = ?`;
    const discord_id = req.body.discord_id
    db.query(query, [discord_id], (err, results,) => {
        try {
            res.json({
                id: results[0].id,
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
            console.error("UserProfile.js:  " + err)
            res.status(500).json({ error: "fetch failed" });
        }
    });
});

module.exports = router;