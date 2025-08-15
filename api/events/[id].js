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

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  // GET single event
  if (req.method === 'GET') {
    try {
      const event = events.get(id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      return res.status(200).json(event);
    } catch (error) {
      console.error('Get event error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // PUT update event
  if (req.method === 'PUT') {
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

      const event = events.get(id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Only creator can update
      if (event.creatorId !== decoded.id) {
        return res.status(403).json({ message: 'Not authorized to update this event' });
      }

      const updatedEvent = {
        ...event,
        ...req.body,
        id: event.id, // Preserve ID
        creatorId: event.creatorId, // Preserve creator
        createdAt: event.createdAt // Preserve creation date
      };

      events.set(id, updatedEvent);
      return res.status(200).json(updatedEvent);
    } catch (error) {
      console.error('Update event error:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // DELETE event
  if (req.method === 'DELETE') {
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

      const event = events.get(id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Only creator can delete
      if (event.creatorId !== decoded.id) {
        return res.status(403).json({ message: 'Not authorized to delete this event' });
      }

      events.delete(id);
      return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Delete event error:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}