const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(brandController.getAllBrands)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    brandController.createBrand
  );

router
  .route('/:id')
  .get(brandController.getBrand)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    brandController.uploadSingle,
    brandController.resizeImage,
    brandController.checkImage,
    brandController.updateBrand
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    brandController.deleteBrand
  );

module.exports = router;
