const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(subcategoryController.getAllSubcategories)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    subcategoryController.createSubcategory
  );

router
  .route('/:id')
  .get(subcategoryController.getSubcategory)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    subcategoryController.updateSubcategory
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    subcategoryController.deleteSubcategory
  );

module.exports = router;
