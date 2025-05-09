const pool = require('../db');

const getAllCategories = async () => {
  const result = await pool.query('SELECT category_name FROM categories ORDER BY category_name ASC');
  return result.rows;
}

module.exports = {
    getAllCategories
};