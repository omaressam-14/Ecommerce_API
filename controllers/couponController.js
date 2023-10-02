const couponModel = require('../models/couponModel');
const handlerFactory = require('./handlerFactory');

exports.createCoupon = handlerFactory.createOne(couponModel);
exports.updateCoupon = handlerFactory.updateOne(couponModel);
exports.deleteCoupon = handlerFactory.deleteOne(couponModel);
exports.getCoupon = handlerFactory.getOne(couponModel);
exports.getAllCoupons = handlerFactory.getAll(couponModel);
