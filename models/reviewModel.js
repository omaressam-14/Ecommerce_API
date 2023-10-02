const mongoose = require('mongoose');
const productModel = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');

const reviewSchema = mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Your should type something in review', 400],
    trim: true,
  },
  rating: {
    type: Number,
    min: [1, 'rating must be greater than 1'],
    max: [5, 'rating must be lower than 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  productId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'the review should belong to product'],
    ref: 'Tour',
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'the review should belong to user'],
    ref: 'User',
  },
});

reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: 'name image',
  });
  next();
});

// method to calc the average rating
reviewSchema.statics.calcRatingsAverage = async function (productId) {
  const stats = await this.aggregate([
    // get the specific product
    { $match: { productId: productId } },
    {
      $group: {
        _id: '$productId',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  console.log('stas', stats);
  // update the product
  if (stats.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await productModel.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// we use post to see the saved document
reviewSchema.post('save', function () {
  this.constructor.calcRatingsAverage(this.productId);
});

////////////
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // get instance of the doc to get the product id
  const curDoc = await this.model.findOne(this.getQuery());
  // save the doc to pass it
  this.ddoc = curDoc;
  // save the prod id
  this.ppid = curDoc.productId;
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // use the model to access calcAvg
  await this.ddoc.constructor.calcRatingsAverage(this.ppid);
});
////////////////

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
