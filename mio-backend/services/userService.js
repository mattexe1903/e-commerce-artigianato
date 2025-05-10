const userModel = require('../models/userModel');

const getUserInfo = async (userId) => {
    try {
        const userInfo = await userModel.getUserById(userId);
        return userInfo;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
}; 

const getArtigianiInfo = async (userId) => {
    try {
        const artigianiInfo = await userModel.getArtigianiById(userId);
        return artigianiInfo;
    } catch (error) {
        console.error('Error fetching artigiani info:', error);
        throw error;
    }
}

const getUserInformation = async (userId) => {
    try {
        const addresses = await userModel.getUserAddresses(userId);
        return addresses;
    } catch (error) {
        console.error('Error fetching user addresses:', error);
        throw error;
    }
};

// Aggiunta della funzione per aggiornare la password
const updatePassword = async (userId, newPassword) => {
    try {
        // Chiama il model per aggiornare la password
        const updatedUser = await userModel.updatePassword(userId, newPassword);
        return updatedUser;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};

const getUserByEmail = async (email) => {
    try {
        const user = await userModel.getUserByEmail(email);
        return user;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error;
    }
};

const addUserAddress = async (userId, street_address, city, cap, province) => {
    try {
        const address = await userModel.addUserAddress(userId, street_address, city, cap, province);
        return address;
    } catch (error) {
        console.error('Error adding address:', error);
        throw error;
    }
}; 

const getInventory = async (userId) => {
    try {
        const inventory = await userModel.getInventory(userId);
        return inventory;
    } catch (error) {
        console.error('Error fetching inventory:', error);
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
    getInventory
};
