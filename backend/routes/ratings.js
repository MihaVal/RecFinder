const express = require('express');
const { body, validationResult } = require('express-validator');
const Rating = require('../models/Rating');
const Event = require('../models/Event');
const EventAttendee = require('../models/EventAttendee');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateToken, [
  body('eventId').isInt({ min: 1 }),
  body('rateeId').isInt({ min: 1 }),
  body('score').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId, rateeId, score, comment } = req.body;
    const raterId = req.user.id;

    if (raterId === rateeId) {
      return res.status(400).json({ message: 'You cannot rate yourself' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const eventDate = new Date(event.dateTime);
    if (eventDate > new Date()) {
      return res.status(400).json({ message: 'You can only rate after the event has occurred' });
    }

    const raterAttended = await EventAttendee.isUserAttending(eventId, raterId);
    if (!raterAttended && event.createdById !== raterId) {
      return res.status(403).json({ message: 'You must have attended the event to rate' });
    }

    const rateeAttended = await EventAttendee.isUserAttending(eventId, rateeId);
    if (!rateeAttended && event.createdById !== rateeId) {
      return res.status(400).json({ message: 'You can only rate event participants' });
    }

    const existingRating = await Rating.findByEventAndUsers(eventId, raterId, rateeId);
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this person for this event' });
    }

    const rating = await Rating.create({ eventId, raterId, rateeId, score, comment });

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating
    });
  } catch (error) {
    console.error('Rating creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authenticateToken, [
  body('score').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ratingId = req.params.id;
    const { score, comment } = req.body;

    const existingRating = await Rating.findByEventAndUsers(
      req.body.eventId, 
      req.user.id, 
      req.body.rateeId
    );

    if (!existingRating || existingRating.id !== parseInt(ratingId)) {
      return res.status(404).json({ message: 'Rating not found or you do not have permission to edit it' });
    }

    if (existingRating.raterId !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own ratings' });
    }

    const updatedRating = await Rating.update(ratingId, { score, comment });

    res.json({
      message: 'Rating updated successfully',
      rating: updatedRating
    });
  } catch (error) {
    console.error('Rating update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/events/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const ratings = await Rating.getEventRatings(eventId);

    res.json({ ratings });
  } catch (error) {
    console.error('Event ratings fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const ratings = await Rating.getUserRatings(userId);
    const ratingStats = await Rating.getUserAverageRating(userId);

    res.json({ 
      ratings,
      stats: ratingStats
    });
  } catch (error) {
    console.error('User ratings fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/check/:eventId/:rateeId', authenticateToken, async (req, res) => {
  try {
    const { eventId, rateeId } = req.params;
    const raterId = req.user.id;

    const existingRating = await Rating.findByEventAndUsers(eventId, raterId, rateeId);

    res.json({
      hasRated: !!existingRating,
      rating: existingRating || null
    });
  } catch (error) {
    console.error('Rating check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const ratingId = req.params.id;

    const rating = await Rating.findByEventAndUsers(
      req.body.eventId,
      req.user.id,
      req.body.rateeId
    );

    if (!rating || rating.id !== parseInt(ratingId)) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    if (rating.raterId !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own ratings' });
    }

    await Rating.delete(ratingId);

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Rating deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;