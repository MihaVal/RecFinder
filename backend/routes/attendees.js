const express = require('express');
const Event = require('../models/Event');
const EventAttendee = require('../models/EventAttendee');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/events/:eventId/join', authenticateToken, async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdById === userId) {
      return res.status(400).json({ message: 'You cannot join your own event' });
    }

    const eventDate = new Date(event.dateTime);
    if (eventDate <= new Date()) {
      return res.status(400).json({ message: 'Cannot join past events' });
    }

    const isAlreadyAttending = await EventAttendee.isUserAttending(eventId, userId);
    if (isAlreadyAttending) {
      return res.status(400).json({ message: 'You are already attending this event' });
    }

    await EventAttendee.addAttendee(eventId, userId);

    res.status(201).json({ message: 'Successfully joined the event' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'You are already attending this event' });
    }
    console.error('Join event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/events/:eventId/leave', authenticateToken, async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isAttending = await EventAttendee.isUserAttending(eventId, userId);
    if (!isAttending) {
      return res.status(400).json({ message: 'You are not attending this event' });
    }

    await EventAttendee.removeAttendee(eventId, userId);

    res.json({ message: 'Successfully left the event' });
  } catch (error) {
    console.error('Leave event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/events/:eventId/attendees', async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const attendees = await EventAttendee.getEventAttendees(eventId);

    res.json({ attendees });
  } catch (error) {
    console.error('Get attendees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/events/:eventId/status', authenticateToken, async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isAttending = await EventAttendee.isUserAttending(eventId, userId);
    const isCreator = event.createdById === userId;
    const attendeeCount = await EventAttendee.getAttendeeCount(eventId);

    res.json({
      isAttending,
      isCreator,
      attendeeCount,
      canJoin: !isAttending && !isCreator && new Date(event.dateTime) > new Date()
    });
  } catch (error) {
    console.error('Get attendance status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;