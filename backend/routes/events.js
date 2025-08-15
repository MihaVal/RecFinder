const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Event = require('../models/Event');
const EventAttendee = require('../models/EventAttendee');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', [
  query('sport').optional().trim(),
  query('location').optional().trim(),
  query('skillLevel').optional().isInt({ min: 1, max: 5 }),
  query('ageGroup').optional().trim(),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filters = {};
    if (req.query.sport) filters.sport = req.query.sport;
    if (req.query.location) filters.location = req.query.location;
    if (req.query.skillLevel) filters.skillLevel = parseInt(req.query.skillLevel);
    if (req.query.ageGroup) filters.ageGroup = req.query.ageGroup;
    if (req.query.dateFrom) filters.dateFrom = req.query.dateFrom;
    if (req.query.dateTo) filters.dateTo = req.query.dateTo;

    const events = await Event.findAll(filters);
    
    const eventsWithAttendeeCount = await Promise.all(
      events.map(async (event) => {
        const attendeeCount = await EventAttendee.getAttendeeCount(event.id);
        return { ...event, attendeeCount };
      })
    );

    res.json({ events: eventsWithAttendeeCount });
  } catch (error) {
    console.error('Events fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { sport, location, dateTime, skillLevel, ageGroup, description } = req.body;

    if (!sport || !location || !dateTime || !skillLevel) {
      return res.status(400).json({ message: 'Sport, location, dateTime and skillLevel are required' });
    }

    if (skillLevel < 1 || skillLevel > 5) {
      return res.status(400).json({ message: 'Skill level must be between 1 and 5' });
    }
    
    const eventDateTime = new Date(dateTime);
    if (eventDateTime <= new Date()) {
      return res.status(400).json({ message: 'Event date must be in the future' });
    }

    const event = await Event.create({
      sport,
      location,
      dateTime: eventDateTime,
      skillLevel,
      ageGroup: ageGroup || null,
      description: description || null,
      createdById: req.user.id
    });

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const attendees = await EventAttendee.getEventAttendees(event.id);
    const attendeeCount = attendees.length;

    res.json({
      event: { ...event, attendeeCount },
      attendees
    });
  } catch (error) {
    console.error('Event fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authenticateToken, [
  body('sport').trim().isLength({ min: 1 }),
  body('location').trim().isLength({ min: 1 }),
  body('dateTime').isISO8601(),
  body('skillLevel').isInt({ min: 1, max: 5 }),
  body('ageGroup').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdById !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own events' });
    }

    const { sport, location, dateTime, skillLevel, ageGroup } = req.body;
    
    const eventDateTime = new Date(dateTime);
    if (eventDateTime <= new Date()) {
      return res.status(400).json({ message: 'Event date must be in the future' });
    }

    const updatedEvent = await Event.update(req.params.id, {
      sport,
      location,
      dateTime: eventDateTime,
      skillLevel,
      ageGroup
    });

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Event update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdById !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own events' });
    }

    await Event.delete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Event deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my/created', authenticateToken, async (req, res) => {
  try {
    const events = await Event.findByCreator(req.user.id);
    
    const eventsWithAttendeeCount = await Promise.all(
      events.map(async (event) => {
        const attendeeCount = await EventAttendee.getAttendeeCount(event.id);
        return { ...event, attendeeCount };
      })
    );

    res.json({ events: eventsWithAttendeeCount });
  } catch (error) {
    console.error('User events fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my/attending', authenticateToken, async (req, res) => {
  try {
    const events = await EventAttendee.getUserEvents(req.user.id);
    res.json({ events });
  } catch (error) {
    console.error('User attending events fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;