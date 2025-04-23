const authService = require('../services/productService');

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({
      success: true,
      message: 'Prodotti recuperati con successo',
      products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Errore nel recupero dei prodotti'
    });
  }
}

module.exports = {
    getAllProducts
};