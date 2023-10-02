const cartModel = require('../models/cartModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const productModel = require('../models/productModel');
const couponModel = require('../models/couponModel');

const calcTotalPrice = catchAsync(async (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((el) => {
    totalPrice += el.price * el.quantity;
  });
  cart.totalPrice = totalPrice;

  if (cart.totalPriceAfterDiscount) {
    cart.totalPriceAfterDiscount = (
      cart.totalPrice -
      cart.totalPrice * cart.discount
    ).toFixed(2);
  }

  await cart.save();
});

exports.addItemToCart = catchAsync(async (req, res, next) => {
  let { price } = await productModel.findOne({ _id: req.body.productId });
  req.body.price = price;
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    let newCart = new cartModel({
      cartItems: [req.body],
      user: req.user._id,
    });
    // await newCart.save();
    calcTotalPrice(newCart);

    res.status(200).json({
      status: 'success',
      data: {
        newCart,
      },
    });
  } else {
    let findProd = cart.cartItems.find(
      (el) => el.productId == req.body.productId
    );
    if (findProd) {
      findProd.quantity += 1;
    } else {
      cart.cartItems.push(req.body);
    }

    // await cart.save();
    calcTotalPrice(cart);

    res.status(200).json({
      status: 'success',
      data: {
        cart,
      },
    });
  }
});

exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  let cart = await cartModel.findOneAndUpdate(
    { user: req.user.id },
    {
      $pull: { cartItems: { _id: req.body.itemId } },
    },
    { new: true }
  );

  if (!cart) return next(new AppError('no cart Found', 404));

  calcTotalPrice(cart);
  const { cartItems } = cart;

  res.status(204).json({
    status: 'success',
    message: 'the item is deleted',
    data: {
      cartItems,
    },
  });
});

exports.changeQuantity = catchAsync(async (req, res, next) => {
  let cart = await cartModel.findOne({ user: req.user._id });

  let findProd = cart.cartItems.find(
    (el) => el.productId == req.body.productId
  );

  if (!findProd) return next(new AppError('the product is not found', 404));

  if (findProd) {
    findProd.quantity = req.body.quantity;
  }

  //   await cart.save();
  calcTotalPrice(cart);

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

exports.applyCoupon = catchAsync(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    code: req.body.code,
    expires: { $gt: Date.now() },
  });
  if (!coupon) return next(new AppError('the coupon is not valid', 403));
  const cart = await cartModel.findOne({ user: req.user._id });

  cart.discount = +coupon.discount / 100;
  cart.totalPriceAfterDiscount = (
    cart.totalPrice -
    cart.totalPrice * cart.discount
  ).toFixed(2);
  await cart.save();

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user.id });
  if (!cart) return next(new AppError('no cart found', 404));
  res.status(200).json({
    status: 'success',
    results: cart.cartItems.length,
    data: {
      cart,
    },
  });
});
