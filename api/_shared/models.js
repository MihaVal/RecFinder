const db = require('./database');
const bcrypt = require('bcryptjs');

// User model
class User {
  static async create({ email, password, name, surname, phone }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (email, password, name, surname, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, name, surname, phone, "createdAt"
    `;
    const result = await db.query(query, [email, hashedPassword, name, surname, phone]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, name, surname, phone, "createdAt" FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

// Event model
class Event {
  static async create({ title, description, sport, date, time, location, maxParticipants, creatorId }) {
    const query = `
      INSERT INTO events (title, description, sport, date, time, location, "maxParticipants", "creatorId")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await db.query(query, [title, description, sport, date, time, location, maxParticipants, creatorId]);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT e.*, u.name as "creatorName", u.surname as "creatorSurname",
             (SELECT COUNT(*) FROM event_attendees ea WHERE ea."eventId" = e.id) as "currentParticipants"
      FROM events e
      LEFT JOIN users u ON e."creatorId" = u.id
      ORDER BY e."createdAt" DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT e.*, u.name as "creatorName", u.surname as "creatorSurname",
             (SELECT COUNT(*) FROM event_attendees ea WHERE ea."eventId" = e.id) as "currentParticipants"
      FROM events e
      LEFT JOIN users u ON e."creatorId" = u.id
      WHERE e.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, { title, description, sport, date, time, location, maxParticipants }) {
    const query = `
      UPDATE events 
      SET title = $1, description = $2, sport = $3, date = $4, time = $5, 
          location = $6, "maxParticipants" = $7
      WHERE id = $8
      RETURNING *
    `;
    const result = await db.query(query, [title, description, sport, date, time, location, maxParticipants, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM events WHERE id = $1';
    await db.query(query, [id]);
  }
}

module.exports = { User, Event };