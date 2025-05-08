const path = require('path');
const fs = require('fs');
const productService = require('../services/favouriteService');

const addProductToFavourites = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const result = await productService.addProductToFavourites(userId, productId);
        res.status(200).json({
            success: true,
            message: 'Prodotto aggiunto ai preferiti',
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Errore nell\'aggiunta ai preferiti'
        });
    }
}

const removeProductFromFavourites = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const result = await productService.removeProductFromFavourites(userId, productId);
        res.status(200).json({
            success: true,
            message: 'Prodotto rimosso dai preferiti',
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Errore nella rimozione dai preferiti'
        });
    }
}

module.exports = {
    addProductToFavourites, 
    removeProductFromFavourites
};