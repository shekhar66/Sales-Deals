const mongoose = require("mongoose");
const Pipeline = require("./pipelineModel");

const stageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    winpercent: {
      type: Number,
      required: true,
      min: [1, "Win Percentage must be above 1"],
      max: [100, "Win Percent must be below 100"],
    },

    pipeline: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Pipelines",
    },
    color: {
      type: String,
      default: "orange",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

stageSchema.methods.toJSON = function () {
  const stage = this;
  const stageObject = stage.toObject();

  delete stageObject.__v;
  return stageObject;
};

stageSchema.pre("save", async function (next) {
  this.populate({
    path: "pipeline",
    select: "-__v -stages",
  });
  next();
});

stageSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "pipeline",
    select: "-__v -stages",
  });
  next();
});

const stageModel = mongoose.model("Stages", stageSchema);
module.exports = stageModel;
