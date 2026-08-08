const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Review userName is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Review description is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Review rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
