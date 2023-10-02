const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const crypto = require('crypto');
const Email = require('../utils/email');

const sendToken = async (id, data, res) => {
  const token = await jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: 'success',
    token,
    data: {
      data,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, address, phone } = req.body;

  const url = `${req.protocol}://${req.get('host')}/api/v1/user/me`;

  const newUser = await userModel.create({
    name,
    email,
    password,
    passwordConfirm,
    address,
    phone,
  });

  await new Email(newUser, url).sendWelcome();

  sendToken(newUser._id, newUser, res);
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('please enter the email and password', 400));
  }
  const user = await userModel.findOne({ email: email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('wrong password or email', 401));
  }

  sendToken(user.id, user, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // getting token & check of it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(new AppError('there is no token , please login again', 401));
  //verify token
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  if (!verify) {
    return next(new AppError('invalid token please login again', 401));
  }
  // chekc if the user still exsit
  const user = await userModel.findById(verify.id);
  if (!user) return next(new AppError('invalid token please login again', 401));
  // check if th password changed after
  if (user.isPasswordChangeAfter(verify)) {
    return next(new AppError('expired token please login again', 401));
  }

  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not authrorized', 401));
    }
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const user = await userModel.findOne({ email: email });
  if (!user)
    return next(new AppError('sorry there is no user with this email', 404));

  const resetTok = user.createResetToken();
  user.save({ validationBeforeSave: false });

  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/user/resetPassword/${resetTok}`;

  //sending email with token
  await new Email(user, url).resetPassword();

  res.status(200).json({
    message: 'the email has been sent',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await userModel
    .findOne({
      resetPasswordToken: hashedToken,
      resetTokenEpires: { $gt: Date.now() },
    })
    .select('+password');

  if (!user) return next(new AppError('invalid token', 401));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangedAt = Date.now();
  user.resetPasswordToken = undefined;
  user.resetTokenEpires = undefined;

  user.save();

  sendToken(user._id, 'reset password successfully done', res);
});

exports.changeMyPassword = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).select('+password');
  const { currentPassword, password, passwordConfirm } = req.body;
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(
      new AppError('your current password is wrong, try again!', 401)
    );
  }
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  sendToken(user._id, 'password has been changed', res);
});

exports.updateMe = catchAsync(async (req, res, next) => {
  let image;
  const user = req.user;
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('to change password go to /changePassword', 400));
  }
  const { phone, address, email, name } = req.body;

  //check if there is image upload image_name
  if (req.file) {
    image = req.file.filename;
  }
  const newUpdate = await userModel.findByIdAndUpdate(
    user.id,
    { phone, address, email, name, image },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      newUpdate,
    },
  });
});
