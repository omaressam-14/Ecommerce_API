const router = require('express').Router();
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

router.use(authController.protect, authController.restrictTo('user'));
router
  .route('/')
  .get(cartController.getCart)
  .post(cartController.addItemToCart)
  .delete(cartController.removeItemFromCart)
  .patch(cartController.changeQuantity);

router.post('/applycoupon', cartController.applyCoupon);

module.exports = router;
