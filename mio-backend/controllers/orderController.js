const orderService = require('../services/orderService');
const userService = require('../services/userService');

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
      res.status(201).json({ message: 'Ordine creato con successo', orderId: result.orderId });
    } else {
      res.status(400).json({ message: result.error });
    }
  } catch (error) {
    console.error('Errore nella creazione dell\'ordine:', error.message);
    res.status(500).json({ message: 'Errore interno del server' });
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

    const venditePerMese = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      total: 0
    }));

    sales.forEach(item => {
      venditePerMese[item.month - 1].total = item.total;
    });

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