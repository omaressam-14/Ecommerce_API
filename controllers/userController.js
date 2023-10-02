const userModel = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const handleFactory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

exports.createUser = (req, res, next) => {
  res.status(500).json({
    message: 'there is no route here go to /signup to create user',
  });
};

exports.getAllUsers = handleFactory.getAll(userModel);
exports.deleteUser = handleFactory.deleteOne(userModel);
exports.updateUser = handleFactory.updateOne(userModel);
exports.getUser = handleFactory.getOne(userModel);

exports.deleteMe = catchAsync(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.findMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

////////////////////////
//multer setup
const multerStorage = multer.memoryStorage();

// multer filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    return cb(null, true);
  } else {
    return cb(new AppError('please enter images only', 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('image');

// resize the image by sharp
exports.resizeImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  // rename the image to
  // user-userId-Date.jpeg
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/imgs/users/${req.file.filename}`);

  next();
});
