const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const wishlistController = require('../controllers/wishlistController');

router.use(authController.protect, authController.restrictTo('user'));

router
  .route('/')
  .get(wishlistController.getWishlist)
  .patch(wishlistController.addToWishlist)
  .delete(wishlistController.deleteFromWishlist);

module.exports = router;
