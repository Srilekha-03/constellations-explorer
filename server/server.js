const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET || 'your_development_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'constellation_explorer',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Create a database connection module
const db = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'constellation_explorer',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Export pool for use in route files
module.exports = pool;

// Routes
app.get('/api/constellations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM constellations');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/constellations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM constellations WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Constellation not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Import routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/favorites', require('./routes/favorites'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Authentication routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if username or email already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new user
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, hashedPassword]
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create and assign token
    const token = jwt.sign(
      { id: user.rows[0].id, username: user.rows[0].username },
      jwtSecret,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Favorite constellations routes
app.post('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const { constellation_id } = req.body;
    const user_id = req.user.id;
    
    // Check if already favorited
    const existingFavorite = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND constellation_id = $2',
      [user_id, constellation_id]
    );
    
    if (existingFavorite.rows.length > 0) {
      return res.status(409).json({ message: 'Constellation already in favorites' });
    }
    
    // Add to favorites
    await pool.query(
      'INSERT INTO favorites (user_id, constellation_id) VALUES ($1, $2)',
      [user_id, constellation_id]
    );
    
    res.status(201).json({ message: 'Added to favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const favorites = await pool.query(
      'SELECT c.* FROM favorites f JOIN constellations c ON f.constellation_id = c.id WHERE f.user_id = $1',
      [user_id]
    );
    
    res.json(favorites.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/favorites/:id', authenticateToken, async (req, res) => {
  try {
    const constellation_id = req.params.id;
    const user_id = req.user.id;
    
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND constellation_id = $2',
      [user_id, constellation_id]
    );
    
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// User profile route
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});