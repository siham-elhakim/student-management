const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Use /tmp for Vercel, otherwise use current directory
const DB_PATH = process.env.NODE_ENV === 'production' ? '/tmp/students.db' : './students.db';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Root route - redirect to login or serve index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Initialize SQLite Database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database at:', DB_PATH);
    initializeDatabase();
  }
});

// Initialize Database Tables
function initializeDatabase() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table initialized');
    }
  });

  // Students table
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      enrollmentDate TEXT NOT NULL,
      status TEXT DEFAULT 'Active',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(userId, email)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating students table:', err);
    } else {
      console.log('Students table initialized');
    }
  });
}

// JWT Middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided. Please login.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.userId = decoded.userId;
    next();
  });
}

// Routes

// ============ AUTHENTICATION ROUTES ============

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  console.log('Registration attempt:', { name, email });

  if (!name || !email || !password) {
    console.log('Missing fields in registration');
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Hash password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Password hashing error:', err);
      return res.status(500).json({ error: 'Password hashing failed' });
    }

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.run(query, [name, email, hashedPassword], function(err) {
      if (err) {
        console.error('Database error during registration:', err);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already registered' });
        }
        return res.status(500).json({ error: err.message });
      }

      console.log('User registered successfully:', { id: this.lastID, email });
      res.status(201).json({ 
        id: this.lastID,
        message: 'User registered successfully. Please login.' 
      });
    });
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', email);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error('Database error during login:', err);
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Password comparison error:', err);
        return res.status(500).json({ error: 'Password comparison failed' });
      }

      if (!isMatch) {
        console.log('Password mismatch for:', email);
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ 
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        message: 'Login successful'
      });
    });
  });
});

// ============ STUDENT ROUTES (Protected) ============

// GET all students for logged-in user
app.get('/api/students', verifyToken, (req, res) => {
  db.all(
    'SELECT * FROM students WHERE userId = ? ORDER BY id DESC',
    [req.userId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows || []);
    }
  );
});

// GET student by ID
app.get('/api/students/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  db.get(
    'SELECT * FROM students WHERE id = ? AND userId = ?',
    [id, req.userId],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }
      res.json(row);
    }
  );
});

// CREATE new student
app.post('/api/students', verifyToken, (req, res) => {
  const { name, email, phone, address, enrollmentDate, status } = req.body;

  if (!name || !email || !enrollmentDate) {
    res.status(400).json({ error: 'Name, email, and enrollment date are required' });
    return;
  }

  const query = `
    INSERT INTO students (userId, name, email, phone, address, enrollmentDate, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [req.userId, name, email, phone || null, address || null, enrollmentDate, status || 'Active'],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'Email already exists for your account' });
        } else {
          res.status(500).json({ error: err.message });
        }
        return;
      }
      res.status(201).json({ 
        id: this.lastID,
        message: 'Student added successfully' 
      });
    }
  );
});

// UPDATE student
app.put('/api/students/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, enrollmentDate, status } = req.body;

  const query = `
    UPDATE students 
    SET name = ?, email = ?, phone = ?, address = ?, enrollmentDate = ?, status = ?
    WHERE id = ? AND userId = ?
  `;

  db.run(
    query,
    [name, email, phone, address, enrollmentDate, status, id, req.userId],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'Email already exists for your account' });
        } else {
          res.status(500).json({ error: err.message });
        }
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }
      res.json({ message: 'Student updated successfully' });
    }
  );
});

// DELETE student
app.delete('/api/students/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM students WHERE id = ? AND userId = ?',
    [id, req.userId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }
      res.json({ message: 'Student deleted successfully' });
    }
  );
});

// Search students
app.get('/api/students/search/:query', verifyToken, (req, res) => {
  const searchQuery = req.params.query;
  const sql = `
    SELECT * FROM students 
    WHERE userId = ? AND (name LIKE ? OR email LIKE ?)
    ORDER BY id DESC
  `;
  const searchTerm = `%${searchQuery}%`;
  
  db.all(sql, [req.userId, searchTerm, searchTerm], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// Health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
