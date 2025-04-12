const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: {
        type: [
            {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
            },
            variation: {
                type: [String]
            }
        }
    ]
    },
    totalAmount: {
        type: Number,
        required: true
    },
    locationDetails: {
        type: String,
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Canceled"],
        default: "Pending"
    },
    orderType: {
        type: String,
        enum: ["COD", "ONLINE"],
        default: "COD",
        required: true
    }
});

const Order = mongoose.model("Order", orderSchema)
module.exports = {Order}