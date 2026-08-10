const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    image: {
      type: [String],
      required: [true, "Product image is required"],
      validate: {
        validator: (arr) => arr.length >= 1 && arr.length <= 4,
        message: "Product must have between 1 and 4 images",
      },
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    rate: {
      type: Number,
      required: [true, "Product rate is required"],
      min: [0, "Rate must be at least 0"],
      max: [5, "Rate cannot be more than 5"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be at least 0"],
    },
    discount: {
      type: Number,
      min: [0, "Discount must be at least 0"],
      max: [100, "Discount cannot be more than 100"],
    },
    size: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    topSelling: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
