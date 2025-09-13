// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(
  cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true })
);
app.use(express.json());

// ✅ MySQL connection
let db;
(async () => {
  try {
    db = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '', // 🔥 FIXED HERE
      database: process.env.DB_NAME || 'auth_demo',
    });
    console.log('✅ Connected to MySQL');
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
  }
})();

// ✅ Login route
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [
      username,
      password,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    // ✅ Assign role (default: user)
    const role = user.role || 'user';

    // ✅ Create JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({ token, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Protected test route
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    res.json(decoded);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/', (req, res) => res.send('Auth API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
