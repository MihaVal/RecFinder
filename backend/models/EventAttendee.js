const db = require('../config/database');

class EventAttendee {
  static async addAttendee(eventId, userId) {
    const query = `
      INSERT INTO event_attendees ("eventId", "userId")
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await db.query(query, [eventId, userId]);
    return result.rows[0];
  }

  static async removeAttendee(eventId, userId) {
    const query = 'DELETE FROM event_attendees WHERE "eventId" = $1 AND "userId" = $2';
    await db.query(query, [eventId, userId]);
  }

  static async getEventAttendees(eventId) {
    const query = `
      SELECT ea.*, u.name, u.surname, u.email
      FROM event_attendees ea
      JOIN users u ON ea."userId" = u.id
      WHERE ea."eventId" = $1
      ORDER BY u.name, u.surname
    `;
    const result = await db.query(query, [eventId]);
    return result.rows;
  }

  static async getUserEvents(userId) {
    const query = `
      SELECT e.*, u.name as "creatorName", u.surname as "creatorSurname", ea."userId" as "attendeeId"
      FROM events e
      JOIN users u ON e."createdById" = u.id
      JOIN event_attendees ea ON e.id = ea."eventId"
      WHERE ea."userId" = $1
      ORDER BY e."dateTime" ASC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async isUserAttending(eventId, userId) {
    const query = 'SELECT * FROM event_attendees WHERE "eventId" = $1 AND "userId" = $2';
    const result = await db.query(query, [eventId, userId]);
    return result.rows.length > 0;
  }

  static async getAttendeeCount(eventId) {
    const query = 'SELECT COUNT(*) as count FROM event_attendees WHERE "eventId" = $1';
    const result = await db.query(query, [eventId]);
    return parseInt(result.rows[0].count);
  }
}

module.exports = EventAttendee;