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

const addUserAddress = async (userId, street_address, city, cap, province) => {
    try {
        const address = await userModel.addUserAddress(userId, street_address, city, cap, province);
        return address;
    } catch (error) {
        console.error('Error adding address:', error);
        throw error;
    }
}; 

module.exports = {
    getUserInfo,
    getArtigianiInfo,
    getUserInformation, 
    addUserAddress
};