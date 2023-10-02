const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'the user id must be defined'],
      ref: 'User',
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalPrice: {
      type: Number,
    },
    totalPriceAfterDiscount: {
      type: Number,
    },
    discount: Number,
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
