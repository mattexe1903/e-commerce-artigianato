const request = require('supertest');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });

const app = require('../app');
const pool = require('../db');

let token;
let userId;
let productId;
const tempImagePath = path.join(__dirname, 'temp-image.jpg'); // file fittizio

beforeAll(async () => {
  // Crea immagine fittizia
  fs.writeFileSync(tempImagePath, 'Fake image content for test');

  // Cleanup utente se già presente
  await pool.query("DELETE FROM users WHERE email = 'testproduct@example.com'");

  // Registra un nuovo utente
  await request(app).post('/api/register').send({
    nome: 'Test',
    cognome: 'Product',
    email: 'testproduct@example.com',
    password: 'password123',
    conferma: 'password123'
  });

  // Effettua login
  const loginRes = await request(app).post('/api/login').send({
    email: 'testproduct@example.com',
    password: 'password123'
  });

  token = loginRes.body.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  userId = decoded.user_id;
});

afterAll(async () => {
  if (fs.existsSync(tempImagePath)) fs.unlinkSync(tempImagePath);

  if (productId) {
    await pool.query('DELETE FROM inventory WHERE product_id = $1', [productId]);
    await pool.query('DELETE FROM products WHERE product_id = $1', [productId]);
  }
  await pool.query("DELETE FROM users WHERE email = 'testproduct@example.com'");
  await pool.end();
});

describe('Product Routes', () => {
  test('POST /api/products - crea un nuovo prodotto', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('product_name', 'Test Product')
      .field('photo_description', 'Foto di test')
      .field('price', 19.99)
      .field('quantity', 5)
      .field('category_id', 1)
      .attach('photo', tempImagePath); // usa il file fittizio
expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.product).toBeDefined();

    productId = res.body.product.product_id;
    if (!productId) throw new Error('productId non assegnato');
  });

  test('GET /api/products - recupera tutti i prodotti', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  test('GET /api/products/:id - recupera un prodotto specifico', async () => {
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.product).toBeDefined();
  });

  test('PUT /api/products/:id - aggiorna un prodotto', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .send({
        product_name: 'Updated Product',
        photo_description: 'Foto aggiornata',
        price: 29.99,
        quantity: 10,
        category_id: 1
      });
expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.product.product_name).toBe('Updated Product');
  });

  test('PATCH /api/products/:id/photo - aggiorna solo la foto del prodotto', async () => {
    const res = await request(app)
      .patch(`/api/products/${productId}/photo`)
      .attach('photo', tempImagePath); // usa di nuovo il file fittizio
expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.photo).toBeDefined();
  });

  test('GET /api/latest - recupera i prodotti più recenti', async () => {
    const res = await request(app).get('/api/latest');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  test('DELETE /api/products/:id - elimina un prodotto', async () => {
    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
