const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('Page'));

const db = new sqlite3.Database('ACGmanagement.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        db.run('CREATE TABLE IF NOT EXISTS comics (id INTEGER PRIMARY KEY, title TEXT, author TEXT)', (err) => {
            if (err) {
                console.error("创建表失败:", err.message);
            } else {
                console.log("表创建成功或已存在");
            }
        });
    }
});

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
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
