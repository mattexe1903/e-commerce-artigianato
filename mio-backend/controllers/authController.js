const authService = require('../services/authService');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authService.login(email, password);
    res.status(200).json({ message: 'Login riuscito', user });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = { login };