const pool = require('../db');

const getCartInfo = async () => {
  const result = await pool.query('SELECT * FROM carrello');
  return result.rows;
};

const addToCart = async (userId, productId, quantity) => {
  const result = await pool.query(
    'INSERT INTO carrello (userId, productId, quantity) VALUES ($1, $2, $3) RETURNING *',
    [userId, productId, quantity]
  );
  return result.rows[0];
};

const removeFromCart = async (id) => {
  const result = await pool.query('DELETE FROM carrello WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

const clearCart = async (userId) => {
  const result = await pool.query('DELETE FROM carrello WHERE userId = $1 RETURNING *', [userId]);
  return result.rows[0];
};      

module.exports = {
    getCartInfo, 
    addToCart,
    removeFromCart,
    clearCart
};