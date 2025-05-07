//const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const login = async (email, password) => {
  const user = await userModel.getUserByEmail(email);
  if (!user) throw new Error('Credenziali non valide');

  const validPassword = await bcrypt.compare(password, user.password);
  //const validPassword = password === user.user_password;
  if (!validPassword) throw new Error('Credenziali non valide');

  return {
    user_id: user.user_id,
    user_name: user.user_name,
    surname: user.surname,
    email: user.email,
    user_role: user.user_role,
    creation_date: user.creation_date
  };
};

const register = async (nome, cognome, email, password, ruolo) => {
  const existingUser = await userModel.getUserByEmail(email);
  console.log(existingUser);
  if (existingUser) throw new Error('Email già registrata');

  const hashedPassword = await bcrypt.hash(password, 10);
  //const hashedPassword = password;
  const newUser = await userModel.createUser(nome, cognome, email, hashedPassword, ruolo);

  return {
    user_id: newUser.user_id,
    user_name: newUser.user_name,
    email: newUser.email
  };
}

const saveArtigianoDetails = async (userId, craft, iban) => {
  //const existingArtigiano = await userModel.getArtigianoByUserId(userId);
  //if (existingArtigiano) throw new Error('Artigiano già registrato');

  const newArtigiano = await userModel.createArtigiano(userId, craft, iban);
  return newArtigiano;
}

const artisanIsActive = async (userId) => {
  const artisan_state = await userModel.getArtisanStateById(userId);
  return artisan_state;
}

module.exports = {
  login,
  register,
  saveArtigianoDetails,
  artisanIsActive
};