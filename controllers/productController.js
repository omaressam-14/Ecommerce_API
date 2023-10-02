const productModel = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

exports.getAllProducts = handlerFactory.getAll(productModel);
exports.createProduct = handlerFactory.createOne(productModel);
exports.deleteProduct = handlerFactory.deleteOne(productModel);
exports.getProduct = handlerFactory.getOne(productModel);
exports.updateProduct = handlerFactory.updateOne(productModel);

// multer
// multer storage
const multerStorage = multer.memoryStorage();

// multer filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('please enter images only', 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadImages = upload.fields([{ name: 'images', maxCount: 5 }]);

//sharp

exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();
  req.body.images = [];
  const proms = req.files.images.map(async (img, i) => {
    const filename = `product-${img.originalname.split('.')[1]}-${(
      Math.random() * 1000
    ).toFixed(8)}-${Date.now()}-${i + 1}.jpeg`;

    await sharp(img.buffer)
      .resize(1000, 1000)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/imgs/products/${filename}`);

    req.body.images.push(filename);
  });
  await Promise.all(proms);
  next();
});

//agregtion
exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await productModel.aggregate([
    {
      $group: {
        _id: null,
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
        mostSold: { $max: '$sold' },
        quantityOfProducts: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
