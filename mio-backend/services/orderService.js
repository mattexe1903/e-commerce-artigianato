const orderModel = require('../models/orderModel');

const createOrderFromCart = async (userId, addressId) => {
  try {
    const result = await orderModel.createOrderFromCart(userId, addressId);
    return result;
  } catch (error) {
    throw new Error('Errore nella creazione dell\'ordine: ' + error.message);
  }
};

const addTempAddress = async (street_address, city, cap, province) => {
  try {
    const result = await orderModel.addTempAddress(street_address, city, cap, province);
    return result;
  } catch (error) {
    throw new Error('Errore nell\'aggiunta dell\'indirizzo temporaneo: ' + error.message);
  }
}

module.exports = {
    createOrderFromCart, 
    addTempAddress
};