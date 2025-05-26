const pool = require('../db');

const getAllProducts = async () => {
  const result = await pool.query('SELECT * FROM products JOIN categories ON (products.category_id = categories.category_id)');
  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query('SELECT * FROM products JOIN categories ON (products.category_id = categories.category_id )WHERE product_id = $1', [id]);
  return result.rows[0];
};

const createProduct = async (productData) => {
  const { product_name, photo_description, price, photo, quantity, category_id, user_id } = productData;
  const result = await pool.query(
    `INSERT INTO products 
     (product_name, photo_description, price, photo, quantity, category_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [product_name, photo_description, price, photo || '', quantity, category_id]
  );

    const newProduct = result.rows[0];
    console.log('New product created:', newProduct);

  await pool.query(
    `INSERT INTO inventory (product_id, user_id) VALUES ($1, $2)`,
    [newProduct.product_id, user_id]
  );

  return newProduct;
};


const updateProduct = async (id, productData) => {
  const { product_name, photo_description, price, quantity, category_id } = productData;

  const result = await pool.query(
    `UPDATE products 
     SET product_name = $1, photo_description = $2, price = $3, quantity = $4, category_id = $5 
     WHERE product_id = $6 
     RETURNING *`,
    [product_name, photo_description, price, quantity, category_id, id]
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

const getLatestProducts = async () => {
  const result = await pool.query(
    `SELECT * FROM products 
     JOIN categories ON (products.category_id = categories.category_id) 
     ORDER BY creation_date DESC 
     LIMIT 10`
  );
  return result.rows;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductImage,
  deleteProduct,
  getLatestProducts
};
