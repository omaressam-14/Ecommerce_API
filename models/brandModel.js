const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const brandSchmea = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'the brand should have name'],
    trim: true,
  },
  slug: String,
  category: {
    type: mongoose.Types.ObjectId,
    required: [true, 'the brand should belong to Category'],
    ref: 'Category',
  },
  subcategory: {
    type: mongoose.Types.ObjectId,
    required: [true, 'the brand should belong to SubCategory'],
    ref: 'SubCategory',
  },
  logo: String,
  description: {
    type: String,
  },
});

brandSchmea.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

brandSchmea.pre('findByIdAndUpdate', function (next) {
  this.slug = slugify(this.name);
  next();
});

const Brand = mongoose.model('Brand', brandSchmea);
module.exports = Brand;
