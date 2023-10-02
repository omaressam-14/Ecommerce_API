const express = require('express');
const router = express.Router();
const addressController = require('../controllers/adressController');
const authController = require('../controllers/authController');

router.use(authController.protect, authController.restrictTo('user'));
router
  .route('/')
  .get(addressController.getAddress)
  .patch(addressController.addAdreesTo)
  .delete(addressController.removeAddress);

module.exports = router;
