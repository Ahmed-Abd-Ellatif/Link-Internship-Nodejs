const express = require("express");
const router = express.Router();

const {
  addToG3Cart,
  getG3Cart,
  deleteProductFromG3Cart,
} = require("../controllers/g3CartController");

const {
  addToG3CartValidation,
  deleteProductFromG3CartValidation,
} = require("../utils/validations/g3CartValidation");

// Routes
router.route("/").post(addToG3CartValidation, addToG3Cart).get(getG3Cart);

router
  .route("/:productId")
  .delete(deleteProductFromG3CartValidation, deleteProductFromG3Cart);

module.exports = router;
