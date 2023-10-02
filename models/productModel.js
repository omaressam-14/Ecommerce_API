const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'the product should have name'],
      trim: true,
    },
    slug: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'enter the price of the product'],
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'the rating should be above 1'],
      max: [5, 'the rating should be below 5'],
      set: (val) => Math.round(val * 10) / 10, // 4.7777 = 47.777 => 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      minlenght: [10, 'the description is too small'],
    },
    quantity: {
      type: Number,
      required: [true, 'the product should have quantity'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: [true, 'the product should belong to category'],
      ref: 'Category',
    },
    subcategory: {
      type: mongoose.Types.ObjectId,
      required: [true, 'the product should belong to subcategory'],
      ref: 'Subcategory',
    },
    brand: {
      type: mongoose.Types.ObjectId,
      required: [true, 'the product should belong to brand'],
      ref: 'Brand',
    },
    images: [String],
    description: {
      type: String,
      required: [true, 'product should have description'],
      trim: true,
    },
  },
  { timestamp: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

productSchema.pre('findByIdAndUpdate', function (next) {
  this.slug = slugify(this.name);
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
