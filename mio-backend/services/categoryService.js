const categoryModel = require('../models/categoryModel');

const getAllCategories = async () => {
  try {
    const categories = await categoryModel.getAllCategories();
    return categories;
  } catch (err) {
    throw new Error('Error fetching categories: ' + err.message);
  }
};

module.exports = {
    getAllCategories
};