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
  static async create({ sport, location, dateTime, skillLevel, ageGroup, createdById }) {
    const query = `
      INSERT INTO events (sport, location, "dateTime", "skillLevel", "ageGroup", "createdById")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(query, [sport, location, dateTime, skillLevel, ageGroup, createdById]);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT e.*, u.name as "creatorName", u.surname as "creatorSurname"
      FROM events e
      LEFT JOIN users u ON e."createdById" = u.id
      ORDER BY e."dateTime" ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT e.*, u.name as "creatorName", u.surname as "creatorSurname"
      FROM events e
      LEFT JOIN users u ON e."createdById" = u.id
      WHERE e.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, { sport, location, dateTime, skillLevel, ageGroup }) {
    const query = `
      UPDATE events 
      SET sport = $1, location = $2, "dateTime" = $3, "skillLevel" = $4, "ageGroup" = $5
      WHERE id = $6
      RETURNING *
    `;
    const result = await db.query(query, [sport, location, dateTime, skillLevel, ageGroup, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM events WHERE id = $1';
    await db.query(query, [id]);
  }
}

module.exports = { User, Event };