const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'user must have name'],
      trim: true,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin', 'seller'],
    },
    email: {
      type: String,
      required: [true, 'the user must have email'],
      trim: true,
      unique: true,
      validate: [validator.isEmail, 'please Provide email'],
    },
    image: {
      type: String,
      default: 'default.jpeg',
    },
    password: {
      type: String,
      required: [true, 'the user must have password'],
      minlength: [8, 'please enter at least 8 characters'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'please enter password Confirm'],
      validate: {
        validator: function (el) {
          el === this.password;
        },
        message: 'enter the confirm password correct',
      },
      select: false,
    },
    addresses: [
      {
        name: String,
        street: String,
        city: String,
        state: String,
        postalCode: String,
      },
    ],
    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
      },
    ],
    cart: {
      type: mongoose.Types.ObjectId,
      ref: 'Cart',
    },
    phone: {
      type: String,
      required: [true, 'the user must have number'],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    resetPasswordToken: String,
    resetTokenEpires: Date,
  },
  { timestamp: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.isPasswordChangeAfter = function (verify) {
  if (this.passwordChangedAt) {
    let time = new Date(this.passwordChangedAt).getTime() / 1000;
    time = Math.floor(time);

    return time > verify.iat;
  }

  return false;
};

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetTokenEpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
