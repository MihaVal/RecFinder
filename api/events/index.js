import jwt from 'jsonwebtoken';
import { events } from '../_shared/store.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET all events
  if (req.method === 'GET') {
    try {
      const allEvents = Array.from(events.values());
      return res.status(200).json(allEvents);
    } catch (error) {
      console.error('Get events error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // POST create new event
  if (req.method === 'POST') {
    try {
      // Check authentication
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key-change-in-production'
      );

      const { title, description, sport, date, time, location, maxParticipants } = req.body;

      if (!title || !sport || !date || !time || !location) {
        return res.status(400).json({ 
          message: 'Title, sport, date, time, and location are required' 
        });
      }

      const newEvent = {
        id: Date.now().toString(),
        title,
        description: description || '',
        sport,
        date,
        time,
        location,
        maxParticipants: maxParticipants || 10,
        currentParticipants: 1,
        creatorId: decoded.id,
        createdAt: new Date().toISOString()
      };

      events.set(newEvent.id, newEvent);

      return res.status(201).json(newEvent);
    } catch (error) {
      console.error('Create event error:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}