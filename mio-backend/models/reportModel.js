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
    WHERE title = 'Richiesta registrazione artigiano' AND report_state = 1
    ORDER BY sent_date DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

const updateReportState = async (reportId, status) => {
  const stateResult = await pool.query(
    'SELECT state_id FROM states WHERE state_name = $1',
    [status]
  );

  if (stateResult.rows.length === 0) {
    throw new Error(`Stato '${status}' non trovato nella tabella states.`);
  }

  const stateId = stateResult.rows[0].state_id;

  const query = `
    UPDATE reports
    SET report_state = $1
    WHERE report_id = $2
  `;
  await pool.query(query, [stateId, reportId]);
}

const getArtisanIdByReportId = async (reportId) => {
  const query = `
    SELECT user_id
    FROM reports
    WHERE report_id = $1
  `;
  const result = await pool.query(query, [reportId]);
  return result.rows[0] ? result.rows[0].user_id : null;  
}

module.exports = {
  createReport,
  getArtisanRequests,
  updateReportState,
  getArtisanIdByReportId
};