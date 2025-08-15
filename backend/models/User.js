// Model za upravljanje uporabnikov v RecFinder aplikaciji
const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Ustvari novega uporabnika z hashiranim geslom
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

  // Poišči uporabnika po email naslovu
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  // Poišči uporabnika po ID-ju (brez gesla)
  static async findById(id) {
    const query = 'SELECT id, email, name, surname, phone, "createdAt" FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, { name, surname, phone }) {
    const query = `
      UPDATE users 
      SET name = $1, surname = $2, phone = $3
      WHERE id = $4
      RETURNING id, email, name, surname, phone, "createdAt"
    `;
    const result = await db.query(query, [name, surname, phone, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await db.query(query, [id]);
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;