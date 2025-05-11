const pool = require('../db');

const createReport = async (userId, title, message, status) => {
  const query = `
    INSERT INTO reports (user_id, title, report_message, report_state)
    VALUES ($1, $2, $3, $4)
  `;

  await pool.query(query, [userId, title, message, status]);
};

module.exports = {
  createReport
};