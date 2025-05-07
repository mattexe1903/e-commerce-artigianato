const userService = require('../services/userService');

const getUserInfo = async (req, res) => {
  try {
    const userInfo = req.user;
    console.log('User info:', userInfo);
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error fetching user info:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getArtigianiInfo = async (req, res) => {
  try {
    const userId = req.users.id;
    const artigianiInfo = await userService.getArtigianiInfo(userId);
    if (!artigianiInfo) {
      return res.status(404).json({ message: 'User is not an artigiano' });
    }
    return res.status(200).json(artigianiInfo);
  } catch (error) {
    console.error('Error fetching artigiani info:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserInformation = async (req, res) => {
  try {
    const user = req.user;
    console.log('dati:', user);
    const userId = req.user.user_id;
    const addresses = await userService.getUserInformation(userId);
    console.log('User addresses:', addresses);
    return res.status(200).json({ addresses, user });
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  getUserInfo,
  getArtigianiInfo,
  getUserInformation
}