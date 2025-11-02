const express = require('express');
const fs = require('fs').promises;
const router = express.Router();
const axios = require('axios')
const cheerio = require('cheerio');

router.post('/data/vehiclelist', async (req, res) => {
    try {
        const data = await fs.readFile('VehicleList.json', 'utf8');
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    } catch (err) {
        console.error('ファイル読み込みエラー:', err);
        res.status(500).json({ error: 'データの読み込みに失敗しました' });
    }
});

router.post('/update/vehiclelist', async (req, res) => {
    res.status(200)
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fetchOgImage(url) {
        try {
            const res = await axios.get(url);
            const $ = cheerio.load(res.data);
            return $('meta[property="og:image"]').attr('content') || null;
        } catch (err) {
            console.error(`OGP取得失敗: ${url}`);
            return null;
        }
    }

    try {
        console.log("車両カタログ強制更新中")
        const sheetRes = await axios.get("https://script.google.com/macros/s/AKfycbzdqmkTlRVJdK8Ms7yfZGcl1d4iKBLznngEcf3XIHvqyVaJmSCbNxJu_nHvLqffeILHmg/exec");
        const originalData = sheetRes.data;

        const updatedData = [];

        const count = Array.isArray(originalData) ? originalData.length : 0;
        let remain = count

        for (const item of originalData) {
            console.log("残り要素数：" + remain)
            if (!item || typeof item !== 'object' || !item.url || !item.name) {
                continue;
            }

            let ogImage = await fetchOgImage(item.url);
            await delay(1500 + Math.random() * 500);

            updatedData.push({
                ...item,
                ogImage
            });
            remain = remain - 1
        }

        fs.writeFile('VehicleList.json', JSON.stringify(updatedData, null, 4), () => {
        });
        console.log("車両データ更新完了:", new Date());

    } catch (error) {
        console.error("エラー:", error);
    }
});

module.exports = router;