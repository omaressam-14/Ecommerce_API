const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const slugify = require('slugify');

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return next(new AppError('there is not document with this id', 404));

    res.status(204).json({
      status: 'success',
      message: 'the document is deleted',
    });
  });
};

exports.getOne = (Model, popOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};

exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const { name } = req.body;
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError('there is no doc with this id', 404));

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
};

exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const name = req.body.name;
    // req.body.slug = slugify(name);
    const doc = await Model.create(req.body);

    //send data
    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
};

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    const docs = await Model.find();

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        docs,
      },
    });
  });
};
