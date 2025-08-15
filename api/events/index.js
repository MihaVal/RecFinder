const jwt = require('jsonwebtoken');
const { Event } = require('../_shared/models');

module.exports = async function handler(req, res) {
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
      const allEvents = await Event.findAll();
      return res.status(200).json(allEvents);
    } catch (error) {
      console.error('Get events error:', error);
      
      // Fallback to demo events if database fails
      const demoEvents = [
        {
          id: '1',
          title: 'Jutranji tek v Tivoliju',
          description: 'Skupinski tek po Tivoliju za vse nivoje',
          sport: 'Tek',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '07:00',
          location: 'Tivoli, Ljubljana',
          maxParticipants: 20,
          currentParticipants: 5,
          creatorId: '1',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Nogomet na Kodeljevem',
          description: 'Rekreacijski nogomet, pridružite se!',
          sport: 'Nogomet',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '18:00',
          location: 'ŠP Kodeljevo, Ljubljana',
          maxParticipants: 14,
          currentParticipants: 8,
          creatorId: '1',
          createdAt: new Date().toISOString()
        }
      ];
      
      return res.status(200).json(demoEvents);
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

      const { sport, location, dateTime, skillLevel, ageGroup } = req.body;

      if (!sport || !location || !dateTime) {
        return res.status(400).json({ 
          message: 'Sport, location, and dateTime are required' 
        });
      }

      const newEvent = await Event.create({
        sport,
        location,
        dateTime,
        skillLevel: skillLevel || 1,
        ageGroup: ageGroup || '',
        createdById: decoded.id
      });

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