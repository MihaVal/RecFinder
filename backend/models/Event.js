// Model za upravljanje športnih dogodkov
const db = require('../config/database');

class Event {
  // Ustvari nov športni dogodek
  static async create({ sport, location, dateTime, skillLevel, ageGroup, createdById }) {
    const query = `
      INSERT INTO events (sport, location, "dateTime", "skillLevel", "ageGroup", "createdById")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(query, [sport, location, dateTime, skillLevel, ageGroup, createdById]);
    return result.rows[0];
  }

  // Pridobi vse dogodke z možnostjo filtriranja
  static async findAll(filters = {}) {
    let query = `
      SELECT e.*, u.name as "creatorName", u.surname as "creatorSurname"
      FROM events e
      JOIN users u ON e."createdById" = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (filters.sport) {
      paramCount++;
      query += ` AND LOWER(e.sport) LIKE LOWER($${paramCount})`;
      params.push(`%${filters.sport}%`);
    }

    if (filters.location) {
      paramCount++;
      query += ` AND LOWER(e.location) LIKE LOWER($${paramCount})`;
      params.push(`%${filters.location}%`);
    }

    if (filters.skillLevel) {
      paramCount++;
      query += ` AND e."skillLevel" = $${paramCount}`;
      params.push(filters.skillLevel);
    }

    if (filters.ageGroup) {
      paramCount++;
      query += ` AND e."ageGroup" = $${paramCount}`;
      params.push(filters.ageGroup);
    }

    if (filters.dateFrom) {
      paramCount++;
      query += ` AND e."dateTime" >= $${paramCount}`;
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      paramCount++;
      query += ` AND e."dateTime" <= $${paramCount}`;
      params.push(filters.dateTo);
    }

    query += ` ORDER BY e."dateTime" ASC`;

    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT e.*, u.name as "creatorName", u.surname as "creatorSurname"
      FROM events e
      JOIN users u ON e."createdById" = u.id
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

  static async findByCreator(createdById) {
    const query = `
      SELECT e.*, u.name as "creatorName", u.surname as "creatorSurname"
      FROM events e
      JOIN users u ON e."createdById" = u.id
      WHERE e."createdById" = $1
      ORDER BY e."dateTime" ASC
    `;
    const result = await db.query(query, [createdById]);
    return result.rows;
  }
}

module.exports = Event;