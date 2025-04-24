const userService = require('../services/userService');

const getUserInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const userInfo = await userService.getUserInfo(userId);
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error fetching user info:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 

module.exports = {
    getUserInfo
}