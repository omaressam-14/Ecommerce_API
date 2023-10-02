const catchAsync = require('../utils/catchAsync');
const userModel = require('../models/userModel');
const AppError = require('../utils/appError');

exports.addAdreesTo = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { addresses } = await userModel.findByIdAndUpdate(
    user._id,
    { $addToSet: { addresses: req.body } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      addresses,
    },
  });
});

exports.removeAddress = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { addresses } = await userModel.findByIdAndUpdate(
    user._id,
    { $pull: { addresses: { _id: req.body.address } } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      addresses,
    },
  });
});

exports.getAddress = catchAsync(async (req, res, next) => {
  const { addresses } = await userModel.findById(req.user._id);
  if (!addresses) return next(new AppError('no user Found'));

  res.status(200).json({
    status: 'success',
    results: addresses.length,
    data: {
      addresses,
    },
  });
});
