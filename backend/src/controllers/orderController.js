const { Order } = require("../models/Order");
const { Product } = require("../models/Product");
// ADD ORDER
const placeOrderController = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ msg: "Only customers can place orders" });
    }

    const { products, locationDetails, orderType } = req.body;

    if (products.length < 1) {
      return res.status(400).json({ msg: "No products Provided" });
    }

    let detailedProducts = [];
    for (let details of products) {
      details.product = await Product.findById(details.product);
      detailedProducts.push(details);
    }
    let uniqueVendorProducts = detailedProducts.reduce((acc, curr) => {
      if (!acc.includes(curr.product.vendor.toString())) {
        acc.push(curr.product.vendor.toString());
      }
      return acc;
    }, []);
    let orders = [];

    for (let id of uniqueVendorProducts) {
      let order = {
        customer: req.user._id,
        products: [],
        totalAmount: 0,
        locationDetails,
        orderType,
      };
      for (let product of detailedProducts) {
        if (product.product.vendor.toString() === id) {
          order.totalAmount += product.product.price * product.quantity || 1;
          order.vendor = id;
          order.products.push(product);
        }
      }
      let placedOrder = await Order.create(order);
      if (placedOrder) orders.push(placedOrder);
    }
    res.status(201).json(orders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// READ ORDERS
const readOrderController = async (req, res) => {
  try {
    const user = req.user;
    let orders;
    if (user.role === "admin") {
      orders = await Order.find().populate("products.product");
    }
    if (user.role === "vendor") {
      orders = await Order.find({ vendor: user._id }).populate(
        "products.product"
      );
    }
    if (user.role === "customer") {
      orders = await Order.find({ customer: user._id }).populate(
        "products.product"
      );
    }

    if (!orders) {
      return res.status(404).json({ msg: "No orders available" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const readSingleOrderController = async (req, res) => {
  try {
    let user = req.user;
    let id = req.params.id;
    let order = await Order.findById(id);
    if (!order) res.status(404).json({ msg: "Order not found." });

    if (
      user.role === "vendor" &&
      order.vendor.toString() === user._id.toString()
    ) {
      return res.status(200).json(order);
    } else if (
      user.role === "customer" &&
      order.customer.toString() === user._id.toString()
    ) {
      return res.status(200).json(order);
    } else if (user.role === "admin") {
      return res.status(200).json(order);
    } else {
      return res.status(403).json({ msg: "Action forbidden" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// UPDATE ORDER
const updateOrderController = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const order = await Order.findById(id);
    if (
      user.role === "admin" ||
      user._id.toString() === order.vendor.toString()
    ) {
      const statusUpdate = req.body.status;
      order.status = statusUpdate;
      const updatedOrder = await order.save();
      return res.status(202).json(updatedOrder);
    } else {
      return res
        .status(403)
        .json({ msg: "You are not allowed to update this order" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// DELETE ORDER
const deleteOrderController = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    if (user.role === "admin") {
      const order = await Order.findById(id);
      if (!order) res.status(404).json({ msg: "Order not Found" });
      await order.deleteOne();
      res.status(200).json({ msg: "Order Deleted Successfully" });
    } else {
      res.status(403).json({ msg: "Only admin can delete Orders." });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
module.exports = {
  placeOrderController,
  readOrderController,
  updateOrderController,
  deleteOrderController,
  readSingleOrderController
};
