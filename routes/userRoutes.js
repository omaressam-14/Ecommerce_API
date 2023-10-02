const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
router.route('/signup').post(authController.signUp);
router.route('/signin').post(authController.signin);

router.route('/forgetPassword').post(authController.forgetPassword);
router.route('/resetPassword/:token').post(authController.resetPassword);

router
  .route('/me')
  .get(authController.protect, userController.findMe, userController.getUser);

router
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteMe);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  )
  .post(userController.createUser);

router.use(authController.protect);
router.route('/changePassword').post(authController.changeMyPassword);

//here we update user image
router.route('/updateMe').post(
  userController.uploadUserPhoto,
  userController.resizeImage,

  authController.updateMe
);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser
  );

module.exports = router;
