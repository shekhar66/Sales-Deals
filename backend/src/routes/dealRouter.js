const express = require("express");
const router = express.Router();
const dealController = require("../controller/dealController");

router.route("/").get(dealController.getAllDeals).post(dealController.addDeal);
router
  .route("/:id")
  .get(dealController.getDeal)
  .patch(dealController.updateDeal)
  .delete(dealController.deleteDeal);

module.exports = router;
