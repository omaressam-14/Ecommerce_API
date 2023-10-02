const mongoose = require('mongoose');

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'the coupon should have code'],
      trim: true,
      unique: true,
    },
    expires: {
      type: Date,
    },
    discount: {
      type: Number,
    },
  },
  { timestamp: true }
);

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
