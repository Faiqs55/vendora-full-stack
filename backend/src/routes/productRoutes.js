const express = require("express");
const { protect, checkAuth } = require("../middlewares/authMiddleware");
const { addProductController, readProductsController, updateProductsController, deleteProductsController, readSingleProductController } = require("../controllers/productController");
const productRouter = express.Router();

productRouter.route("/")
.post(protect, addProductController)
.get(checkAuth, readProductsController);

productRouter.route("/:id")
.get(checkAuth, readSingleProductController)
.put(protect, updateProductsController)
.delete(protect, deleteProductsController)


module.exports = {
    productRouter
}