const express = require("express");
const router = express.Router();
const pipelineController = require("../controller/pipelineController");

router
  .route("/")
  .get(pipelineController.getAllPipelines)
  .post(pipelineController.addPipeline);
router
  .route("/:id")
  .get(pipelineController.getPipeline)
  .patch(pipelineController.updatePipeline)
  .delete(pipelineController.deletePipeline);

module.exports = router;
