const favouriteModel = require('../models/favouriteModel');

const addProductToFavourites = async (userId, productId) => {
    try {
        const result = await favouriteModel.addProductToFavourites(userId, productId);
        return result;
    } catch (error) {
        throw new Error('Errore nell\'aggiunta ai preferiti: ' + error.message);
    }
};

const removeProductFromFavourites = async (userId, productId) => {
    try {
        const result = await favouriteModel.removeProductFromFavourites(userId, productId);
        return result;
    } catch (error) {
        throw new Error('Errore nella rimozione dai preferiti: ' + error.message);
    }
}

const getAllFavourites = async (userId) => {
    try {
        const result = await favouriteModel.getAllFavourites(userId);
        return result;
    } catch (error) {
        throw new Error('Errore nel recupero dei preferiti: ' + error.message);
    }
};

module.exports = {
    addProductToFavourites,
    removeProductFromFavourites,
    getAllFavourites
};