const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const subcategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'the subcategory should have name'],
    trim: true,
  },
  slug: {
    type: String,
  },
  category: {
    type: mongoose.Types.ObjectId,
    required: [true, 'the subcategory should belong to category'],
    ref: 'Category',
  },
});

subcategorySchema.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

subcategorySchema.pre('findByIdAndUpdate', function (next) {
  this.slug = slugify(this.name);
  next();
});

const SubCategory = mongoose.model('SubCategory', subcategorySchema);

module.exports = SubCategory;
