const pool = require('../db');

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const createUser = async (nome, cognome, email, password, role) => {
  const result = await pool.query(
    'INSERT INTO users (user_name, surname, email, user_password, user_role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nome, cognome, email, password, role]
  );
  return result.rows[0];
}

const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users JOIN address ON(users.users_id = address.user_id) WHERE user.user_id = $1', [id]);
  return result.rows[0];
}

const getArtigianiById = async (id) => {
  const result = await pool.query('SELECT * FROM artigiani WHERE id = $1', [id]);
  return result.rows[0];
}

const createArtigiano = async (userId, craft, iban) => {
  const result = await pool.query(
    'INSERT INTO info_artisan (user_id, craft, iban) VALUES ($1, $2, $3) RETURNING *',
    [userId, craft, iban]
  );
  return result.rows[0];
}

module.exports = {
  getUserByEmail,
  createUser,
  getUserById,
  getArtigianiById, 
  createArtigiano
};