const handlerFactory = require('../controllers/handlerFactory');
const subcategoryModel = require('../models/subcategoryModel');

exports.createSubcategory = handlerFactory.createOne(subcategoryModel);
exports.getSubcategory = handlerFactory.getOne(subcategoryModel);
exports.getAllSubcategories = handlerFactory.getAll(subcategoryModel);
exports.updateSubcategory = handlerFactory.updateOne(subcategoryModel);
exports.deleteSubcategory = handlerFactory.deleteOne(subcategoryModel);
