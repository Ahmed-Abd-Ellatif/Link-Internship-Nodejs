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

  validationMiddleware,
];

exports.deleteProductFromCartValidation = [
  param("productId").isMongoId().withMessage("Invalid Product ID format"),

  validationMiddleware,
];
