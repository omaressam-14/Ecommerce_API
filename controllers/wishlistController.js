const catchAsync = require('../utils/catchAsync');
const userModel = require('../models/userModel');
const AppError = require('../utils/appError');

exports.addToWishlist = catchAsync(async (req, res, next) => {
  const user = req.user;
  let { wishlist } = await userModel
    .findByIdAndUpdate(
      user._id,
      {
        $addToSet: { wishlist: req.body.product },
      },
      { new: true, runValidators: false }
    )
    .populate('wishlist');

  if (!wishlist) return next(new AppError('there is no wishlist', 404));

  res.status(200).json({
    status: 'success',
    data: {
      wishlist,
    },
  });

  //
});

exports.deleteFromWishlist = catchAsync(async (req, res, next) => {
  const user = req.user;
  let { wishlist } = await userModel.findByIdAndUpdate(
    user._id,
    {
      $pull: { wishlist: req.body.product },
    },
    { new: true, runValidators: false }
  );

  if (!wishlist) return next(new AppError('there is no wishlist', 404));

  res.status(200).json({
    status: 'success',
    data: {
      wishlist,
    },
  });
});

exports.getWishlist = catchAsync(async (req, res, next) => {
  const { wishlist } = await userModel
    .findById(req.user._id)
    .populate('wishlist');

  if (!wishlist) return next(new AppError('no user found', 404));

  res.status(200).json({
    status: 'success',
    results: wishlist.length,
    data: {
      wishlist,
    },
  });
});
