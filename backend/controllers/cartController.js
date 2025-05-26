const cartService = require('../services/cartService');

const getCartInfo = async (req, res) => {
  const userId = req.user.user_id;
  try {
    const cart = await cartService.getCartInfo(userId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Carrello non trovato'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Carrello recuperato con successo',
      cart
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Errore nel recupero del carrello'
    });
  }
}

const addToCart = async (req, res) => {
  const userId = req.user.user_id;
  const { productId, quantity } = req.body;
  try {
    const updatedCart = await cartService.addToCart(userId, productId, quantity);
    res.status(200).json({
      success: true,
      message: 'Prodotto aggiunto al carrello con successo',
      cart: updatedCart
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Errore nell\'aggiunta del prodotto al carrello'
    });
  }
};

const removeFromCart = async (req, res) => {
  const user_id = req.user.user_id;
  const quantity = req.body.quantity || 1;
  const product_id = req.body.product_id;

  try {
    const updatedCart = await cartService.removeFromCart(user_id, product_id, quantity);
    if (!updatedCart) {
      return res.status(404).json({
        success: false,
        message: 'Carrello non trovato'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Prodotto rimosso dal carrello con successo',
      cart: updatedCart
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Errore nella rimozione del prodotto dal carrello'
    });
  }
};

const clearCart = async (req, res) => {
  const userId = req.user.user_id; 
  try {
    const clearedCart = await cartService.clearCart(userId);
    if (!clearedCart) {
      return res.status(404).json({
        success: false,
        message: 'Carrello non trovato'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Carrello svuotato con successo',
      cart: clearedCart
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Errore nello svuotamento del carrello'
    });
  }
};

module.exports = {
    getCartInfo,
    addToCart,
    removeFromCart,
    clearCart
};