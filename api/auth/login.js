import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Demo credentials check (in production, use a database)
    let user = null;
    
    // Check for demo user
    if (email.toLowerCase() === 'demo@example.com') {
      const validPassword = await bcrypt.compare(password, '$2a$10$SjEpgyLwNak7cRgNArjHQOOqBZaJ/cbcD3QBgj0WGqzDK09JadMSS');
      if (validPassword) {
        user = {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo',
          surname: 'User'
        };
      }
    }
    
    // For any other email/password combination, create a temporary user
    // This is ONLY for demo purposes - in production use a real database
    if (!user && email && password) {
      // Accept any login for demo
      user = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        name: email.split('@')[0],
        surname: 'User'
      };
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}