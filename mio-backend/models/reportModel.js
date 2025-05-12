const pool = require('../db');

const createReport = async (userId, title, message, status) => {
  const query = `
    INSERT INTO reports (user_id, title, report_message, report_state)
    VALUES ($1, $2, $3, $4)
  `;

  await pool.query(query, [userId, title, message, status]);
};

const getArtisanRequests = async () => {
  const query = `
    SELECT report_id, user_id, title, report_message, sent_date, report_state
    FROM reports
    WHERE title = 'Richiesta registrazione artigiano'
    ORDER BY sent_date DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  createReport,
  getArtisanRequests
};