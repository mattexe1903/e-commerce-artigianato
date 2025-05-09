const orderModel = require('../models/orderModel');

const createOrderFromCart = async (userId, addressId) => {
    try {
        const result = await orderModel.createOrderFromCart(userId, addressId);
        return result;
    } catch (error) {
        throw new Error('Errore nella creazione dell\'ordine: ' + error.message);
    }
}

module.exports = {
    createOrderFromCart
};