const handlerFactory = require('./handlerFactory');
const categoryModel = require('../models/categoryModel');

exports.createCategory = handlerFactory.createOne(categoryModel);
exports.getCategory = handlerFactory.getOne(categoryModel);
exports.getAllCategories = handlerFactory.getAll(categoryModel);
exports.deleteCategory = handlerFactory.deleteOne(categoryModel);
exports.updateCategory = handlerFactory.updateOne(categoryModel);
