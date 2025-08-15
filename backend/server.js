// Uvoz potrebnih modulov za RecFinder backend API
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Uvoz middleware funkcij za obravnavo napak in omejevanje zahtev
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

// Uvoz vseh route-ov za različne funkcionalnosti
const authRoutes = require('./routes/auth');          // Avtentikacija in prijava
const userRoutes = require('./routes/users');        // Upravljanje uporabnikov
const eventRoutes = require('./routes/events');      // Upravljanje dogodkov
const attendeeRoutes = require('./routes/attendees'); // Udeležba na dogodkih
const ratingRoutes = require('./routes/ratings');     // Sistem ocenjevanja

const app = express();
const PORT = process.env.PORT || 3000;

// Konfiguracija middleware-a za varnost in funkcionalnost
app.use(helmet());                                    // Varnostni middleware
app.use(cors());                                      // Omogoči CORS za frontend
app.use(express.json({ limit: '10mb' }));            // Parsing JSON zahtev
app.use(express.urlencoded({ extended: true }));     // Parsing URL encoded podatkov

app.use(generalLimiter);                              // Omejevanje zahtev

// Osnovna ruta za informacije o API-ju
app.get('/', (req, res) => {
  res.json({
    message: 'RecFinder API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      events: '/api/events',
      attendees: '/api',
      ratings: '/api/ratings'
    }
  });
});

// Health check endpoint za preverjanje delovanja
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Registracija vseh API route-ov
app.use('/api/auth', authRoutes);        // Avtentikacija
app.use('/api/users', userRoutes);       // Uporabniki
app.use('/api/events', eventRoutes);     // Dogodki
app.use('/api', attendeeRoutes);         // Udeleženci
app.use('/api/ratings', ratingRoutes);   // Ocene

// Middleware za obravnavo napak - mora biti na koncu
app.use(notFoundHandler);                // 404 napake
app.use(errorHandler);                   // Splošne napake

// Zagon strežnika (samo v development režimu)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`RecFinder API strežnik teče na portu ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Okolje: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export za Vercel serverless funkcije
module.exports = app;