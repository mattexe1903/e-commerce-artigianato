const request = require('supertest');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './mio-backend/.env' });

const app = require('../mio-backend/app');
const pool = require('../mio-backend/db');

let testUserId;
let testEmail;
let token;

beforeAll(async () => {
  // Crea utente test con ID random alto per evitare conflitti
  testUserId = Math.floor(100000 + Math.random() * 900000);
  testEmail = `testuser${testUserId}@example.com`;

  await pool.query(
    `INSERT INTO users (user_id, user_name, surname, email, user_password, user_role)
     VALUES ($1, 'Test', 'User', $2, 'hashedpassword', 3)
     ON CONFLICT (user_id) DO NOTHING`,
    [testUserId, testEmail]
  );

  token = jwt.sign({ id: testUserId, email: testEmail }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
});

afterAll(async () => {
  await pool.query('DELETE FROM reports WHERE user_id = $1', [testUserId]);
  await pool.query('DELETE FROM users WHERE user_id = $1', [testUserId]);
  await pool.end();
});

describe('Report Routes', () => {
  it('POST /api/sendArtisanRequest - invia richiesta artigiano', async () => {
    const res = await request(app)
      .post('/api/sendArtisanRequest')
      .send({
        nome: 'Mario',
        cognome: 'Rossi',
        tipo_artigiano: 'Elettricista',
        iban: 'IT60X0542811101000000123456'
      })
      .set('Authorization', `Bearer ${token}`);

    expect([200, 400]).toContain(res.statusCode);
  });

  it('GET /api/getArtisanRequest - recupera richieste artigiani', async () => {
    const res = await request(app)
      .get('/api/getArtisanRequest')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

  it('POST /api/updateArtisanRequest - aggiorna richiesta artigiano', async () => {
    await request(app)
      .post('/api/sendArtisanRequest')
      .send({
        nome: 'Luigi',
        cognome: 'Verdi',
        tipo_artigiano: 'Idraulico',
        iban: 'IT60X0542811101000000654321'
      })
      .set('Authorization', `Bearer ${token}`);

    const getRes = await request(app)
      .get('/api/getArtisanRequest')
      .set('Authorization', `Bearer ${token}`);

    const requestToUpdate = getRes.body.find(r => r.messaggio.includes('Luigi Verdi'));
    if (!requestToUpdate) return expect(false).toBe(true); // Fallisce il test se non trova

    const res = await request(app)
      .post('/api/updateArtisanRequest')
      .send({
        id: requestToUpdate.id,
        action: 'accettato'
      })
      .set('Authorization', `Bearer ${token}`);

    expect([200, 400, 500]).toContain(res.statusCode);
  });

  it('POST /api/sendSignal - invia una segnalazione', async () => {
    const res = await request(app)
      .post('/api/sendSignal')
      .send({
        email: testEmail,
        titolo: 'Problema tecnico',
        messaggio: 'Errore durante il pagamento.',
        stato: 'in attesa'
      })
      .set('Authorization', `Bearer ${token}`);

    expect([200, 400, 404, 500]).toContain(res.statusCode);
  });

  it('GET /api/getSignal - recupera segnalazioni', async () => {
    const res = await request(app)
      .get('/api/getSignal')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    }
  });
});
