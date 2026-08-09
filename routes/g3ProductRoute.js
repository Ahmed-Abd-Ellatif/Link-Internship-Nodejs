const express = require("express");
const router = express.Router();

const {
  getAllG3Products,
  getG3Product,
  createG3Product,
  updateG3Product,
  deleteG3Product,
} = require("../controllers/g3ProductController");

const {
  createG3ProductValidation,
  getG3ProductValidation,
  updateG3ProductValidation,
  deleteG3ProductValidation,
} = require("../utils/validations/g3ProductValidation");

// Routes
router
  .route("/")
  .get(getAllG3Products)
  .post(createG3ProductValidation, createG3Product);

router
  .route("/:id")
  .get(getG3ProductValidation, getG3Product)
  .put(updateG3ProductValidation, updateG3Product)
  .delete(deleteG3ProductValidation, deleteG3Product);

module.exports = router;
