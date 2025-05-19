const nodemailer = require('nodemailer');
const orderService = require('../services/orderService');
const userService = require('../services/userService');
const userModel = require('../models/userModel'); // serve per recuperare i dati utente (nome, email)
const orderModel = require('../models/orderModel'); // serve per ottenere i dettagli dell’ordine

const createOrder = async (req, res) => {
  const userId = req.user.user_id;
  const {
    address: {
      street: street_address,
      city,
      cap,
      province
    },
    saveAddress
  } = req.body;

  try {
    let finalAddressId;
    const existingAddress = await orderService.findAddress(street_address, city, cap, province);

    if (existingAddress) {
      finalAddressId = existingAddress.addres_id;
    } else if (saveAddress) {
      const address = await userService.addUserAddress(userId, street_address, city, cap, province);
      finalAddressId = address.addres_id;
    } else {
      const tmpAddress = await orderService.addTempAddress(street_address, city, cap, province);
      finalAddressId = tmpAddress.rows[0].addres_id;
    }

    const result = await orderService.createOrderFromCart(userId, finalAddressId);

    if (result.success) {
      // INVIO EMAIL QUI
      const user = await userModel.getUserById(userId); // supponendo che questa funzione esista
      const orders = await orderModel.getOrdersByUserId(userId); // ottieni tutti, ma prendi solo l’ultimo
      const lastOrder = orders[0];

      const productsList = lastOrder.products.map(p => `
        <li>
          ${p.product_name} (x${p.quantity}) - €${(p.single_price * p.quantity).toFixed(2)}
        </li>`).join('');

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: `"Supporto" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Conferma Ordine - Grazie per il tuo acquisto!',
        html: `
          <p>Ciao ${user.user_name || ''},</p>
          <p>Grazie per il tuo ordine! Ecco un riepilogo:</p>
          <ul>
            ${productsList}
          </ul>
          <p>Totale: <strong>€${lastOrder.total}</strong></p>
          <p>Spedizione a: ${street_address}, ${cap} ${city} (${province})</p>
          <p>Ti invieremo un'altra email quando l'ordine sarà spedito.</p>
          <p>Grazie per aver scelto la nostra piattaforma!</p>
        `
      };

      await transporter.sendMail(mailOptions);

      return res.status(201).json({ message: 'Ordine creato con successo', orderId: result.orderId });
    } else {
      return res.status(400).json({ message: result.error });
    }
  } catch (error) {
    console.error('Errore nella creazione dell\'ordine:', error.message);
    return res.status(500).json({ message: 'Errore interno del server' });
  }
};


const getOrdersByUserId = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const orders = await orderService.getOrdersByUserId(userId);
    if (orders) {
      res.status(200).json(orders);
    } else {
      res.status(404).json({ message: 'Nessun ordine trovato' });
    }
  } catch (error) {
    console.error('Errore nel recupero degli ordini:', error.message);
    res.status(500).json({ message: 'Errore interno del server' });
  }
}

const getOrdersByArtisanId = async (req, res) => {
  const artisanId = req.user.user_id;

  try {
    const orders = await orderService.getOrdersByArtisanId(artisanId);
    if (orders) {
      res.status(200).json(orders);
    } else {
      res.status(404).json({ message: 'Nessun ordine trovato' });
    }
  } catch (error) {
    console.error('Errore nel recupero degli ordini:', error.message);
    res.status(500).json({ message: 'Errore interno del server' });
  }
}

const getSales = async (req, res) => {
  try {
    const sales = await orderService.getSales();

    const mesi = [
      '', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio',
      'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    // Inizializza i dati con zero vendite per ogni mese
    const venditePerMese = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      total: 0
    }));

    // Riempie i mesi presenti nel DB
    sales.forEach(item => {
      venditePerMese[item.month - 1].total = item.total;
    });

    // Estrai le label e i dati finali
    const labels = venditePerMese.map(item => mesi[item.month]);
    const dati = venditePerMese.map(item => item.total);

    res.status(200).json({ labels, dati });
  } catch (error) {
    console.error('Errore nel recupero delle vendite:', error.message);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

const getDailySalesByArtisan = async (req, res) => {
  const artisanId = req.user.user_id;
  

  try {
    const rawData = await orderService.getDailySalesByArtisan(artisanId);

    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const dayMap = Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, total: 0 }));

    rawData.forEach(entry => {
      dayMap[entry.day - 1].total = entry.total;
    });

    const labels = dayMap.map(entry => `Giorno ${entry.day}`);
    const dati = dayMap.map(entry => entry.total);

    res.json({ labels, dati });

  } catch (error) {
    console.error('Errore nel recupero delle vendite giornaliere:', error.message);
    res.status(500).json({ message: 'Errore interno del server' });
  }
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getOrdersByArtisanId,
  getSales,
  getDailySalesByArtisan
};