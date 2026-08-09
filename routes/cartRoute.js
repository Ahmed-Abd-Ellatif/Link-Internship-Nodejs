const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  deleteProductFromCart,
} = require("../controllers/cartController");

const {
  addToCartValidation,
  deleteProductFromCartValidation,
} = require("../utils/validations/cartValidation");

// Routes
router.route("/").post(addToCartValidation, addToCart).get(getCart);

router
  .route("/:productId")
  .delete(deleteProductFromCartValidation, deleteProductFromCart);

module.exports = router;
