const jwt = require("jsonwebtoken");
const Owner = require("../model/ownerModel");
const AppError = require("../utils/appError");
const handleAsyncError = require("../utils/handleAsyncError");

const authorization = handleAsyncError(async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : "";
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const owner = await Owner.findOne({
    _id: decoded._id,
    "tokens.token": token,
  });
  if (!owner) {
    return next(new AppError("Unauthorized", 401));
  }
  req.token = token;
  req.owner = owner;
  next();
});
module.exports = authorization;
