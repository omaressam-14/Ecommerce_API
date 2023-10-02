const express = require('express');
const morgan = require('morgan');
const errorController = require('./controllers/errorController');
const AppError = require('./utils/appError');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const userRoutes = require('./routes/userRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const app = express();
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const MongoSantize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const addressRoutes = require('./routes/addressRoutes');
const couponRoutes = require('./routes/couponRoutes');
const cartRoutes = require('./routes/cartRoutes');
//
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'you have reach the limit of requests, try again later',
});

//middlewares
app.use(express.static('./public'));
app.use(express.json());

//
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', limiter);
// setting security http headers
app.use(helmet());
//Data sanitize
app.use(MongoSantize());
app.use(xss());
//
app.use(hpp());
//
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
//
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/subcategories', subcategoryRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/wishlists', wishlistRoutes);
app.use('/api/v1/address', addressRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/cart', cartRoutes);

// the route is not defined
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//handling any error
app.use(errorController);

module.exports = app;
