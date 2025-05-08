const pool = require('../db');

const getAllFavourites = async (userId) => {
    const result = await pool.query('SELECT * FROM favourites WHERE user_id = $1', [userId]);
    return result.rows;
}

const addProductToFavourites = async (userId, productId) => {
    //TODO: change name table into favourites
    const result = await pool.query('INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *', [userId, productId]);
    return result.rows[0];
}

const removeProductFromFavourites = async (userId, productId) => {
    const result = await pool.query('DELETE FROM favorites WHERE user_id = $1 AND product_id = $2 RETURNING *', [userId, productId]);
    return result.rows[0];
}

module.exports = {
    addProductToFavourites, 
    removeProductFromFavourites
};