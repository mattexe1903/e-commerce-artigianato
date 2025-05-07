const fs = require('fs');
const path = require('path');
const productModel = require('../models/productModel');

const getAllProducts = async () => {
  return await productModel.getAllProducts();
};

const getProductById = async (id) => {
  return await productModel.getProductById(id);
};

const createProduct = async (productData) => {
  // Nessun file gestito qui: multer lo ha già salvato e il controller lo rinominerà
  const newProduct = await productModel.createProduct(productData);
  return newProduct;
};

const updateProduct = async (id, productData) => {
  return await productModel.updateProduct(id, productData);
};

const updateProductPhoto = async (id, fileName) => {
  const imagePath = `/images/${fileName}`;
  return await productModel.updateProductImage(id, imagePath);
};

const deleteProduct = async (id) => {
  return await productModel.deleteProduct(id);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductPhoto,
  deleteProduct
};
