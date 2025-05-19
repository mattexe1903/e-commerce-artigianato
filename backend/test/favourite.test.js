const request = require('supertest');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './backend/.env' });

const app = require('../backend/app');
const pool = require('../backend/db');

let token;
let userId;
let productId;

beforeAll(async () => {
  // Pulisce eventuali dati residui
  await pool.query("DELETE FROM users WHERE email = 'testfavourite@example.com'");

  // Registra utente
  await request(app).post('/api/register').send({
    nome: 'Favourite',
    cognome: 'User',
    email: 'testfavourite@example.com',
    password: 'password123',
    conferma: 'password123'
  });

  // Login utente
  const loginRes = await request(app).post('/api/login').send({
    email: 'testfavourite@example.com',
    password: 'password123'
  });

  if (!loginRes.body.token) {
throw new Error('Login fallito durante il test.');
  }

  token = loginRes.body.token;

  // Decodifica token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  userId = decoded.user_id;

  // Inserisce un prodotto di test
  const prod = await pool.query(
    `INSERT INTO products (product_name, price, photo, photo_description, quantity, creation_date)
     VALUES ('Test Favourite Product', 19.99, 'photo.jpg', 'descrizione', 50, NOW())
     RETURNING product_id`
  );
  productId = prod.rows[0].product_id;
});

afterAll(async () => {
  await pool.query("DELETE FROM favorites WHERE user_id = $1", [userId]);
  await pool.query("DELETE FROM products WHERE product_id = $1", [productId]);
  await pool.query("DELETE FROM users WHERE email = 'testfavourite@example.com'");
  await pool.end();
});

describe('Favourite Routes', () => {
  test('POST /api/addToFavourites - aggiunge un prodotto ai preferiti', async () => {
    const res = await request(app)
      .post('/api/addToFavourites')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.product_id).toBe(productId);
  });

  test('GET /api/favourites - restituisce i preferiti dell\'utente', async () => {
    const res = await request(app)
      .get('/api/favourites')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ product_id: productId })
      ])
    );
  });

  test('DELETE /api/removeFromFavourites - rimuove un prodotto dai preferiti', async () => {
    const res = await request(app)
      .delete('/api/removeFromFavourites')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.product_id).toBe(productId);
  });
});
