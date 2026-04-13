const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Помилка підключення до БД:', err.message);
    } else {
        console.log('Успішне підключення до бази даних SQLite.');
        
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            gender TEXT,
            dob TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            english TEXT NOT NULL,
            ukrainian TEXT NOT NULL,
            isLearned BOOLEAN DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
    }
});

app.post('/api/register', (req, res) => {
    const { name, email, password, gender, dob } = req.body; 
    const sql = "INSERT INTO users (name, email, password, gender, dob) VALUES (?, ?, ?, ?, ?)";
    
    db.run(sql, [name, email, password, gender, dob], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ error: 'Користувач з таким email вже існує' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, name, email, gender, dob });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    
    db.get(sql, [email, password], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Невірний email або пароль' });
        
        res.json(user);
    });
});

app.put('/api/users/:id', (req, res) => {
    const { name, email, gender, dob } = req.body;
    const id = req.params.id;
    const sql = "UPDATE users SET name = ?, email = ?, gender = ?, dob = ? WHERE id = ?";
    
    db.run(sql, [name, email, gender, dob, id], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ error: 'Цей email вже зайнятий іншим користувачем' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Профіль оновлено" });
    });
});

app.get('/api/words', (req, res) => {
    const userId = req.query.userId; 
    if (!userId) return res.status(400).json({ error: "Не вказано ID користувача" });

    db.all("SELECT * FROM words WHERE user_id = ?", [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/words', (req, res) => {
    const { user_id, english, ukrainian } = req.body;
    if (!user_id || !english || !ukrainian) {
        return res.status(400).json({ error: "Всі поля обов'язкові" });
    }
    
    const sql = "INSERT INTO words (user_id, english, ukrainian, isLearned) VALUES (?, ?, ?, 0)";
    db.run(sql, [user_id, english, ukrainian], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, user_id, english, ukrainian, isLearned: 0 });
    });
});

app.put('/api/words/:id', (req, res) => {
    const { isLearned } = req.body;
    const id = req.params.id;
    const sql = "UPDATE words SET isLearned = ? WHERE id = ?";
    db.run(sql, [isLearned, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Оновлено" });
    });
});

app.delete('/api/words/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM words WHERE id = ?";
    db.run(sql, id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Видалено" });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});