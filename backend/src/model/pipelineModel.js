const mongoose = require("mongoose");
const Stage = require("./stageModel");

const pipelineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

pipelineSchema.methods.toJSON = function () {
  const pipeline = this;
  const pipelineObject = pipeline.toObject();
  delete pipelineObject.__v;

  return pipelineObject;
};

// Delete stages when pipeline is removed
pipelineSchema.pre("remove", async function (next) {
  await Stage.deleteMany({ pipeline: this._id });
  next();
});

const pipelineModel = mongoose.model("Pipelines", pipelineSchema);
module.exports = pipelineModel;
