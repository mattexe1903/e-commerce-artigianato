const request = require('supertest');
require('dotenv').config({ path: '../.env' });
const app = require('../app');
const pool = require('../db');

describe('Test Auth Routes', () => {
  // Cleanup: elimina utenti di test
  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email LIKE 'testutente%@example.com'");
    await pool.end();
  });

  test('POST /api/login - login fallito con credenziali errate', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'nonesiste@example.com',
      password: 'passwordsbagliata'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Credenziali non valide');
  });

  test('POST /api/register - errore se password non coincide con conferma', async () => {
    const res = await request(app).post('/api/register').send({
      nome: 'Mario',
      cognome: 'Rossi',
      email: `testutente1@example.com`,
      password: 'ciao1234',
      conferma: 'diversa1234'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Le password non coincidono');
  });

  test('POST /api/register - registra correttamente un cliente', async () => {
    const res = await request(app).post('/api/register').send({
      nome: 'Luisa',
      cognome: 'Bianchi',
      email: `testutente2@example.com`,
      password: 'ciao1234',
      conferma: 'ciao1234'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Registrazione riuscita');
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/registerArtigiano - registra un artigiano valido', async () => {
    const res = await request(app).post('/api/registerArtigiano').send({
      datiBase: {
        nome: 'Marco',
        cognome: 'Verdi',
        email: `testutente3@example.com`,
        password: 'artisan123'
      },
      datiExtra: {
        tipo_artigiano: 'legno',
        iban: 'IT60X0542811101000000123456'
      }
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Registrazione riuscita');
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(`testutente3@example.com`);
  });

});
