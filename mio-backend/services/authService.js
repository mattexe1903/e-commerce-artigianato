const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const login = async (email, password) => {
  const user = await userModel.getUserByEmail(email);
  if (!user) throw new Error('Credenziali non valide');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error('Credenziali non valide');

  return {
    id: user.id,
    nome: user.nome,
    email: user.email
  };
};

module.exports = { login };