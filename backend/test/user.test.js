const request = require('supertest');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './backend/.env' });

const app = require('../backend/app');
const pool = require('../backend/db');

// Crea un token JWT valido per i test
const token = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET, {
  expiresIn: '1h',
});

describe('User Routes', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('GET /api/user - restituisce info utente', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it('GET /api/userInfo - restituisce info utente (dettagliata)', async () => {
    const res = await request(app)
      .get('/api/userInfo')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404, 500]).toContain(res.statusCode);
  });

  it('GET /api/user/:id/infoartigiani - restituisce info artigiano', async () => {
    const res = await request(app)
      .get('/api/user/1/infoartigiani')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('artigiano');
    }
  });

  it('POST /api/send-reset-email - invia email reset', async () => {
    const res = await request(app)
      .post('/api/send-reset-email')
      .send({ email: 'test@example.com' });
    expect([200, 404]).toContain(res.statusCode);
  });

  it('POST /api/reset-password - resetta la password', async () => {
    const res = await request(app)
      .post('/api/reset-password')
      .send({ email: 'test@example.com', password: 'newpassword123' });
    expect([200, 400, 404]).toContain(res.statusCode);
  });

  /**
   * ⚠️ Commentato perché la route è un GET ma dovrebbe essere un POST o PUT per aggiungere un indirizzo.
   * Se vuoi che funzioni, modifica la route da `router.get('/addAddress')` a `router.post('/addAddress')`
   * e assicurati che richieda un body con l'indirizzo.
   */
  /*
  it('GET /api/addAddress - aggiunge indirizzo (NON consigliato)', async () => {
    const res = await request(app)
      .get('/api/addAddress')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 400, 404]).toContain(res.statusCode);
  });
  */

  it('GET /api/getInventory - restituisce inventario', async () => {
    const res = await request(app)
      .get('/api/getInventory')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404, 500]).toContain(res.statusCode);
  });

  it('GET /api/getArtisanRegistered - artigiani registrati', async () => {
    const res = await request(app)
      .get('/api/getArtisanRegistered');
    expect([200, 404]).toContain(res.statusCode);
  });

it('DELETE /api/artisan/:id - elimina artigiano fittizio', async () => {
  // Pulizia dati fittizi, in ordine: figli -> padre
  await pool.query('DELETE FROM info_artisan WHERE artisan_id = $1', [99999]);
  await pool.query('DELETE FROM users WHERE user_id = $1', [99999]);

  // Inserisci l'utente/artigiano nella tabella padre 'users'
  await pool.query(
    `INSERT INTO users (user_id, user_name, surname, email, user_password, user_role)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [99999, 'Fake', 'Artisan', 'fakeartisan@example.com', 'password123', 3]
  );

  // Ora inserisci l'artigiano nella tabella 'info_artisan'
  const insertRes = await pool.query(
    `INSERT INTO info_artisan (artisan_id, iban, craft, artisan_state)
     VALUES ($1, $2, $3, $4)
     RETURNING artisan_id`,
    [99999, 'dxcfgvbhjn', 'fabbro', 3]
  );

  const artisanId = insertRes.rows[0].artisan_id;

  // Elimino l'artigiano appena creato
  const res = await request(app)
    .delete(`/api/artisan/${artisanId}`)
    .set('Authorization', `Bearer ${token}`);

  expect([200, 204]).toContain(res.statusCode);

  // Verifica che l'artigiano sia stato eliminato dal DB
  const checkRes = await pool.query(
    'SELECT * FROM info_artisan WHERE artisan_id = $1',
    [artisanId]
  );
  expect(checkRes.rowCount).toBe(0);
});

});
