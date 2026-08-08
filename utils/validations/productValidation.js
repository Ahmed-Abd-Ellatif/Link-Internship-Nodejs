const { check, param } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

exports.createProductValidation = [
  check("image").notEmpty().withMessage("Product image is required"),

  check("title").notEmpty().withMessage("Product title is required"),

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

  check("size").optional(),

  check("color").optional(),

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

exports.getProductValidation = [
  param("id").isMongoId().withMessage("Invalid Product ID format"),
  validationMiddleware,
];

exports.updateProductValidation = [
  param("id").isMongoId().withMessage("Invalid Product ID format"),

  check("image").optional(),

  check("title").optional(),

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

  check("size").optional(),

  check("color").optional(),

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

exports.deleteProductValidation = [
  param("id").isMongoId().withMessage("Invalid Product ID format"),
  validationMiddleware,
];
