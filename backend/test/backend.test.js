const request = require('supertest');
const app = require('../backend/app');
require('dotenv').config({ path: './backend/.env' });


describe('Test del backend e-commerce', () => {
  test('GET / deve rispondere con messaggio di benvenuto', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/benvenuto/i);
  });

});