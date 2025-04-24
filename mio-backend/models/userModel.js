const pool = require('../db');

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM utenti WHERE email = $1', [email]);
  return result.rows[0];
};

const createUser = async (nome, cognome, email, password, ruolo) => {
  const result = await pool.query(
    'INSERT INTO utenti (nome, cognome, email, password, ruolo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nome, cognome, email, password]
  );
  return result.rows[0];
}

const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM utenti WHERE id = $1', [id]);
  return result.rows[0];
}

module.exports = {
  getUserByEmail,
  createUser, 
  getUserById
};