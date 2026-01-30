const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize SQLite Database
const db = new sqlite3.Database('./students.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize Database Tables
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      address TEXT,
      enrollmentDate TEXT NOT NULL,
      status TEXT DEFAULT 'Active'
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Students table initialized');
    }
  });
}

// Routes

// GET all students
app.get('/api/students', (req, res) => {
  db.all('SELECT * FROM students ORDER BY id DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET student by ID
app.get('/api/students/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    res.json(row);
  });
});

// CREATE new student
app.post('/api/students', (req, res) => {
  const { name, email, phone, address, enrollmentDate, status } = req.body;

  if (!name || !email || !enrollmentDate) {
    res.status(400).json({ error: 'Name, email, and enrollment date are required' });
    return;
  }

  const query = `
    INSERT INTO students (name, email, phone, address, enrollmentDate, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [name, email, phone || null, address || null, enrollmentDate, status || 'Active'], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    res.status(201).json({ 
      id: this.lastID,
      message: 'Student added successfully' 
    });
  });
});

// UPDATE student
app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, enrollmentDate, status } = req.body;

  const query = `
    UPDATE students 
    SET name = ?, email = ?, phone = ?, address = ?, enrollmentDate = ?, status = ?
    WHERE id = ?
  `;

  db.run(query, [name, email, phone, address, enrollmentDate, status, id], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Email already exists' });
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
  });
});

// DELETE student
app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    res.json({ message: 'Student deleted successfully' });
  });
});

// Search students
app.get('/api/students/search/:query', (req, res) => {
  const searchQuery = req.params.query;
  const sql = `
    SELECT * FROM students 
    WHERE name LIKE ? OR email LIKE ? 
    ORDER BY id DESC
  `;
  const searchTerm = `%${searchQuery}%`;
  
  db.all(sql, [searchTerm, searchTerm], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
