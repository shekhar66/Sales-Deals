const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const ownerSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ownerSchema.methods.toJSON = function () {
  const ownerObject = this.toObject();
  delete ownerObject.password;
  delete ownerObject.tokens;
  delete ownerObject.__v;
  return ownerObject;
};

ownerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const passwordHashed = await bcryptjs.hash(this.password, 8);
    this.password = passwordHashed;
  }
  next();
});

ownerSchema.methods.generateAuthToken = async function () {
  const owner = this;
  const token = jwt.sign({ _id: owner._id.toString() }, process.env.JWT_SECRET);

  owner.tokens = owner.tokens.concat({ token });
  await owner.save();

  return token;
};

ownerSchema.statics.findByCredentials = async (email, password, next) => {
  const owner = await Owner.findOne({ email });

  if (!owner) {
    return next(new AppError("Unable to login", 401));
  }

  const isMatch = await bcryptjs.compare(password, owner.password);

  if (!isMatch) {
    return next(new AppError("Unable to login", 401));
  }

  return owner;
};

const Owner = mongoose.model("Owners", ownerSchema);
module.exports = Owner;
