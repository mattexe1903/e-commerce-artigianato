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

module.exports = {
    getUserInfo
};