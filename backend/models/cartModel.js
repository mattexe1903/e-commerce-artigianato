const pool = require('../db');

const getCartInfo = async (userId) => {
  const result = await pool.query('SELECT products.product_id, products.product_name, products.photo, products.photo_description, products.price, products.creation_date, carts_products.quantity FROM carts_products JOIN products ON carts_products.product_id = products.product_id JOIN carts ON carts.cart_id = carts_products.cart_id WHERE carts.user_id = $1', [userId]);
  return result.rows;
};

const addToCart = async (userId, productId, quantity) => {
  let cartResult = await pool.query(
    'SELECT cart_id FROM carts WHERE user_id = $1',
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

  const existingProductResult = await pool.query(
    'SELECT quantity FROM carts_products WHERE cart_id = $1 AND product_id = $2',
    [cartId, productId]
  );

  let result;

  if (existingProductResult.rows.length > 0) {
    const newQuantity = existingProductResult.rows[0].quantity + quantity;
    const updateResult = await pool.query(
      'UPDATE carts_products SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *',
      [newQuantity, cartId, productId]
    );
    result = updateResult.rows[0];
  } else {
    const insertResult = await pool.query(
      'INSERT INTO carts_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [cartId, productId, quantity]
    );
    result = insertResult.rows[0];
  }

  return result;
};

const removeFromCart = async (userId, productId, quantityToRemove) => {
  const cartResult = await pool.query(
    'SELECT cart_id FROM carts WHERE user_id = $1',
    [userId]
  );

  if (cartResult.rows.length === 0) {
    throw new Error("Carrello non trovato per l'utente");
  }

  const cartId = cartResult.rows[0].cart_id;

  const existing = await pool.query(
    'SELECT quantity FROM carts_products WHERE cart_id = $1 AND product_id = $2',
    [cartId, productId]
  );

  if (existing.rows.length === 0) {
    throw new Error("Prodotto non trovato nel carrello");
  }

  const currentQty = existing.rows[0].quantity;

  if (quantityToRemove >= currentQty) {
    const result = await pool.query(
      'DELETE FROM carts_products WHERE cart_id = $1 AND product_id = $2 RETURNING *',
      [cartId, productId]
    );
    return result.rows[0];
  } else {
    const result = await pool.query(
      'UPDATE carts_products SET quantity = quantity - $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *',
      [quantityToRemove, cartId, productId]
    );
    return result.rows[0];
  }
};

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