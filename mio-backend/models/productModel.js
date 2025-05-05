const pool = require('../db');

const getAllProducts = async () => {
  const result = await pool.query('SELECT * FROM prodotti');
  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query('SELECT * FROM prodotti WHERE id = $1', [id]);
  return result.rows[0];
}

const createProduct = async (productData) => {
  const { nome, descrizione, prezzo, immagine, quantita, utenteId, categoria } = productData;

  const result = await pool.query(
    `INSERT INTO prodotti (nome, descrizione, prezzo, foto, quantita, utente_id, categoria)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [nome, descrizione, prezzo, immagine, quantita, utenteId, categoria]
  );

  return result.rows[0];
};


const updateProduct = async (id, productData) => {
  const { name, description, price, imageUrl } = productData;
  const result = await pool.query(
    'UPDATE prodotti SET name = $1, description = $2, price = $3, imageUrl = $4 WHERE id = $5 RETURNING *',
    [name, description, price, imageUrl, id]
  );
  return result.rows[0];
}

const deleteProduct = async (id) => {
  const result = await pool.query('DELETE FROM prodotti WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct, 
    updateProduct, 
    deleteProduct
};