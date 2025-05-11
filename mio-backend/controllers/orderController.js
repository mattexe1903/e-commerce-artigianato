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
    //ERROR HANDLING
    /*if (!street_address || !city || !cap || !province) {
      return res.status(400).json({ message: 'Dati indirizzo mancanti' });
    }*/

    let finalAddressId;

    const existingAddress = await orderService.findAddress(street_address, city, cap, province);

    console.log('Indirizzo esistente:', existingAddress);
    console.log('Salva indirizzo:', saveAddress);

    if (existingAddress) {
      finalAddressId = existingAddress.addres_id;
    } else if (saveAddress) {
      const address = await userService.addUserAddress(userId, street_address, city, cap, province);
      finalAddressId = address.addres_id;
    } else {
      const tmpAddress = await orderService.addTempAddress(street_address, city, cap, province);
      finalAddressId = tmpAddress.rows[0].addres_id;
    }

    console.log('ID indirizzo finale:', finalAddressId);
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