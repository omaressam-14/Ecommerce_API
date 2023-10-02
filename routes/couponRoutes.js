const router = require('express').Router();
const authController = require('../controllers/authController');
const couponController = require('../controllers/couponController');

router.use(authController.protect, authController.restrictTo('admin'));

router
  .route('/')
  .get(couponController.getAllCoupons)
  .post(couponController.createCoupon);

router
  .route('/:id')
  .get(couponController.getCoupon)
  .patch(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

module.exports = router;
