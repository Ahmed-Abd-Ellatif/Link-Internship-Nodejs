const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Review = require("../models/reviewSchema");

/**
 * @swagger
 * /Reviews:
 *   get:
 *     summary: Get list of reviews
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *         description: Sort fields separated by comma (e.g. `-rating,userName`)
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 results: { type: number }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Review' }
 */
// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getAllReviews = asyncHandler(async (req, res) => {
  const sortBy = req.query.sort
    ? req.query.sort.split(",").join(" ")
    : "-createdAt";

  const reviews = await Review.find().sort(sortBy);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: reviews,
  });
});

/**
 * @swagger
 * /Reviews/{id}:
 *   get:
 *     summary: Get specific review by id
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Review id
 *     responses:
 *       200:
 *         description: Review found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Review' }
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
// @desc    Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id);

  if (!review) {
    return next(new ApiError("Review not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: review,
  });
});

/**
 * @swagger
 * /Reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userName, description, rating]
 *             properties:
 *               userName: { type: string }
 *               description: { type: string }
 *               rating: { type: number, minimum: 1, maximum: 5 }
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Review' }
 *       400:
 *         description: Validation error
 */
// @desc    Create review
// @route   POST /api/v1/reviews
// @access  Private/Protect
exports.createReview = asyncHandler(async (req, res) => {
  const createdReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Review created successfully",
    data: createdReview,
  });
});

/**
 * @swagger
 * /Reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName: { type: string }
 *               description: { type: string }
 *               rating: { type: number, minimum: 1, maximum: 5 }
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Review' }
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
// @desc    Update specific review
// @route   PUT /api/v1/reviews/:id
// @access  Private/Protect
exports.updateReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true, // يضمن تطبيق شروط الـ Schema عند التحديث
  });

  if (!updatedReview) {
    return next(new ApiError("Review not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Review updated successfully",
    data: updatedReview,
  });
});

/**
 * @swagger
 * /Reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Review' }
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
// @desc    Delete specific review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protect
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedReview = await Review.findByIdAndDelete(id);

  if (!deletedReview) {
    return next(new ApiError("Review not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Review deleted successfully",
    data: deletedReview,
  });
});
