const express = require("express");
const { checkJwt } = require("../../middleware/auth0");
const { checkAdmin } = require("../../middleware/checkRole");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImages,
  getAdminStats,
} = require("../../controllers/common/feature-controller");

const router = express.Router();

// Public routes (no authentication required)
router.get("/get", getFeatureImages);

// Admin routes (require Auth0 JWT authentication and admin role)
router.post("/add", checkJwt, checkAdmin, addFeatureImage);
router.delete("/delete/:id", checkJwt, checkAdmin, deleteFeatureImages);
router.get("/stats", checkJwt, checkAdmin, getAdminStats);

module.exports = router;