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

const findAddress = async (street_address, city, cap, province) => {
  try {
    const result = await orderModel.findAddress(street_address, city, cap, province);
    return result;
  } catch (error) {
    throw new Error('Errore nella ricerca dell\'indirizzo: ' + error.message);
  }
};

const getOrdersByUserId = async (userId) => {
  try {
    const orders = await orderModel.getOrdersByUserId(userId);
    return orders;
  } catch (error) {
    throw new Error('Errore nel recupero degli ordini: ' + error.message);
  }
};

const getOrdersByArtisanId = async (artisanId) => {
  try {
    const orders = await orderModel.getOrdersByArtisanId(artisanId);
    return orders;
  } catch (error) {
    throw new Error('Errore nel recupero degli ordini: ' + error.message);
  }
};

module.exports = {
    createOrderFromCart, 
    addTempAddress, 
    findAddress, 
    getOrdersByUserId,
    getOrdersByArtisanId
};