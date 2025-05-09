const pool = require('../db');

const { getCartInfo, clearCart } = require('./cart');

const createOrderFromCart = async (userId, addressId) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const cartItems = await getCartInfo(userId);
    if (cartItems.length === 0) {
      throw new Error('Il carrello è vuoto.');
    }

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, order_state, total, addres_id)
       VALUES ($1, (SELECT state_id FROM states WHERE state_name = 'in attesa'), $2, $3)
       RETURNING order_id`,
      [userId, total, addressId]
    );
    const orderId = orderResult.rows[0].order_id;

    for (const item of cartItems) {
      await client.query(
        `INSERT INTO orders_products (order_id, product_id, quantity, single_price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );

      await client.query(
        `UPDATE products
         SET quantity = quantity - $1
         WHERE product_id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await clearCart(userId);

    await client.query('COMMIT');
    return { success: true, orderId };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore nella creazione ordine:', error.message);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
};

module.exports = {
    createOrderFromCart
};