const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Rating = require('../models/Rating');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const ratingStats = await Rating.getUserAverageRating(user.id);
    
    res.json({
      user: {
        ...user,
        ...ratingStats
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', authenticateToken, [
  body('name').trim().isLength({ min: 1 }),
  body('surname').trim().isLength({ min: 1 }),
  body('phone').optional().isMobilePhone()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, phone } = req.body;
    const updatedUser = await User.update(req.user.id, { name, surname, phone });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ratingStats = await Rating.getUserAverageRating(user.id);
    
    res.json({
      user: {
        ...user,
        ...ratingStats
      }
    });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/ratings', async (req, res) => {
  try {
    const ratings = await Rating.getUserRatings(req.params.id);
    res.json({ ratings });
  } catch (error) {
    console.error('User ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/account', authenticateToken, async (req, res) => {
  try {
    await User.delete(req.user.id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;