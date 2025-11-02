require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const router = express.Router();
const db = require("../db");
const app = express();

app.use(express.json());
app.use(cookieParser());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Discordの認証URLにリダイレクト
router.get('/auth/discord', (req, res) => {
    const discordAuthURL = process.env.DISCORD_AUTH_URL;
    res.redirect(discordAuthURL);
});

//認証処理
router.get('/auth/Discord_auth', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send("Code not found");

    try {
        // Discordのトークンを取得
        const tokenResponse = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )

        const { access_token } = tokenResponse.data;

        // ユーザー情報を取得
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        req.session.user = userResponse.data;

        //ログイン関係
        const created_at = Math.floor(Date.now() / 1000);
        const updated_at = created_at;
        const icon_path = "images/Default.png"
        const login = `SELECT * FROM account WHERE discord_id = ?`;
        const register = `INSERT INTO account (discord_id, created_at, updated_at, icon_path, name, job, subjob, birdy, profile, career) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        db.query(login, [userResponse.data.id], async (err, results) => {
            if (results.length === 1) {
                try {
                    const getguilds = await axios.get('https://discord.com/api/users/@me/guilds', {
                        headers: { Authorization: `Bearer ${access_token}` }
                    });

                    const guildsdata = getguilds.data; // Object.values() 不要
                    const isjoin = guildsdata.some(data => data.id === '1192335476300992562');
                    if (!isjoin) {
                        req.session.destroy(() => {
                            res.clearCookie('token');
                            res.redirect(`${process.env.FRONTEND}/joinserver`);
                        });
                    } else {
                        res.redirect(process.env.FRONTEND);
                    }
                } catch (error) {
                    console.error("Account_data.js Guilds Error:", error);
                    res.status(500).send("Account_data.js Guilds Error");
                }

            } else if (results.length === 0) {

                const getguilds = await axios.get('https://discord.com/api/users/@me/guilds', {
                    headers: { Authorization: `Bearer ${access_token}` }
                });
                const guildsdata = Object.values(getguilds.data);
                const isjoin = guildsdata.some(data => {
                    return data.id === '1192335476300992562';
                })

                if (!isjoin) {
                    req.session.destroy(() => {
                        res.clearCookie('token');
                        res.redirect(`${process.env.FRONTEND}/joinserver`);
                    });
                    return
                } else if (isjoin) {
                    db.query(register, [userResponse.data.id, created_at, updated_at, icon_path, "", "0", "0", "", "", ""], (err, results) => {
                        try {
                            res.redirect(process.env.FRONTEND + "/profile")
                        } catch {
                            console.error("Account_data.js Register Error" + err)
                        }
                    })
                }
            }
            else (err) => {
                console.error("Account_data.js Unknown Error:", err);
                return res.status(500).json({ error: "Account_data.js Unknown Error" + err.message });
            }
        });
    } catch (err) {
        console.error("Discord Auth Error:", err);
    }
});

// ユーザデータを取得
router.get('/auth/user', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.json({ canlogin: false })
    }
});

//ユーザデータ識別
router.post("/auth/profile", (req, res) => {
    const query = `SELECT * FROM account WHERE discord_id = ?`;
    const discord_id = req.body.id;

    db.query(query, [discord_id], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 1) {
            return res.json({ status: "success" });
        } else if (results.length === 0) {
            return res.json({ status: "new_user" });
        }
    });
});

// ログアウト処理
router.post('/auth/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('token');
        res.json({ message: "ログアウトしました" });
    });
});

module.exports = router;

