const { check, param } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

exports.createReviewValidation = [
  check("userName").notEmpty().withMessage("Review userName is required"),

  check("description").notEmpty().withMessage("Review description is required"),

  check("rating")
    .notEmpty()
    .withMessage("Review rating is required")
    .isNumeric()
    .withMessage("Review rating must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  validationMiddleware,
];

exports.getReviewValidation = [
  param("id").isMongoId().withMessage("Invalid Review ID format"),
  validationMiddleware,
];

exports.updateReviewValidation = [
  param("id").isMongoId().withMessage("Invalid Review ID format"),
  check("userName").optional(),
  check("description").optional(),
  check("rating")
    .optional()
    .isNumeric()
    .withMessage("Review rating must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  validationMiddleware,
];

exports.deleteReviewValidation = [
  param("id").isMongoId().withMessage("Invalid Review ID format"),
  validationMiddleware,
];
