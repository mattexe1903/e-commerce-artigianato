const path = require('path');
const fs = require('fs');
const productService = require('../services/favouriteService');

const addProductToFavourites = async (req, res) => {
    const { user, productId } = req.body;

    try {
        const result = await productService.addProductToFavourites(user.user_id, productId);
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
    const { user, productId } = req.body;

    try {
        const result = await productService.removeProductFromFavourites(user.user_id, productId);
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

const getAllFavourites = async (req, res) => {
    const { user } = req.user;

    try {
        const result = await productService.getAllFavourites(user.user_id);
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Nessun prodotto trovato nei preferiti'
            });
        }
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Errore nel recupero dei preferiti'
        });
    }
}



module.exports = {
    addProductToFavourites,
    removeProductFromFavourites, 
    getAllFavourites
};