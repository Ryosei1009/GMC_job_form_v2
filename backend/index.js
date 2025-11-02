const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config()
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const axios = require('axios')
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  'https://api.gmcrp.net',
  'https://job.gmcrp.net',
  'https://sticker.gmcrp.net',
  'https://www.gmcrp.net',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://192.168.0.177:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(`/images`, express.static(`images`));

const hour = 3600000;
app.use(session({
  name: "token",
  secret: 'TpcCP7',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    maxAge: 14 * 24 * hour,
  }
}));

const server = require('https').createServer({
  key: fs.readFileSync(process.env.KEY_PATH),
  cert: fs.readFileSync(process.env.CERT_PATH),
}, app)

// const allowedOrigins = ['https://api.gmcrp.net', 'https://job.gmcrp.net', 'https://sticker.gmcrp.net', 'http://localhost:3000', 'http://localhost:5173'];

// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//     res.header('Access-Control-Allow-Credentials', 'false');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
//   }
// });
app.use((req, res, next) => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD形式
  const dateTime = now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

  const shortLogFilePath = path.join(__dirname, `logs/short-log-${dateStr}.txt`);
  const logFilePath = path.join(__dirname, `logs/full-log-${dateStr}.txt`);

  const logMessage = `
[${dateTime}]
Request Details:
Method: ${req.method}
URL: ${req.originalUrl}
Headers: ${JSON.stringify(req.headers)}
Query Parameters: ${JSON.stringify(req.query)}
Body: ${JSON.stringify(req.body)}
Remote Address: ${req.ip}
User Agent: ${req.get('User-Agent')}
---------------------------------------------
`;

  const shortLogMessage = `[${dateTime}] ${req.method} ${req.originalUrl} [${req.ip}]\n`;
  console.log(shortLogMessage)
  // logsディレクトリが存在しない場合は作成
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
  }

  // 短縮ログの書き込み
  fs.appendFile(shortLogFilePath, shortLogMessage, (err) => {
    if (err) {
      console.error('短縮ログの書き込みエラー:', err);
    }
  });

  // 詳細ログの書き込み
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('詳細ログの書き込みエラー:', err);
    }
  });

  next();
});

// cron.schedule('0 0 0,6,12,18 * * *', async () => {

//   function delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

//   async function fetchOgImage(url) {
//     try {
//       const res = await axios.get(url);
//       const $ = cheerio.load(res.data);
//       return $('meta[property="og:image"]').attr('content') || null;
//     } catch (err) {
//       console.error(`OGP取得失敗: ${url}`);
//       return null;
//     }
//   }

//   try {
//     console.log("車両カタログ更新中")
//     const sheetRes = await axios.get("https://script.google.com/macros/s/AKfycbz0aE9QmubG5W5-3FC1NXUgB1unfe6ifBER-VXphwdcIeIoiS0-uKHludXAegqJuu5Y/exec");
//     const originalData = sheetRes.data;

//     const updatedData = [];

//     const count = Array.isArray(originalData) ? originalData.length : 0;
//     let remain = count

//     for (const item of originalData) {
//       console.log("残り要素数：" + remain)
//       if (!item || typeof item !== 'object' || !item.url || !item.name) {
//         continue; // 不完全なデータは無視
//       }

//       let ogImage = await fetchOgImage(item.url);
//       await delay(1500 + Math.random() * 500);

//       updatedData.push({
//         ...item,
//         ogImage
//       });
//       remain = remain - 1
//     }

//     fs.writeFile('VehicleList.json', JSON.stringify(updatedData, null, 4), () => {
//     });
//     console.log("車両データ更新完了:", new Date());

//   } catch (error) {
//     console.error("エラー:", error);
//   }
// });

const accountsRouter = require('./routes/Account');
app.use('/account/', accountsRouter);

const NewItemRouter = require('./routes/NewItem');
app.use('/new_item/', NewItemRouter);

const NewItemV2Router = require('./routes/NewItemV2');
app.use('/new_item_v2/', NewItemV2Router);

const JobRouter = require('./routes/Job');
app.use('/job/', JobRouter);

const StickersRouter = require('./routes/Stickers');
app.use('/sticker/', StickersRouter);

const Discord_auth = require('./routes/Account_data');
app.use("/", Discord_auth);

const Admin = require('./routes/Admin')
app.use("/", Admin)

//個別のユーザ
const UserProfile = require('./routes/UserProfile')
app.use("/", UserProfile)

//プロフィール関係
const Profile = require('./routes/EditProfile');
app.use("/", Profile)

//プロフィールリスト
const ProfileList = require('./routes/ProfileList')
app.use("/", ProfileList)

const Search = require('./routes/Search')
app.use("/", Search)

const StoreList = require('./routes/StoreList')
app.use("/", StoreList)

const VehicleList = require('./routes/VehicleList')
app.use("/", VehicleList)

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

server.listen(PORT, () => {
  console.log(`Server running`);
});
