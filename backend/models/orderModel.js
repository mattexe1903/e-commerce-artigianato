const pool = require('../../db/db');
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
       VALUES ($1, (SELECT state_id FROM states WHERE state_name = 'completato'), $2, $3)
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
return { success: false, error: error.message };
  } finally {
    client.release();
  }
};

const addTempAddress = async (street_address, city, cap, province) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO address (street_address, city, cap, province, country)
       VALUES ($1, $2, $3, $4, 'Italia')
       RETURNING addres_id`,
      [street_address, city, cap, province]
    );

    const addressId = result.rows[0].addres_id;

    await client.query('COMMIT');
    return { success: true, addressId };
  } catch (error) {
    await client.query('ROLLBACK');
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
throw error;
  } finally {
    client.release();
  }
};

const getOrdersByUserId = async (userId) => {
  const client = await pool.connect();

  try {
    const ordersResult = await client.query(
      `SELECT o.order_id, o.order_date, o.total, s.state_name
       FROM orders o
       JOIN states s ON o.order_state = s.state_id
       WHERE o.user_id = $1
       ORDER BY o.order_date DESC`,
      [userId]
    );

    const orders = ordersResult.rows;

    for (const order of orders) {
      const productsResult = await client.query(
        `SELECT 
           p.product_id,
           p.product_name,
           p.photo,
           p.photo_description,
           op.quantity,
           op.single_price
         FROM orders_products op
         JOIN products p ON op.product_id = p.product_id
         WHERE op.order_id = $1`,
        [order.order_id]
      );

      order.products = productsResult.rows;
    }

    return orders;
  } catch (error) {
throw error;
  } finally {
    client.release();
  }
};

const getOrdersByArtisanId = async (artisanId) => {
  const client = await pool.connect();

  try {
    const ordersResult = await client.query(
      `SELECT DISTINCT o.order_id, o.order_date, o.total, s.state_name
       FROM orders o
       JOIN states s ON o.order_state = s.state_id
       JOIN orders_products op ON o.order_id = op.order_id
       JOIN inventory i ON op.product_id = i.product_id
       WHERE i.user_id = $1
       ORDER BY o.order_date DESC`,
      [artisanId]
    );

    const orders = ordersResult.rows;

    for (const order of orders) {
      const productsResult = await client.query(
        `SELECT 
           p.product_id,
           p.product_name,
           p.photo,
           p.photo_description,
           op.quantity,
           op.single_price
         FROM orders_products op
         JOIN products p ON op.product_id = p.product_id
         JOIN inventory i ON p.product_id = i.product_id
         WHERE op.order_id = $1 AND i.user_id = $2`,
        [order.order_id, artisanId]
      );

      order.products = productsResult.rows;
    }

    return orders;
  } catch (error) {
throw error;
  } finally {
    client.release();
  }
};

const getSales = async () => {
  const client = await pool.connect();

  try {
    const salesResult = await client.query(
      `SELECT EXTRACT(MONTH FROM o.order_date) AS month, SUM(o.total) AS total
       FROM orders o
       WHERE o.order_state = (SELECT state_id FROM states WHERE state_name = 'completato')
       GROUP BY month
       ORDER BY month`
    );

    const salesData = salesResult.rows.map(row => ({
      month: row.month,
      total: parseFloat(row.total)
    }));

    return salesData;
  } catch (error) {
throw error;
  } finally {
    client.release();
  }
};

const getDailySalesByArtisan = async (artisanId) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT 
         EXTRACT(DAY FROM o.order_date) AS day,
         SUM(op.quantity * op.single_price) AS total
       FROM orders o
       JOIN orders_products op ON o.order_id = op.order_id
       JOIN inventory i ON op.product_id = i.product_id
       WHERE o.order_state = (SELECT state_id FROM states WHERE state_name = 'completato')
         AND i.user_id = $1
         AND DATE_TRUNC('month', o.order_date) = DATE_TRUNC('month', CURRENT_DATE)
       GROUP BY day
       ORDER BY day`,
      [artisanId]
    );

    return result.rows.map(row => ({
      day: parseInt(row.day),
      total: parseFloat(row.total)
    }));
  } catch (err) {
throw err;
  } finally {
    client.release();
  }
};





module.exports = {
  createOrderFromCart,
  addTempAddress,
  findAddress,
  getOrdersByUserId,
  getOrdersByArtisanId,
  getSales,
  getDailySalesByArtisan
};