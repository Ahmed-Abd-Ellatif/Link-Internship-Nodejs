const express = require("express");
const router = express.Router();

const {
  addToG1Cart,
  getG1Cart,
  deleteProductFromG1Cart,
} = require("../controllers/g1CartController");

const {
  addToG1CartValidation,
  deleteProductFromG1CartValidation,
} = require("../utils/validations/g1CartValidation");

// Routes
router.route("/").post(addToG1CartValidation, addToG1Cart).get(getG1Cart);

router
  .route("/:productId")
  .delete(deleteProductFromG1CartValidation, deleteProductFromG1Cart);

module.exports = router;
