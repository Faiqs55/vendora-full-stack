const express = require("express");
const orderRouter = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  placeOrderController,
  readOrderController,
  updateOrderController,
  deleteOrderController,
  readSingleOrderController,
} = require("../controllers/orderController");

orderRouter
  .route("/")
  .post(protect, placeOrderController)
  .get(protect, readOrderController);

orderRouter
  .route("/:id")
  .get(protect, readSingleOrderController)
  .put(protect, updateOrderController)
  .delete(protect, deleteOrderController);

module.exports = { orderRouter };
