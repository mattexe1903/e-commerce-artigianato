const pool = require('../db');

const getAllProducts = async () => {
  const result = await pool.query('SELECT * FROM prodotti');
  return result.rows;
};

module.exports = {
    getAllProducts
};