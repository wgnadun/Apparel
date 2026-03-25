const express = require("express");
// const { checkJwt } = require("../../middleware/auth0");

const {
  addToCart,
  fetchCartItems,
  DeleteCartItem,
  UpdateCartItemQty,
  syncCart,
} = require("../../controllers/shop/cart-controller");

const router = express.Router();

// Temporarily removing Auth0 middleware for testing
router.post("/add", addToCart);
router.post("/sync", syncCart);
router.get("/get/:userId", fetchCartItems);
router.put("/update-cart", UpdateCartItemQty);
router.delete("/:userId/:productId", DeleteCartItem);

module.exports = router;