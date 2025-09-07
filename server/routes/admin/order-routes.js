const express = require("express");
const { checkJwt } = require("../../middleware/auth0");
const { checkAdmin } = require("../../middleware/checkRole");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");

const router = express.Router();

// All admin order routes require authentication and admin role
router.get("/get", checkJwt, checkAdmin, getAllOrdersOfAllUsers);
router.get("/details/:id", checkJwt, checkAdmin, getOrderDetailsForAdmin);
router.put("/update/:id", checkJwt, checkAdmin, updateOrderStatus);

module.exports = router;