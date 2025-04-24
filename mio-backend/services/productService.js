const productModel = require('../models/productModel');

const getAllProducts = async () => {
  const products = await productModel.getAllProducts();
  return products;
}

const getProductById = async (id) => {
  const product = await productModel.getProductById(id);
  return product;
}

const createProduct = async (productData) => {
  const product = await productModel.createProduct(productData);
  return product;
}

const updateProduct = async (id, productData) => {
  const product = await productModel.updateProduct(id, productData);
  return product;
}

const deleteProduct = async (id) => {
  const product = await productModel.deleteProduct(id);
  return product;
}

module.exports = {
    getAllProducts,
    getProductById, 
    createProduct,
    updateProduct,
    deleteProduct
};