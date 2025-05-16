const userService = require('../services/userService');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getUserInfo = async (req, res) => {
  try {
    const userInfo = req.user;
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error fetching user info:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getArtigianiInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const artigianiInfo = await userService.getArtigianiInfo(userId);
    if (!artigianiInfo) {
      return res.status(404).json({ message: 'User is not an artigiano' });
    }
    return res.status(200).json(artigianiInfo);
  } catch (error) {
    console.error('Error fetching artigiani info:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserInformation = async (req, res) => {
  try {
    const user = req.user;
    const userId = req.user.user_id;
    const addresses = await userService.getUserInformation(userId);
    return res.status(200).json({ addresses, user });
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const sendResetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "L'email è richiesta." });
    }

    const user = await userService.getUserByEmail(email);
    console.log('User found:', user);

    if (!user) {
      return res.status(404).json({ message: "Nessun utente trovato con questa email." });
    }

    // Genera un token JWT valido per 1 ora
    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET || 'secret_reset_key',
      { expiresIn: '1h' }
    );

    // Costruisce il link per il reset password
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // Configura il trasportatore Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Supporto" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Richiesta di reset della password',
      html: `
      <p>Ciao ${user.user_name || ''},</p>
      <p>Hai richiesto di resettare la tua password. Clicca sul link qui sotto per farlo:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Questo link scadrà tra 1 ora.</p>
      <p>Se non hai richiesto questo, ignora questa email.</p>
    `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Email di reset inviata con successo.' });

  } catch (error) {
    console.error('Errore durante invio email di reset:', error);
    return res.status(500).json({ message: 'Errore durante l\'invio dell\'email.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token e nuova password sono richiesti.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_reset_key');
    console.log('Decoded token:', decoded);
    const userId = decoded.userId;

    await userService.updatePassword(userId, newPassword);

    return res.status(200).json({ message: 'Password aggiornata con successo.' });

  } catch (error) {
    console.error('Errore durante il reset della password:', error);
    return res.status(500).json({ message: 'Errore durante il reset della password.' });
  }
};

const addUserAddress = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { street_address, city, cap, province } = req.body;

    if (!street_address || !city || !cap || !province) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const address = await userService.addUserAddress(userId, street_address, city, cap, province);
    return res.status(201).json(address);
  } catch (error) {
    console.error('Error adding address:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getInventory = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const inventory = await userService.getInventory(userId);
    return res.status(200).json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getArtisanRegistered = async (req, res) => {
  try {
    const artisanRegistered = await userService.getArtisanRegistered();
    return res.status(200).json(artisanRegistered);
  } catch (error) {
    console.error('Error fetching artisan registered:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteArtisan = async (req, res) => {
  try {
    const artisanId = req.params.id;
    const result = await userService.deleteArtisan(artisanId);
    if (result) {
      return res.status(200).json({ message: 'Artisan deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Artisan not found' });
    }
  } catch (error) {
    console.error('Error deleting artisan:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getUserInfo,
  getArtigianiInfo,
  getUserInformation,
  sendResetEmail,
  resetPassword,
  addUserAddress,
  getInventory,
  getArtisanRegistered,
  deleteArtisan
};