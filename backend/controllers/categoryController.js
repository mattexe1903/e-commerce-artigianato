const categoryService = require('../services/categoryService');

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      success: true,
      message: 'Categorie recuperate con successo',
      categories
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Errore nel recupero delle categorie'
    });
  }
};

const getAllCategoriesInfo = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategoriesInfo();
    res.status(200).json({
      success: true,
      message: 'Categorie recuperate con successo',
      categories
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Errore nel recupero delle categorie'
    });
  }
};

module.exports = {
  getAllCategories,
  getAllCategoriesInfo
};