const pool = require('../db');
const { getCartInfo, clearCart } = require('../models/cartModel');

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

const addTempAddress = async (street_address, city, cap, province) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('Aggiunta indirizzo temporaneo:', street_address, city, cap, province);
    
    const result = await client.query(
      `INSERT INTO address (street_address, city, cap, province, country)
       VALUES ($1, $2, $3, $4, 'Italia')
       RETURNING addres_id`,
      [street_address, city, cap, province]
    );

    const addressId = result.rows[0].address_id;

    await client.query('COMMIT');
    return { success: true, addressId };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore nell\'aggiunta dell\'indirizzo temporaneo:', error.message);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
};


const findAddress = async (street_address, city, cap, province) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT addres_id FROM address
     WHERE street_address = $1 AND city = $2 AND cap = $3 AND province = $4 
     LIMIT 1`,
      [street_address, city, cap, province]
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Errore nella ricerca dell\'indirizzo:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

const getOrdersByUserId = async (userId) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT o.order_id, o.order_date, o.total, s.state_name
       FROM orders o
       JOIN states s ON o.order_state = s.state_id
       WHERE o.user_id = $1`,
      [userId]
    );

    return result.rows;
  } catch (error) {
    console.error('Errore nel recupero degli ordini:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createOrderFromCart,
  addTempAddress, 
  findAddress,
  getOrdersByUserId
};