// Create a new file server/routes/favorites.js
const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get user's favorite constellations
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await pool.query(
      `SELECT c.* FROM favorites f
       JOIN constellations c ON f.constellation_id = c.id
       WHERE f.user_id = $1`,
      [req.user.id]
    );
    
    res.json(favorites.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a constellation to favorites
router.post('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if constellation exists
    const constellationCheck = await pool.query(
      'SELECT * FROM constellations WHERE id = $1',
      [id]
    );
    
    if (constellationCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Constellation not found' });
    }
    
    // Check if already favorited
    const favoriteCheck = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND constellation_id = $2',
      [req.user.id, id]
    );
    
    if (favoriteCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Constellation already in favorites' });
    }
    
    // Add to favorites
    await pool.query(
      'INSERT INTO favorites (user_id, constellation_id) VALUES ($1, $2)',
      [req.user.id, id]
    );
    
    res.json({ message: 'Added to favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a constellation from favorites
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Remove from favorites
    const deleteResult = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND constellation_id = $2 RETURNING *',
      [req.user.id, id]
    );
    
    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;