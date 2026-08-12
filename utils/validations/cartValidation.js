const { check, param } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

exports.addToCartValidation = [
  check("product")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid Product ID format"),

  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  check("size")
    .notEmpty()
    .withMessage("Size is required")
    .isString()
    .withMessage("Size must be a string"),

  check("color")
    .notEmpty()
    .withMessage("Color is required")
    .isString()
    .withMessage("Color must be a string"),

  validationMiddleware,
];

exports.deleteProductFromCartValidation = [
  param("productId").isMongoId().withMessage("Invalid Product ID format"),

  validationMiddleware,
];
