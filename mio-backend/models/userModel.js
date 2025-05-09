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



// Funzione per ottenere gli indirizzi di un utente
const getUserAddresses = async (userId) => {
  const result = await pool.query('SELECT * FROM address WHERE user_id = $1', [userId]);
  return result.rows;
}

module.exports = {
  getUserByEmail,
  createUser,
  getUserById,
  updatePassword, 
  getUserAddresses
};
