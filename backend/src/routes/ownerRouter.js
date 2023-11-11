const express = require("express");
const router = express.Router();
const ownerController = require("../controller/ownerController");
const authorization = require("../middleware/authorization");

router.route("/").get(authorization, ownerController.getAllOwners);
router.route("/health").get(ownerController.healthCheck);
router.route("/signup").post(ownerController.signUpOwner);
router.route("/login").post(ownerController.loginOwner);
router
  .route("/:email")
  .get(authorization, ownerController.getOwner)
  .delete(authorization, ownerController.deleteOwner)
  .put(authorization, ownerController.updateOwner);

router
  .route("/me")
  .get(authorization, ownerController.getOwner)
  .delete(authorization, ownerController.deleteOwner)
  .put(authorization, ownerController.updateOwner);

module.exports = router;
