const bcrypt = require('bcrypt');
const db = require('../db/db');

const createAdmin = async () => {
  const email = 'admin@example.com';
  const plainPassword = 'passwordSicura';
  const hashedPassword = await bcrypt.hash(plainPassword, 12);
  
  await db.query(`
    INSERT INTO users (user_name, surname, email, user_password, user_role)
    VALUES ($1, $2, $3, $4, $5)
  `, ['admin', 'admin', email, hashedPassword, 1]);
process.exit();
};

createAdmin();