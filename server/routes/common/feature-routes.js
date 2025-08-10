const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImages,
  getAdminStats,
} = require("../../controllers/common/feature-controller");

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);
router.delete("/delete/:id", deleteFeatureImages);
router.get("/stats", getAdminStats);

module.exports = router;