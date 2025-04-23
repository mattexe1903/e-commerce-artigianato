const pool = require('../db');

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM utenti WHERE email = $1', [email]);
  return result.rows[0];
};

module.exports = {
  getUserByEmail,
};