const mongoose = require("mongoose");

const g3CartSchema = new mongoose.Schema(
  {
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "G3Product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("G3Cart", g3CartSchema);
