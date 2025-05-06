const pool = require('../db');

const getAllProducts = async () => {
  const result = await pool.query('SELECT * FROM products');
  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]);
  return result.rows[0];
}

const createProduct = async (productData) => {
  const { name, description, price, imageUrl, quantita, utenteId, categoria } = productData;

  const result = await pool.query(
    'INSERT INTO products (product_name, photo_description, price, photo) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, description, price, imageUrl]
  );

  return result.rows[0];
};


const updateProduct = async (id, productData) => {
  const { name, description, price, imageUrl } = productData;
  const result = await pool.query(
    'UPDATE products SET product_name = $1, description = $2, price = $3, photo = $4 WHERE product_id = $5 RETURNING *',
    [name, description, price, imageUrl, id]
  );
  return result.rows[0];
}

const deleteProduct = async (id) => {
  const result = await pool.query('DELETE FROM products WHERE producct_id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct, 
    updateProduct, 
    deleteProduct
};