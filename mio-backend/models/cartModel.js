const pool = require('../db');

const getCartInfo = async () => {
  const result = await pool.query('SELECT * FROM carts');
  return result.rows;
};

const addToCart = async (userId, productId, quantity) => {
  let cartResult = await pool.query(
    'SELECT cart_id FROM carts WHERE userId = $1',
    [userId]
  );

  let cartId;

  if (cartResult.rows.length === 0) {
    const createCartResult = await pool.query(
      'INSERT INTO carts (user_id) VALUES ($1) RETURNING cart_id',
      [userId]
    );
    cartId = createCartResult.rows[0].cart_id;
  } else {
    cartId = cartResult.rows[0].cart_id;
  }

  const insertResult = await pool.query(
    'INSERT INTO carts_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
    [cartId, productId, quantity]
  );

  return insertResult.rows[0];
};


const removeFromCart = async (id) => {
  const result = await pool.query('DELETE FROM carts_products WHERE product_id = $1 RETURNING *', [id]);
  return result.rows[0];
}

const clearCart = async (userId) => {
  const cartResult = await pool.query(
    'SELECT cart_id FROM carts WHERE user_id = $1',
    [userId]
  );

  if (cartResult.rows.length === 0) {
    return null; 
  }

  const cartId = cartResult.rows[0].cart_id;

  await pool.query(
    'DELETE FROM carts_products WHERE cart_id = $1',
    [cartId]
  );

  const deleteCartResult = await pool.query(
    'DELETE FROM carts WHERE cart_id = $1 RETURNING *',
    [cartId]
  );

  return deleteCartResult.rows[0];
};


module.exports = {
  getCartInfo,
  addToCart,
  removeFromCart,
  clearCart
};