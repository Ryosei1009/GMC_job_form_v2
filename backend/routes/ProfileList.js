require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const db = require("../db")
app.use(express.json())

router.post('/data/users', (req, res) => {
  const sql = `SELECT * FROM account ORDER BY updated_at DESC LIMIT 40 OFFSET ?`
  const value = req.body.value ?? req.body.newvalue
  db.query(sql, [value], (err, result) => {
    if (err) {
      console.error("ProfileList.js Error : " + err)
    }
    res.json(result)
  })
})

module.exports = router;