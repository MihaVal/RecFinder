const db = require('../config/database');

class Rating {
  static async create({ eventId, raterId, rateeId, score, comment }) {
    const query = `
      INSERT INTO ratings ("eventId", "raterId", "rateeId", score, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await db.query(query, [eventId, raterId, rateeId, score, comment]);
    return result.rows[0];
  }

  static async update(id, { score, comment }) {
    const query = `
      UPDATE ratings 
      SET score = $1, comment = $2
      WHERE id = $3
      RETURNING *
    `;
    const result = await db.query(query, [score, comment, id]);
    return result.rows[0];
  }

  static async findByEventAndUsers(eventId, raterId, rateeId) {
    const query = `
      SELECT * FROM ratings 
      WHERE "eventId" = $1 AND "raterId" = $2 AND "rateeId" = $3
    `;
    const result = await db.query(query, [eventId, raterId, rateeId]);
    return result.rows[0];
  }

  static async getUserRatings(userId) {
    const query = `
      SELECT r.*, e.sport, e.location, e."dateTime", 
             rater.name as "raterName", rater.surname as "raterSurname"
      FROM ratings r
      JOIN events e ON r."eventId" = e.id
      JOIN users rater ON r."raterId" = rater.id
      WHERE r."rateeId" = $1
      ORDER BY r."createdAt" DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async getEventRatings(eventId) {
    const query = `
      SELECT r.*, 
             rater.name as "raterName", rater.surname as "raterSurname",
             ratee.name as "rateeName", ratee.surname as "rateeSurname"
      FROM ratings r
      JOIN users rater ON r."raterId" = rater.id
      JOIN users ratee ON r."rateeId" = ratee.id
      WHERE r."eventId" = $1
      ORDER BY r."createdAt" DESC
    `;
    const result = await db.query(query, [eventId]);
    return result.rows;
  }

  static async getUserAverageRating(userId) {
    const query = `
      SELECT AVG(score) as "averageRating", COUNT(*) as "totalRatings"
      FROM ratings 
      WHERE "rateeId" = $1
    `;
    const result = await db.query(query, [userId]);
    const row = result.rows[0];
    return {
      averageRating: row.averageRating ? parseFloat(row.averageRating) : null,
      totalRatings: parseInt(row.totalRatings)
    };
  }

  static async delete(id) {
    const query = 'DELETE FROM ratings WHERE id = $1';
    await db.query(query, [id]);
  }
}

module.exports = Rating;