const userModel = require('../models/userModel');

const getUserInfo = async (userId) => {
    try {
        const userInfo = await userModel.getUserById(userId);
        return userInfo;
    } catch (error) {
throw error;
    }
};

const getArtigianiInfo = async (userId) => {
    try {
        const artigianiInfo = await userModel.getArtigianiById(userId);
        return artigianiInfo;
    } catch (error) {
throw error;
    }
}

const getUserInformation = async (userId) => {
    try {
        const addresses = await userModel.getUserAddresses(userId);
        return addresses;
    } catch (error) {
throw error;
    }
};

const updatePassword = async (userId, newPassword) => {
    try {
        const updatedUser = await userModel.updatePassword(userId, newPassword);
        return updatedUser;
    } catch (error) {
throw error;
    }
};

const getUserByEmail = async (email) => {
    try {
        const user = await userModel.getUserByEmail(email);
        return user;
    } catch (error) {
throw error;
    }
};

const addUserAddress = async (userId, street_address, city, cap, province) => {
    try {
        const address = await userModel.addUserAddress(userId, street_address, city, cap, province);
        return address;
    } catch (error) {
throw error;
    }
};

const getInventory = async (userId) => {
    try {
        const inventory = await userModel.getInventory(userId);
        return inventory;
    } catch (error) {
throw error;
    }
};

const getArtisanRegistered = async () => {
    try {
        const artisanRegistered = await userModel.getArtisanRegistered();
        return artisanRegistered;
    } catch (error) {
throw error;
    }
};

const deleteArtisan = async (artisanId) => {
    try {
        const result = await userModel.deleteArtisan(artisanId);
        return result;
    } catch (error) {
throw error;
    }
};

module.exports = {
    getUserInfo,
    getArtigianiInfo,
    getUserInformation,
    updatePassword,
    getUserByEmail,
    addUserAddress,
    getInventory,
    getArtisanRegistered,
    deleteArtisan
};