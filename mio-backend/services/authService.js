//const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const login = async (email, password) => {
  const user = await userModel.getUserByEmail(email);
  if (!user) throw new Error('Credenziali non valide');

  //const validPassword = await bcrypt.compare(password, user.password);
  const validPassword = password === user.user_password;
  if (!validPassword) throw new Error('Credenziali non valide');

  return {
    id: user.user_id,
    nome: user.user_name,
    cognome: user.surname,
    email: user.email,
    ruolo: user.user_role, 
    dataCreazione: user.creation_date
  };
};

const register = async (nome, cognome, email, password, ruolo) => {
  const existingUser = await userModel.getUserByEmail(email);
  console.log(existingUser);
  if (existingUser) throw new Error('Email già registrata');

  //const hashedPassword = await bcrypt.hash(password, 10);
  const hashedPassword = password;
  console.log("Dati in ingresso a createUser:", { nome, cognome, email, hashedPassword, ruolo });
  const newUser = await userModel.createUser(nome, cognome, email, hashedPassword, ruolo);

  return {
    id: newUser.user_id,
    nome: newUser.user_name,
    email: newUser.email
  };
}

module.exports = {
  login, 
  register
};