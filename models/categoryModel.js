const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const categroySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'the category must have name'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'the category should have description '],
  },
  slug: {
    type: String,
  },
});

categroySchema.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

categroySchema.pre('findByIdAndUpdate', function (next) {
  this.slug = slugify(this.name);
  next();
});

const Category = mongoose.model('Category', categroySchema);

module.exports = Category;
