const pool = require('../db');

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const createUser = async (nome, cognome, email, password, ruolo) => {
  const result = await pool.query(
    'INSERT INTO utenti (nome, cognome, email, password, ruolo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nome, cognome, email, password, ruolo]
  );
  return result.rows[0];
}

const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM utenti JOIN indirizzo ON(utenti.id = indirizzo.idutente) WHERE utenti.id = $1', [id]);
  return result.rows[0];
}

const getArtigianiById = async (id) => {
  const result = await pool.query('SELECT * FROM artigiani WHERE id = $1', [id]);
  return result.rows[0];
}


module.exports = {
  getUserByEmail,
  createUser,
  getUserById,
  getArtigianiById
};