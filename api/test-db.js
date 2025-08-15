const { Pool } = require('pg');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ 
        error: 'DATABASE_URL not configured',
        hasEnvVar: false
      });
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    });

    // Test connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, COUNT(*) as event_count FROM events');
    client.release();
    
    return res.status(200).json({
      status: 'Database connection successful',
      timestamp: result.rows[0].current_time,
      eventCount: result.rows[0].event_count,
      hasEnvVar: true,
      databaseUrl: process.env.DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//***.***@') // Hide credentials
    });

  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({
      error: 'Database connection failed',
      message: error.message,
      hasEnvVar: !!process.env.DATABASE_URL
    });
  }
};