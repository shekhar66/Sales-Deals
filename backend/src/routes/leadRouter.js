const express = require("express");
const router = express.Router();
const leadController = require("../controller/leadController");

router.route("/").get(leadController.getAllLeads).post(leadController.addLead);
router
  .route("/:email")
  .get(leadController.getLead)
  .put(leadController.updateLead)
  .delete(leadController.deleteLead);

module.exports = router;
