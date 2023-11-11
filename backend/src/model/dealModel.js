const mongoose = require("mongoose");
const Pipeline = require("./pipelineModel");
const Stage = require("./stageModel");
const Owner = require("./ownerModel");
const AppError = require("../utils/appError");

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stages",
      required: true,
    },
    pipeline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pipelines",
      required: true,
    },
    value: {
      type: Number,
      default: 0,
    },
    closuredate: {
      type: Date,
      default: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000),
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owners",
      required: true,
    },
    lead: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Leads",
        // required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

dealSchema.pre(/^find/, function (next) {
  this.populate({
    path: "owner",
    select: "-__v",
  });
  this.populate({
    path: "stage",
    select: "-__v",
  });
  this.populate({
    path: "pipeline",
    select: "-__v",
  });
  next();
});

dealSchema.statics.checkDealProperties = async function (
  req,
  next,
  update = false
) {
  // Check whether pipeline exists or not
  const pipeline = await Pipeline.findOne({ _id: req.body.pipeline });
  if (!pipeline) {
    return next(new AppError("Provided pipeline does not exists", 400));
  }
  // Check whether the pipeline and stage are matched each other
  const stage = await Stage.findOne({
    _id: req.body.stage,
    pipeline: req.body.pipeline,
  });
  if (!stage) {
    return next(
      new AppError("Provided stage does not exists in the given pipeline", 400)
    );
  }

  req.body.pipeline = pipeline;
  req.body.stage = stage;

  //   Check for Owner
  let owner = null;
  if (req.body.owner) {
    req.body.owner = await Owner.findOne({ email: req.body.owner });
  } else if (!update) {
    req.body.owner = req.owner;
  }

  return req;
};

const Deal = mongoose.model("Deals", dealSchema);
module.exports = Deal;
