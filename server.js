const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(cors()); // 启用 CORS
app.use(bodyParser.json());

const db = new sqlite3.Database('ACGmanagement.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        db.run('CREATE TABLE IF NOT EXISTS comics (id INTEGER PRIMARY KEY, title TEXT, author TEXT)');
    }
});

// POST 和 GET 路由代码
app.post('/api/comics', (req, res) => {
    const { title, author } = req.body;
    db.run('INSERT INTO comics (title, author) VALUES (?, ?)', [title, author], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, title, author });
    });
});

app.get('/api/comics', (req, res) => {
    db.all('SELECT * FROM comics', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// 监听端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
