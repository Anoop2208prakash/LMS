// server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // ✅ for password hashing
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// ✅ MySQL connection
let db;
(async () => {
  try {
    db = await mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "auth_demo",
    });
    console.log("✅ Connected to MySQL");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
})();

// ✅ Helper to generate unique 6-digit IDs
async function generateUserId() {
  let id;
  let exists = true;
  while (exists) {
    id = Math.floor(100000 + Math.random() * 900000); // 6-digit number
    const [rows] = await db.query("SELECT id FROM users WHERE id = ?", [id]);
    exists = rows.length > 0;
  }
  return id;
}

// ✅ Register route
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique 6-digit ID
    const userId = await generateUserId();

    // Insert user with default role "user"
    await db.query(
      "INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [userId, username, email, hashedPassword, "user"]
    );

    res.json({ message: "User registered successfully", id: userId });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login route
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    // ✅ Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Assign role
    const role = user.role || "user";

    // ✅ Create JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.json({ token, role, id: user.id });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Protected route
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    res.json(decoded);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// ✅ Root
app.get("/", (req, res) => res.send("Auth API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
);
