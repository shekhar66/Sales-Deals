const AppError = require("../utils/appError");
const handleAsyncError = require("../utils/handleAsyncError");
const Owner = require("../model/ownerModel");
const APIFeatures = require("../utils/apiFeatures");

const signUpOwner = handleAsyncError(async (req, res, next) => {
  const owner = await Owner.create(req.body);
  const token = await owner.generateAuthToken();
  res.status(201).json({
    status: "success",
    data: { owner, token },
  });
});

const getOwner = handleAsyncError(async (req, res, next) => {
  let owner = null;
  if (req.url.includes("/me")) {
    owner = req.owner;
  } else {
    owner = await Owner.findOne({ email: req.params.email });
  }
  if (!owner) {
    return next(new AppError("No Owner found with the email", 404));
  }
  res.status(200).json({
    status: "success",
    data: owner,
  });
});

const deleteOwner = handleAsyncError(async (req, res, next) => {
  let owner = null;
  if (req.url.includes("/me")) {
    owner = req.owner;
  } else {
    owner = await Owner.findOne({ email: req.params.email });
  }
  if (!owner) {
    return next(new AppError("No document found with that Email", 404));
  }
  await owner.remove();
  res.status(204).json({
    status: "success",
    data: null,
  });
});

const getAllOwners = handleAsyncError(async (req, res, next) => {
  const features = new APIFeatures(Owner.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: doc.length,
    data: doc,
  });
});

const loginOwner = handleAsyncError(async (req, res, next) => {
  const owner = await Owner.findByCredentials(
    req.body.email,
    req.body.password,
    next
  );
  if (owner) {
    const token = await owner.generateAuthToken();

    res.status(200).json({
      status: "success",
      data: { token },
    });
  }
});

const updateOwner = handleAsyncError(async (req, res, next) => {
  let owner = null;
  if (req.url.includes("/me")) {
    owner = req.owner;
  } else {
    owner = await Owner.findOne({ email: req.params.email });
  }

  const updates = Object.keys(req.body);
  const allowedUpdates = ["firstname", "lastname", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return next(new AppError("Invalid Properties for Updates", 400));
  }
  updates.forEach((update) => (owner[update] = req.body[update]));

  await owner.save();

  res.status(200).json({
    status: "success",
    data: owner,
  });
});

const healthCheck = handleAsyncError(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: 'I am fine',
  });
});

module.exports = {
  getAllOwners,
  getOwner,
  signUpOwner,
  updateOwner,
  loginOwner,
  deleteOwner,
  healthCheck
};
