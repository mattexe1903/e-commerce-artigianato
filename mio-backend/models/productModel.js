const pool = require('../db');

const getAllProducts = async () => {
  const result = await pool.query('SELECT * FROM products');
  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]);
  return result.rows[0];
};

const createProduct = async (productData) => {
  const { product_name, photo_description, price, photo, quantity } = productData;

  const result = await pool.query(
    `INSERT INTO products 
     (product_name, photo_description, price, photo, quantity)
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [product_name, photo_description, price, photo || '', quantity]
  );

  return result.rows[0];
};

const updateProduct = async (id, productData) => {
  const { product_name, photo_description, price, quantity } = productData;

  const result = await pool.query(
    `UPDATE products 
     SET product_name = $1, photo_description = $2, price = $3, quantity = $4 
     WHERE product_id = $5 
     RETURNING *`,
    [product_name, photo_description, price, quantity, id]
  );

  return result.rows[0];
};

const updateProductImage = async (id, imagePath) => {
  const result = await pool.query(
    `UPDATE products 
     SET photo = $1 
     WHERE product_id = $2 
     RETURNING *`,
    [imagePath, id]
  );

  return result.rows[0];
};

const deleteProduct = async (id) => {
  const result = await pool.query(
    'DELETE FROM products WHERE product_id = $1 RETURNING *',
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductImage,
  deleteProduct
};
