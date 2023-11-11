const Lead = require("../model/leadModel");
const handleAsyncError = require("../utils/handleAsyncError");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const Pipeline = require("../model/pipelineModel");

const addLead = handleAsyncError(async (req, res, next) => {
  req.body.createdby = req.owner._id;

  const lead = await Lead.create(req.body);
  res.status(201).json({
    status: "success",
    data: lead,
  });
});

const updateLead = handleAsyncError(async (req, res, next) => {
  const lead = await Lead.findByIdAndUpdate(req.params.email, req.body, {
    new: true,
    runValidators: true,
  });

  if (!lead) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: lead,
  });
});

const getLead = handleAsyncError(async (req, res, next) => {
  const lead = await Lead.findOne({ email: req.params.email });
  if (!lead) {
    return next(new AppError("No document found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: lead,
  });
});

const deleteLead = handleAsyncError(async (req, res, next) => {
  const lead = await Lead.findOneAndDelete({ email: req.params.email });
  if (!lead) {
    return next(new AppError("No document found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

const getAllLeads = handleAsyncError(async (req, res, next) => {
  const features = new APIFeatures(Lead.find(), req.query)
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
  addLead,
  getLead,
  updateLead,
  deleteLead,
  getAllLeads,
};
