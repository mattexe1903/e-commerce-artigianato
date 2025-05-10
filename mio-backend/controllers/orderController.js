const orderService = require('../services/orderService');
const userService = require('../services/userService');
const pool = require('../db');

const createOrder = async (req, res) => {
  const userId = req.user.user_id;
  const {
    addressId,
    street_address,
    city,
    cap,
    province,
    saveAddress
  } = req.body;

  try {
    let finalAddressId = addressId;

    if (!finalAddressId) {
      if (!street_address || !city || !cap || !province) {
        return res.status(400).json({ message: 'Dati indirizzo mancanti' });
      }

      if (saveAddress) {
        // Salva indirizzo per l’utente
        const address = await userService.addUserAddress(userId, street_address, city, cap, province);
        finalAddressId = address.addres_id;
      } else {
        // Salva indirizzo temporaneo (non associato all’utente)
        const tmpAddress = await orderService.addTempAddress(street_address, city, cap, province);
        const result = await pool.query(
          `INSERT INTO address (street_address, city, cap, province, country)
           VALUES ($1, $2, $3, $4, 'Italia')
           RETURNING addres_id`,
          [street_address, city, cap, province]
        );
        finalAddressId = result.rows[0].addres_id;
      }
    }

    const result = await orderService.createOrderFromCart(userId, finalAddressId);
    if (result.success) {
      res.status(201).json({ message: 'Ordine creato con successo', orderId: result.orderId });
    } else {
      res.status(400).json({ message: result.error });
    }
  } catch (error) {
    console.error('Errore nella creazione dell\'ordine:', error.message);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

module.exports = {
    createOrder
};