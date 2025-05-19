const request = require('supertest');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './mio-backend/.env' });

const app = require('../mio-backend/app');
const pool = require('../mio-backend/db');

let token;
let userId;
let productId;

beforeAll(async () => {
  // Rimuovi eventuali utenti esistenti con la stessa email
  await pool.query("DELETE FROM users WHERE email = 'testcart@example.com'");

  // Registra un nuovo utente
  await request(app).post('/api/register').send({
    nome: 'Test',
    cognome: 'User',
    email: 'testcart@example.com',
    password: 'password123',
    conferma: 'password123' // 🔧 Corretto
  });

  // Effettua login
  const loginRes = await request(app).post('/api/login').send({
    email: 'testcart@example.com',
    password: 'password123'
  });

  // Verifica login riuscito
  if (!loginRes.body.token) {
throw new Error('Login fallito durante il test.');
  }

  token = loginRes.body.token;

  // Decodifica il token per ottenere userId
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  userId = decoded.user_id;

  // Inserisci un prodotto fittizio nel DB (con quantity)
  const prod = await pool.query(
    `INSERT INTO products (product_name, price, photo, photo_description, quantity, creation_date)
     VALUES ('Test Product', 9.99, 'photo.jpg', 'desc', 100, NOW())
     RETURNING product_id`
  );
  productId = prod.rows[0].product_id;
});

afterAll(async () => {
  // Cleanup del DB
  await pool.query("DELETE FROM carts_products WHERE product_id = $1", [productId]);
  await pool.query("DELETE FROM carts WHERE user_id = $1", [userId]);
  await pool.query("DELETE FROM products WHERE product_id = $1", [productId]);
  await pool.query("DELETE FROM users WHERE email = 'testcart@example.com'");
  await pool.end();
});

describe('Cart Routes', () => {
  test('POST /api/cart/add - aggiunge un prodotto al carrello', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId,
        quantity: 2
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.cart).toBeDefined();
  });

  test('GET /api/cart - recupera il carrello', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.cart)).toBe(true);
  });

  test('DELETE /api/cart/remove - rimuove un prodotto dal carrello', async () => {
    const res = await request(app)
      .delete('/api/cart/remove')
      .set('Authorization', `Bearer ${token}`)
      .send({
        product_id: productId,
        quantity: 1
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('DELETE /api/cart/clear - svuota il carrello', async () => {
  const res = await request(app)
    .delete('/api/cart/clear')
    .set('Authorization', `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  });
});
