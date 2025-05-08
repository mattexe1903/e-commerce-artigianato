const cartModel = require('../models/cartModel');

const getCartInfo = async (userId) => {
  const cart = await cartModel.getCartInfo(userId);
  return cart;
}

const addToCart = async (userId, productId, quantity) => {
  const cart = await cartModel.addToCart(userId, productId, quantity);
  return cart;
}

const removeFromCart = async (id) => {
  const cart = await cartModel.removeFromCart(id);
  return cart;
}

const clearCart = async (userId) => {
  const cart = await cartModel.clearCart(userId);
  return cart;
}

module.exports = {
    getCartInfo,
    addToCart,
    removeFromCart, 
    clearCart
};