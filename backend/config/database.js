// Konfiguracija povezave z Neon PostgreSQL podatkovno bazo
const { Pool } = require('pg');
require('dotenv').config();

// Ustvari connection pool za optimalno upravljanje povezav
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Obravnavanje nepričakovanih napak pri povezavi
pool.on('error', (err) => {
  console.error('Nepričakovana napaka pri povezavi z bazo:', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),    // Izvedi SQL poizvedbo
  getClient: () => pool.connect()                       // Pridobi direktno povezavo
};