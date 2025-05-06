const productService = require('../services/productService');

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
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Prodotto non trovato'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Prodotto recuperato con successo',
      product
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Errore nel recupero del prodotto'
    });
  }
};

const createProduct = async (req, res) => {
  const {
    nome,
    descrizione,
    prezzo,
    quantita,
    immagine,
    utenteId,
    categoria
  } = req.body;

  try {
    // Assicurati che questi campi esistano nel modello di prodotto
    const newProduct = await productService.createProduct({
      nome,
      descrizione,
      prezzo,
      quantita,
      immagine,
      utenteId,
      categoria
    });

    res.status(201).json({
      success: true,
      message: 'Prodotto creato con successo',
      product: newProduct
    });
  } catch (err) {
    console.error('Errore durante la creazione del prodotto:', err)
    res.status(500).json({
      success: false,
      message: err.message || 'Errore nella creazione del prodotto'
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, imageUrl } = req.body;
  try {
    const updatedProduct = await productService.updateProduct(id, { name, description, price, imageUrl });
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Prodotto non trovato'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Prodotto aggiornato con successo',
      product: updatedProduct
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Errore nell\'aggiornamento del prodotto'
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await productService.deleteProduct(id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Prodotto non trovato'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Prodotto eliminato con successo',
      product: deletedProduct
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Errore nell\'eliminazione del prodotto'
    });
  } 
};


module.exports = {
    getAllProducts, 
    getProductById,
    createProduct,
    updateProduct, 
    deleteProduct
};