const path = require('path');
const fs = require('fs');
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
      return res.status(404).json({ success: false, message: 'Prodotto non trovato' });
    }
    res.status(200).json({ success: true, message: 'Prodotto recuperato', product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createProduct = async (req, res) => {
  const { product_name, photo_description, price, quantity, category_id, user_id } = req.body;
  try {
    const newProduct = await productService.createProduct({
      product_name,
      photo: 'placeholder.jpg', // Immagine temporanea
      photo_description,
      price,
      quantity,
      category_id,
      user_id
    });

    if (req.file) {
      const extension = path.extname(req.file.originalname);
      const newFileName = `${newProduct.product_id}${extension}`;
      const oldPath = req.file.path;
      const imageDir = path.join(__dirname, '..', '..', 'WebContent', 'images');
      const newPath = path.join(imageDir, newFileName);

      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }

      fs.renameSync(oldPath, newPath);

      await productService.updateProductPhoto(newProduct.product_id, newFileName);
      newProduct.photo = newFileName;
    }

    res.status(201).json({
      success: true,
      message: 'Prodotto creato con successo',
      product: newProduct
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Errore nella creazione del prodotto'
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { product_name, photo_description, price, quantity, category_id } = req.body;

  try {
    const updatedProduct = await productService.updateProduct(id, {
      product_name,
      photo_description,
      price,
      quantity,
      category_id
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Prodotto non trovato' });
    }

    res.status(200).json({
      success: true,
      message: 'Prodotto aggiornato',
      product: updatedProduct
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateProductPhoto = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Prodotto non trovato' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Nessun file fornito' });
    }

    const extension = path.extname(req.file.originalname);
    const fileName = `${id}${extension}`;
    const newPath = path.join(__dirname, '..', '..', 'WebContent', 'images', fileName);

    fs.renameSync(req.file.path, newPath);

    await productService.updateProductPhoto(id, fileName);

    res.status(200).json({
      success: true,
      message: 'Foto aggiornata con successo',
      photo: fileName
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Prodotto non trovato' });
    }
    res.status(200).json({ success: true, message: 'Prodotto eliminato' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getLatestProducts = async (req, res) => {
  try {
    const latestProducts = await productService.getLatestProducts();
    res.status(200).json({
      success: true,
      message: 'Prodotti più recenti recuperati con successo',
      products: latestProducts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Errore nel recupero dei prodotti più recenti'
    });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductPhoto,
  deleteProduct,
  getLatestProducts
};
