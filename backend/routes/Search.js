require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require("../db");

router.use(express.json());

router.post('/data/search', (req, res) => {
    const queries = {
        everyone: (sortColumn, sortOrder) =>
            `SELECT * FROM account ORDER BY ${sortColumn} ${sortOrder}, ${sortColumn2} ${sortColumn2 ? sortOrder : ""} LIMIT 40 OFFSET ?`,
        searchname: (sortColumn, sortOrder) =>
            `SELECT * FROM account WHERE name LIKE ? ORDER BY ${sortColumn} ${sortOrder}, ${sortColumn2} ${sortColumn2 ? sortOrder : ""} LIMIT 40 OFFSET ?`,
        filter: (sortColumn, sortOrder) =>
            `SELECT * FROM account WHERE job LIKE ? OR subjob LIKE ? ORDER BY ${sortColumn} ${sortOrder}, ${sortColumn2} ${sortColumn2 ? sortOrder : ""} LIMIT 40 OFFSET ?`,
        nameandjob: (sortColumn, sortOrder) =>
            `SELECT * FROM account WHERE name LIKE ? AND (job LIKE ? OR subjob LIKE ?) ORDER BY ${sortColumn} ${sortOrder}, ${sortColumn2} ${sortColumn2 ? sortOrder : ""} LIMIT 40 OFFSET ?`,
    };

    const validSortColumns = ["id", "updated_at", "RAND()", "CHAR_LENGTH(CONCAT(COALESCE(profile, ''), ' ', COALESCE(career, '')))"];

    const { username, job, value, newvalue, sort, sort2, order } = req.body;

    const sortColumn = validSortColumns.includes(sort) ? sort : "id";
    const sortColumn2 = validSortColumns.includes(sort2) ? sort2 : "id";

    const sortOrder = order === "desc" ? "DESC" : "ASC";

    const offset = value ?? newvalue ?? 0;

    const queryName = username ? `%${username}%` : "";
    const queryJob = job ? `%${job}%` : "";

    const handleQuery = (sql, params) => {
        db.query(sql, params, (err, results) => {
            if (err) {
                console.error("Search.js Error:", err);
                return res.status(500).json({ error: "fetch failed" });
            }
            res.json(results.length ? results : []);
        });
    };

    if (queryName && queryJob) {
        handleQuery(queries.nameandjob(sortColumn, sortOrder), [queryName, queryJob, queryJob, offset]);
    } else if (queryName) {
        handleQuery(queries.searchname(sortColumn, sortOrder), [queryName, offset]);
    } else if (queryJob) {
        handleQuery(queries.filter(sortColumn, sortOrder), [queryJob, queryJob, offset]);
    } else {
        handleQuery(queries.everyone(sortColumn, sortOrder), [offset]);
    }
});

module.exports = router;
