const Pipeline = require("../model/pipelineModel");
const handleAsyncError = require("../utils/handleAsyncError");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

const addPipeline = handleAsyncError(async (req, res, next) => {
  const pipeline = await Pipeline.create(req.body);
  res.status(201).json({
    status: "success",
    data: pipeline,
  });
});

const getPipeline = handleAsyncError(async (req, res, next) => {
  const pipeline = await Pipeline.findOne({ _id: req.params.id });
  if (!pipeline) {
    return next(new AppError("No document found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: pipeline,
  });
});

const deletePipeline = handleAsyncError(async (req, res, next) => {
  const pipeline = await Pipeline.findOne({ _id: req.params.id });
  if (!pipeline) {
    return next(new AppError("No document found with that ID", 404));
  }
  await pipeline.remove();
  res.status(204).json({
    status: "success",
    data: null,
  });
});

const updatePipeline = handleAsyncError(async (req, res, next) => {
  const pipeline = await Pipeline.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!pipeline) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: pipeline,
  });
});

const getAllPipelines = handleAsyncError(async (req, res, next) => {
  const features = new APIFeatures(Pipeline.find(), req.query)
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
  addPipeline,
  getPipeline,
  updatePipeline,
  deletePipeline,
  getAllPipelines,
};
