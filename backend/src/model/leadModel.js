const mongoose = require("mongoose");
const validator = require("validator");
const AppError = require("../utils/appError");

const leadSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          return new AppError("Invalid Email...!!!", 400);
        }
      },
    },
    age: {
      type: Number,
      min: 1,
      max: 100,
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owners",
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdby",
    select: "-__v",
  });
  next();
});

const Lead = mongoose.model("Leads", leadSchema);

module.exports = Lead;
