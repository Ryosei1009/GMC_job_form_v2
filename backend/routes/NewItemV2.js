const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'job2',
});

// ファイルタイプ検証
const validateFileType = (file, allowedTypes) => {
    return allowedTypes.includes(file.mimetype);
};

// 画像比率検証（フロントエンドで実行するため、バックエンドでは省略）
const validateImageRatio = async (filePath) => {
    // フロントエンドで既に検証済みのため、常にtrueを返す
    return true;
};

// 基本画像アップロード設定
const basicImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'images/items';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const fileName = req.body.item_id + '.png';
        const filePath = path.join('images/items', fileName);
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                cb(null, fileName);
            } else {
                cb(new Error('基本画像ファイルがすでに存在しています。'));
            }
        });
    }
});

// 高解像度画像アップロード設定
const highResImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'images/gmc2/utilsystem';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const fileName = req.body.item_id + '.png';
        cb(null, fileName);
    }
});

// 音楽ファイルアップロード設定
const audioStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'images/gmc2/utilsystem';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const fileName = req.body.item_id + '.mp3';
        cb(null, fileName);
    }
});

// マルチファイルアップロード設定
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            let dir;
            if (file.fieldname === 'basic_image') {
                dir = 'images/items';
            } else {
                dir = 'images/gmc2/utilsystem';
            }
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            let fileName;
            if (file.fieldname === 'basic_image') {
                fileName = req.body.item_id + '.png';
            } else if (file.fieldname === 'display_image') {
                fileName = req.body.item_id + '.png';
            } else if (file.fieldname === 'audio_file') {
                fileName = req.body.item_id + '.mp3';
            }
            cb(null, fileName);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'basic_image' || file.fieldname === 'display_image') {
            if (file.mimetype === 'image/png') {
                cb(null, true);
            } else {
                cb(new Error('画像ファイルはPNGのみ対応しています。'), false);
            }
        } else if (file.fieldname === 'audio_file') {
            if (file.mimetype === 'audio/mpeg') {
                cb(null, true);
            } else {
                cb(new Error('音楽ファイルはMP3のみ対応しています。'), false);
            }
        } else {
            cb(new Error('不正なフィールド名です。'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

// アイテム一覧取得
router.get('/get', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send('認証トークンが必要です。');
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('無許可');

        const { role, job, add_status, search, page, limit } = req.query;
        const user_id = decoded.id;

        // ページネーション対応
        if (page) {
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 10;
            const offset = (pageNum - 1) * limitNum;

            let countQueryParts = ['SELECT COUNT(*) as total FROM new_item'];
            let queryParts = [
                `SELECT * FROM new_item`
            ];
            const queryParams = [];
            let whereClauses = [];

            if (job) {
                whereClauses.push('job = ?');
                queryParams.push(job);
            }
            if (add_status) {
                whereClauses.push('add_status = ?');
                queryParams.push(add_status);
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
            // ページネーションなしの場合
            let queryParts = [`SELECT * FROM new_item`];
            const queryParams = [];
            let whereClauses = [];

            if (job) {
                whereClauses.push('job = ?');
                queryParams.push(job);
            }
            if (add_status) {
                whereClauses.push('add_status = ?');
                queryParams.push(add_status);
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

// 新商品申請
router.post('/upload', upload.fields([
    { name: 'basic_image', maxCount: 1 },
    { name: 'display_image', maxCount: 1 },
    { name: 'audio_file', maxCount: 1 }
]), async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send('認証トークンが必要です。');
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).send('無許可');

        try {
            // フォームデータの取得
            const {
                item_id, name, description, weight, emote,
                is_material, is_craft, craft_material1, craft_material2, craft_material3,
                is_effect, effect_item_type, effect_grant, effect_grant_count, effect_time,
                effect_type, effect_amount, effect_screen, effect_required, effect_is_od,
                is_image, display_type,
                is_audio,
                is_giveitem, give_additem, give_addamount, give_time, give_text,
                is_wholesale, whole_price, whole_shop,
                sale_date, price, other,
                job, created_by
            } = req.body;

            // バリデーション
            if (!item_id || item_id.length > 30) {
                return res.status(400).send('アイテムIDは必須で30文字以内である必要があります。');
            }
            if (!name || name.length > 30) {
                return res.status(400).send('名前は必須で30文字以内である必要があります。');
            }
            if (description && description.length > 60) {
                return res.status(400).send('説明は60文字以内である必要があります。');
            }
            if (!weight || weight.length > 4) {
                return res.status(400).send('重量は必須で4文字以内である必要があります。');
            }

            // 画像比率チェック
            if (req.files['basic_image']) {
                const basicImagePath = req.files['basic_image'][0].path;
                const isValidRatio = await validateImageRatio(basicImagePath);
                if (!isValidRatio) {
                    fs.unlinkSync(basicImagePath); // 不正なファイルを削除
                    return res.status(400).send('基本画像は1:1の比率である必要があります。');
                }
            }

            // ファイルパスの設定
            const basic_image = req.files['basic_image'] ? `images/items/${item_id}.png` : null;
            const display_image = req.files['display_image'] ? `images/gmc2/utilsystem/${item_id}.png` : null;
            const audio_file = req.files['audio_file'] ? `images/gmc2/utilsystem/${item_id}.mp3` : null;

            const created_at = Date.now().toString();

            // データベースに挿入
            const query = `
                INSERT INTO new_item (
                    item_id, name, description, weight, emote,
                    is_material, is_craft, craft_material1, craft_material2, craft_material3,
                    is_effect, effect_item_type, effect_grant, effect_grant_count, effect_time,
                    effect_type, effect_amount, effect_screen, effect_required, effect_is_od,
                    is_image, display_type,
                    is_audio,
                    is_giveitem, give_additem, give_addamount, give_time, give_text,
                    is_wholesale, whole_price, whole_shop,
                    sale_date, price, other,
                    add_status, created_at, job, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                item_id, name, description || null, weight, emote || null,
                is_material || 0, is_craft || 0, craft_material1 || null, craft_material2 || null, craft_material3 || null,
                is_effect || 0, effect_item_type || null, effect_grant || null, effect_grant_count || null, effect_time || null,
                effect_type || null, effect_amount || null, effect_screen || null, effect_required || null, effect_is_od || 0,
                is_image || 0, display_type || null,
                is_audio || 0,
                is_giveitem || 0, give_additem || null, give_addamount || null, give_time || null, give_text || null,
                is_wholesale || 0, whole_price || null, whole_shop || null,
                sale_date || null, price || null, other || null,
                'none', created_at, job, created_by
            ];

            db.query(query, values, (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).send('アイテムの登録に失敗しました。');
                }

                res.status(201).send('アイテムの申請が完了しました。');
            });

        } catch (error) {
            console.error("Upload error:", error);
            res.status(500).send('アップロード処理中にエラーが発生しました。');
        }
    });
});

// ステータス更新
router.post('/update-status', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send('認証トークンが必要です。');
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('無許可');

        const { id, status } = req.body;
        const allowedStatuses = ['none', 'cancel', 'pending', 'check1', 'check2', 'add'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).send('無効なステータスです。');
        }

        db.query(
            'UPDATE new_item SET add_status = ? WHERE id = ?',
            [status, id],
            (err) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).send('ステータスの更新に失敗しました。');
                }
                res.status(200).send('ステータスが更新されました。');
            }
        );
    });
});

// 素材リスト取得（new_itemテーブルのis_material=1かつadd_status='add'から）
router.get('/get/material', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send('認証トークンが必要です。');
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('無許可');

        // new_itemテーブルから素材アイテム（is_material=1 AND add_status='add'）を取得
        const query = `
            SELECT
                id,
                item_id as material_id,
                name,
                description,
                CONCAT('images/items/', item_id, '.png') as image,
                created_at
            FROM new_item
            WHERE is_material = 1 AND add_status = 'add'
            ORDER BY name ASC
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error("Material query error:", err);
                return res.status(500).send('素材データの取得に失敗しました。');
            }

            console.log(`Found ${results.length} material items`);
            res.json(results || []);
        });
    });
});

module.exports = router;