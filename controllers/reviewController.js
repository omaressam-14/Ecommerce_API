const reviewController = require('../models/reviewModel');
const reviewModel = require('../models/reviewModel');
const handlerFactory = require('../controllers/handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.createReview = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id;
  req.body.productId = req.params.productId;
  const review = await reviewModel.create(req.body);
  res.status(200).json({
    status: 'success',
    message: 'review has been created',
    review,
  });
});
exports.deleteReview = handlerFactory.deleteOne(reviewController);
exports.updateReview = handlerFactory.updateOne(reviewController);
exports.getAllReviews = handlerFactory.getAll(reviewController);
exports.getReveiw = handlerFactory.getOne(reviewController);
