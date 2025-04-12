const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        default: "other"
    },
    variations: [
        {
            name: {
                type: String,
            },
            values: {
                type: [String]
            }
        }
    ],
    price: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    featureImage: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);
module.exports = {Product};