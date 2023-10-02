const handlerFactory = require('./handlerFactory');
const brandModel = require('../models/brandModel');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createBrand = handlerFactory.createOne(brandModel);
exports.getBrand = handlerFactory.getOne(brandModel);
exports.getAllBrands = handlerFactory.getAll(brandModel);
exports.deleteBrand = handlerFactory.deleteOne(brandModel);
exports.updateBrand = handlerFactory.updateOne(brandModel);

exports.checkImage = catchAsync(async (req, res, next) => {
  if (!req.file) next();
  req.body.logo = req.file.filename;

  next();
});

// multer
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('you should only input images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadSingle = upload.single('logo');

exports.resizeImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `logo-${(Math.random() * 1000).toFixed(
    4
  )}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/imgs/brands/${req.file.filename}`);

  next();
});
