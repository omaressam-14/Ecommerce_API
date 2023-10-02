const experss = require('express');
const router = experss.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const reviewRoutes = require('../routes/reviewRoutes');

router.use('/:productId/reviews', reviewRoutes);

router.get(
  '/stats',
  authController.protect,
  authController.restrictTo('admin'),
  productController.getProductStats
);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.uploadImages,
    productController.resizeImages,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct
  );
module.exports = router;
