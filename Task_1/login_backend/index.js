const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging in' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];

        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        res.status(200).json({ message: 'Login successful' });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
