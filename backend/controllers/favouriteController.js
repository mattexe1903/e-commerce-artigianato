const productService = require('../services/favouriteService');

const addProductToFavourites = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.user_id;

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
};

const removeProductFromFavourites = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.user_id;

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
};

const getAllFavourites = async (req, res) => {
    const userId = req.user._id || req.user.user_id;

    try {
        const result = await productService.getAllFavourites(userId);
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
};

module.exports = {
    addProductToFavourites,
    removeProductFromFavourites,
    getAllFavourites
};