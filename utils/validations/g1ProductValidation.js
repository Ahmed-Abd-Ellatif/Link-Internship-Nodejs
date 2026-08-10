const { check, param } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

exports.createG1ProductValidation = [
  check("image")
    .notEmpty()
    .withMessage("Product image is required")
    .isArray({ min: 1, max: 4 })
    .withMessage("Product must have between 1 and 4 images")
    .custom(
      (arr) =>
        Array.isArray(arr) &&
        arr.every((img) => typeof img === "string" && img.trim().length > 0),
    )
    .withMessage("Product images must be non-empty strings"),

  check("title").notEmpty().withMessage("Product title is required"),

  check("description").optional(),

  check("rate")
    .notEmpty()
    .withMessage("Product rate is required")
    .isNumeric()
    .withMessage("Product rate must be a number")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rate must be between 0 and 5"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be at least 0"),

  check("discount")
    .optional()
    .isNumeric()
    .withMessage("Product discount must be a number")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100"),

  check("size")
    .optional()
    .isArray()
    .withMessage("Product size must be an array")
    .custom(
      (arr) =>
        Array.isArray(arr) &&
        arr.every((item) => typeof item === "string" && item.trim().length > 0),
    )
    .withMessage("Product sizes must be non-empty strings"),

  check("color")
    .optional()
    .isArray()
    .withMessage("Product color must be an array")
    .custom(
      (arr) =>
        Array.isArray(arr) &&
        arr.every((item) => typeof item === "string" && item.trim().length > 0),
    )
    .withMessage("Product colors must be non-empty strings"),

  check("topSelling")
    .optional()
    .isBoolean()
    .withMessage("topSelling must be a boolean"),

  check("newArrival")
    .optional()
    .isBoolean()
    .withMessage("newArrival must be a boolean"),

  validationMiddleware,
];

exports.getG1ProductValidation = [
  param("id").isMongoId().withMessage("Invalid Product ID format"),
  validationMiddleware,
];

exports.updateG1ProductValidation = [
  param("id").isMongoId().withMessage("Invalid Product ID format"),

  check("image")
    .optional()
    .isArray({ min: 1, max: 4 })
    .withMessage("Product must have between 1 and 4 images")
    .custom(
      (arr) =>
        Array.isArray(arr) &&
        arr.every((img) => typeof img === "string" && img.trim().length > 0),
    )
    .withMessage("Product images must be non-empty strings"),

  check("title").optional(),

  check("description").optional(),

  check("rate")
    .optional()
    .isNumeric()
    .withMessage("Product rate must be a number")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rate must be between 0 and 5"),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be at least 0"),

  check("discount")
    .optional()
    .isNumeric()
    .withMessage("Product discount must be a number")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100"),

  check("size")
    .optional()
    .isArray()
    .withMessage("Product size must be an array")
    .custom(
      (arr) =>
        Array.isArray(arr) &&
        arr.every((item) => typeof item === "string" && item.trim().length > 0),
    )
    .withMessage("Product sizes must be non-empty strings"),

  check("color")
    .optional()
    .isArray()
    .withMessage("Product color must be an array")
    .custom(
      (arr) =>
        Array.isArray(arr) &&
        arr.every((item) => typeof item === "string" && item.trim().length > 0),
    )
    .withMessage("Product colors must be non-empty strings"),

  check("topSelling")
    .optional()
    .isBoolean()
    .withMessage("topSelling must be a boolean"),

  check("newArrival")
    .optional()
    .isBoolean()
    .withMessage("newArrival must be a boolean"),

  validationMiddleware,
];

exports.deleteG1ProductValidation = [
  param("id").isMongoId().withMessage("Invalid Product ID format"),
  validationMiddleware,
];
