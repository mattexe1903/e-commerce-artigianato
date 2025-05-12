const pool = require('../db');
const bcrypt = require('bcrypt');

// Funzione per ottenere l'utente per email
const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// Funzione per creare un nuovo utente
const createUser = async (nome, cognome, email, password, role) => {
  const result = await pool.query(
    'INSERT INTO users (user_name, surname, email, user_password, user_role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nome, cognome, email, password, role]
  );
  return result.rows[0];
}

// Funzione per ottenere un utente per ID
const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users LEFT JOIN address ON users.user_id = address.user_id WHERE users.user_id = $1', [id]);
  return result.rows[0];
}

// Funzione per aggiornare la password (versione per test, senza criptazione)
const updatePassword = async (userId, newPassword) => {
  try {
    // COMMENTATO: Cripta la nuova password
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Usa direttamente la password in chiaro per il testing
    const hashedPassword = newPassword;

    // Logga i parametri per il debug
    console.log('Aggiornamento password per l\'utente con ID:', userId);
    console.log('Nuova password in chiaro (solo per test):', hashedPassword);

    // Aggiorna la password dell'utente nel database
    const result = await pool.query(
      'UPDATE users SET user_password = $1 WHERE user_id = $2 RETURNING *',
      [hashedPassword, userId]
    );

    // Verifica se la query ha aggiornato effettivamente qualcosa
    if (result.rowCount === 0) {
      console.error(`Nessun utente trovato con ID: ${userId}`);
      throw new Error('Nessun utente trovato con questo ID.');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della password:', error.message);
    throw new Error('Errore durante l\'aggiornamento della password');
  }
};

const getArtigianiById = async (id) => {
  const result = await pool.query('SELECT * FROM artigiani WHERE id = $1', [id]);
  return result.rows[0];
}

const createArtigiano = async (userId, craft, iban) => {
  const result = await pool.query(
    'INSERT INTO info_artisan (artisan_id, craft, iban, artisan_state) VALUES ($1, $2, $3, 1) RETURNING *',
    [userId, craft, iban]
  );
  return result.rows[0];
}

const getArtisanStateById = async (id) => {
  const result = await pool.query('SELECT artisan_state FROM info_artisan WHERE artisan_id = $1', [id]);
  return result.rows[0];
}

// Funzione per ottenere gli indirizzi di un utente
const getUserAddresses = async (userId) => {
  const result = await pool.query('SELECT * FROM address WHERE user_id = $1', [userId]);
  return result.rows;
}

//TODO: test this function
const addUserAddress = async (userId, street_address, city, cap, province) => {
  const result = await pool.query(
    `INSERT INTO address (user_id, street_address, city, cap, province, country) VALUES ($1, $2, $3, $4, $5, 'italia') RETURNING *`,
    [userId, street_address, city, cap, province]
  );
  return result.rows[0];
}

const getInventory = async (userId) => {
  const result = await pool.query('SELECT * FROM inventory JOIN products ON(inventory.product_id = products.product_id) WHERE user_id = $1', [userId]);
  return result.rows;
}

const getArtisanRegistered = async () => {
  const result = await pool.query(`SELECT a.*, u.user_name, u.surname FROM info_artisan a JOIN users u ON a.artisan_id = u.user_id WHERE a.artisan_state = 2`);

  return result.rows;
}

const deleteArtisan = async (artisanId) => {
  const result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [artisanId]);
  if (result.rowCount === 0) {
    throw new Error('Artisan not found');
  }
  return result.rows[0];
}

const updateArtisanState = async (userId, artisanState) => {
  console.log('Aggiornamento stato artigiano per l\'utente con ID:', userId);
  console.log('Nuovo stato artigiano:', artisanState);
  
  const stateResult = await pool.query(
    'SELECT state_id FROM states WHERE state_name = $1',
    [artisanState]
  );

  if (stateResult.rows.length === 0) {
    throw new Error(`Stato '${artisanState}' non trovato nella tabella states.`);
  }

  const stateId = stateResult.rows[0].state_id;

  const result = await pool.query(
    'UPDATE info_artisan SET artisan_state = $1 WHERE artisan_id = $2 RETURNING *',
    [stateId, userId]
  );

  return result.rows[0];
};

module.exports = {
  getUserByEmail,
  createUser,
  getUserById,
  getArtisanStateById,
  updatePassword, 
  getUserAddresses,
  addUserAddress,
  getArtigianiById,
  createArtigiano,
  getInventory,
  getArtisanRegistered,
  deleteArtisan,
  updateArtisanState
};

