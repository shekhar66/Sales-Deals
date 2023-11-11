const express = require("express");
const router = express.Router();
const stageController = require("../controller/stageController");

router
  .route("/")
  .get(stageController.getAllStages)
  .post(stageController.addStage);
router
  .route("/:id")
  .get(stageController.getStage)
  .patch(stageController.updateStage)
  .delete(stageController.deleteStage);

module.exports = router;
