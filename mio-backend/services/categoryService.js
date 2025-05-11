const categoryModel = require('../models/categoryModel');

const getAllCategories = async () => {
  try {
    const categories = await categoryModel.getAllCategories();
    return categories;
  } catch (err) {
    throw new Error('Error fetching categories: ' + err.message);
  }
};

const getAllCategoriesInfo = async () => {
  try {
    const categories = await categoryModel.getAllCategoriesInfo();
    return categories;
  } catch (err) {
    throw new Error('Error fetching categories info: ' + err.message);
  }
};

module.exports = {
    getAllCategories,
    getAllCategoriesInfo
};