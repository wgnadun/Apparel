const express = require("express");

const {
  addProductReview,
  getProductReview,
} = require("../../controllers/shop/productReview-controller");

const router = express.Router();

router.post("/add", addProductReview);
router.get("/:productId", getProductReview);

module.exports = router;