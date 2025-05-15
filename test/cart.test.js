const request = require('supertest');
require('dotenv').config({ path: './mio-backend/.env' });
const app = require('../mio-backend/app'); // Percorso corretto al file app.js
const pool = require('../mio-backend/db'); // Connessione al DB per cleanup