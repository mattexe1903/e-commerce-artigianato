require('dotenv').config({ path: '../.env' });
const request = require('supertest');
const app = require('../app');
const pool = require('../db');

let insertedCategoryId;

async function createCleanTestCategory(categoryName) {
  await pool.query("DELETE FROM categories WHERE category_name = $1", [categoryName]);

  const result = await pool.query(
    `INSERT INTO categories (category_name)
     VALUES ($1)
     RETURNING category_id`,
    [categoryName]
  );

  return result.rows[0].category_id;
}

beforeAll(async () => {
  insertedCategoryId = await createCleanTestCategory('TestCategory');
});

afterAll(async () => {
  await pool.query("DELETE FROM categories WHERE category_name = $1", ['TestCategory']);
  await pool.end();
});

describe('Category Routes', () => {
  test('GET /api/categories - restituisce solo i nomi delle categorie', async () => {
    const res = await request(app).get('/api/categories');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.some(c => c.category_name === 'TestCategory')).toBe(true);
  });

  test('GET /api/categories-info - restituisce tutte le info delle categorie', async () => {
    const res = await request(app).get('/api/categories-info');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.categories)).toBe(true);
    const category = res.body.categories.find(c => c.category_id === insertedCategoryId);
    expect(category).toBeDefined();
    expect(category.category_name).toBe('TestCategory');
  });
});
