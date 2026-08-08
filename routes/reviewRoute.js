const express = require("express");
const router = express.Router();

// 1. استيراد الـ Controller بـ Destructuring لسهولة القراءة
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

// 2. استيراد الـ Validation Middlewares
const {
  createReviewValidation,
  getReviewValidation,
  updateReviewValidation,
  deleteReviewValidation,
} = require("../utils/validations/reviewValidation");

// Routes
router.route("/").get(getAllReviews).post(createReviewValidation, createReview);

router
  .route("/:id")
  .get(getReviewValidation, getReview)
  .put(updateReviewValidation, updateReview)
  .delete(deleteReviewValidation, deleteReview);

module.exports = router;
