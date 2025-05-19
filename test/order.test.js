const request = require('supertest');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './mio-backend/.env' });

const app = require('../mio-backend/app');
const pool = require('../mio-backend/db');

let token;
let userId;
let productId;

beforeAll(async () => {
  // Rimuovi eventuali utenti di test esistenti
  await pool.query("DELETE FROM users WHERE email = 'testcart@example.com'");

  // Registra nuovo utente
  await request(app).post('/api/register').send({
    nome: 'Test',
    cognome: 'User',
    email: 'testcart@example.com',
    password: 'password123',
    conferma: 'password123'
  });

  // Effettua login per ottenere token
  const loginRes = await request(app).post('/api/login').send({
    email: 'testcart@example.com',
    password: 'password123'
  });

  if (!loginRes.body.token) {
    throw new Error('Login fallito durante il test.');
  }
  token = loginRes.body.token;

  // Decodifica il token per ottenere userId
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  userId = decoded.user_id;

  // Inserisci un prodotto di test nel DB
  const prod = await pool.query(
    `INSERT INTO products (product_name, price, photo, photo_description, quantity, creation_date)
     VALUES ('Test Product', 9.99, 'photo.jpg', 'desc', 100, NOW())
     RETURNING product_id`
  );
  productId = prod.rows[0].product_id;
});

afterAll(async () => {
  // Pulizia dati di test da DB
  await pool.query("DELETE FROM carts_products WHERE product_id = $1", [productId]);
  await pool.query("DELETE FROM carts WHERE user_id = $1", [userId]);
  await pool.query("DELETE FROM products WHERE product_id = $1", [productId]);
  await pool.query("DELETE FROM users WHERE email = 'testcart@example.com'");
  await pool.end();
});

describe('Ordini Routes', () => {
  test('POST /api/cart/add - aggiunge prodotto al carrello', async () => {
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

  test('POST /api/createOrder - crea un ordine con indirizzo valido', async () => {
    // Aggiungi prodotto al carrello prima di creare l'ordine
    const addToCartRes = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 });
// Debug

    const orderData = {
      address: {
        street: 'Via Test 123',
        city: 'Milano',
        cap: '20100',
        province: 'MI'
      },
      saveAddress: true
    };

    const res = await request(app)
      .post('/api/createOrder')
      .set('Authorization', `Bearer ${token}`)
      .send(orderData);
// Debug

    // Verifica se la creazione dell'ordine è andata a buon fine
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('orderId');
  });

  test('GET /api/getOrdersByUserId - recupera ordini utente', async () => {
    const res = await request(app)
      .get('/api/getOrdersByUserId')
      .set('Authorization', `Bearer ${token}`);
// Debug

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('order_id');
  });
});
