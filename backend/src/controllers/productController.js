const { Product } = require("../models/Product");

// ADD PRODUCT
const addProductController = async (req, res) => {
  try {
    const productData = req.body;
    console.log(req);
    
    const user = req.user;
    if (user.role !== "vendor") {
      return res.status(403).json({ msg: "Only vendors can add products" });
    }

    const product = await Product.create({
      ...productData,
      vendor: user._id,
    });
    if (product) res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// READ PRODUCTS
const readProductsController = async (req, res) => {
  const page = parseInt(req?.query?.page) || 1;
  const limit = parseInt(req?.query?.limit) || 8;
  const skip = (page - 1) * limit;

  try {
    let products;
    const user = req.user;
    if (req.user && req.user.role === "vendor") {      
      const total = await Product.countDocuments({ vendor: user._id });
      products = await Product.find({ vendor: user._id }).skip(skip).limit(limit).populate(
        "vendor",
        "name email storeName"
      );
      if (products) {
        return res.status(200).json({
          products,
          total,
          page,
          totalPages: Math.ceil(total/limit)
        });
      }
    }
    const total = await Product.countDocuments();
    products = await Product.find().skip(skip).limit(limit).populate("vendor", "name email storeName");

    return res.status(200).json({
      products,
      total,
      page,
      totalPages: Math.ceil(total/limit)
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// READ SINGLE PRODUCT
const readSingleProductController = async (req, res) => {
  try {
    let user = req.user;
    let id = req.params.id;
    let product = await Product.findById(id);
    if (!product) res.status(404).json({ msg: "Product not found" });
    if (
      user &&
      user.role === "vendor" &&
      user._id.toString() === product.vendor.toString()
    ) {
      return res.status(200).json(product);
    } else if (!user || user.role !== "vendor") {
      return res.status(200).json(product);
    } else {
      return res
        .status(403)
        .json({ msg: "Not authorized to view this product" });
    }
  } catch (error) {}
};

// UPDATE PRODUCTS
const updateProductsController = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const body = req.body;
    if (user.role !== "vendor") {
      return res.status(403).json({ msg: "Only Vendors can update products" });
    }

    const product = await Product.findById(id);
    if (!product) res.status(404).json({ msg: "Product not Found" });

    if (product.vendor.toString() !== user._id.toString()) {
      return res.status(403).json({ msg: "Action forbidden" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
    });

    res.status(202).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// DELETE PRODUCTS
const deleteProductsController = async (req, res) => {
  try {
    let id = req.params.id;
    let user = req.user;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    if (
      user._id.toString() === product.vendor.toString() ||
      user.role === "admin"
    ) {
      const deleted = await Product.findByIdAndDelete(id);
      res.status(202).json(deleted);
    } else {
      res.status(403).json({ msg: "Action forbidden" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  addProductController,
  readProductsController,
  updateProductsController,
  deleteProductsController,
  readSingleProductController
};
