import jwt from 'jsonwebtoken';
import { eventParticipants } from '../../_shared/store.js';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    // Get or create participants list for this event
    if (!eventParticipants.has(id)) {
      eventParticipants.set(id, new Set());
    }

    const participants = eventParticipants.get(id);
    
    if (participants.has(decoded.id)) {
      return res.status(400).json({ message: 'Already joined this event' });
    }

    participants.add(decoded.id);

    return res.status(200).json({ 
      message: 'Successfully joined event',
      eventId: id,
      userId: decoded.id
    });
  } catch (error) {
    console.error('Join event error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
}