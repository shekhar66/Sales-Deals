const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const Deal = require("../model/dealModel");
const Pipeline = require("../model/pipelineModel");
const Stage = require("../model/stageModel");
const Owner = require("../model/ownerModel");
const handleAsyncError = require("../utils/handleAsyncError");

const addDeal = handleAsyncError(async (req, res, next) => {
  req = await Deal.checkDealProperties(req, next);

  const deal = await Deal.create(req.body);

  res.status(201).json({
    status: "success",
    data: { deal },
  });
});

const updateDeal = handleAsyncError(async (req, res, next) => {
  const deal = await Deal.findOne({ _id: req.params.id });
  if (!deal) {
    return next(new AppError("No document found with that ID", 404));
  }
  //   If updating pipeline, stage also should needed
  if (req.body.pipeline && !req.body.stage) {
    return next(new AppError("Stage required for pipeline update", 400));
  }
  if (req.body.stage) {
    //   If updating only stage, take pipeline as deal pipeline
    if (!req.body.pipeline) {
      req.body.pipeline = deal.pipeline._id;
      req = await Deal.checkDealProperties(req, next, true);
    }
  }
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "value",
    "stage",
    "pipeline",
    "closuredate",
    "owner",
    "leads",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return next(new AppError("Invalid updated..", 400));
  }

  updates.forEach((update) => (deal[update] = req.body[update]));

  await deal.save();
  res.status(200).json({
    status: "success",
    data: { deal },
  });
});

const getDeal = handleAsyncError(async (req, res, next) => {
  const deal = await Deal.findOne({ _id: req.params.id });
  if (!deal) {
    return next(new AppError("No document found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      deal,
    },
  });
});

const deleteDeal = handleAsyncError(async (req, res, next) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) {
    return next(new AppError("No document found with that ID", 404));
  }
  await deal.remove();
  res.status(204).json({
    status: "success",
    data: null,
  });
});

const getAllDeals = handleAsyncError(async (req, res, next) => {
  const features = new APIFeatures(Deal.find(), req.query)
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

module.exports = {
  addDeal,
  getDeal,
  updateDeal,
  deleteDeal,
  getAllDeals,
};
