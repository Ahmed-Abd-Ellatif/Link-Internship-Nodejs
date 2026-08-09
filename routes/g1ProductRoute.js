const express = require("express");
const router = express.Router();

const {
  getAllG1Products,
  getG1Product,
  createG1Product,
  updateG1Product,
  deleteG1Product,
} = require("../controllers/g1ProductController");

const {
  createG1ProductValidation,
  getG1ProductValidation,
  updateG1ProductValidation,
  deleteG1ProductValidation,
} = require("../utils/validations/g1ProductValidation");

// Routes
router
  .route("/")
  .get(getAllG1Products)
  .post(createG1ProductValidation, createG1Product);

router
  .route("/:id")
  .get(getG1ProductValidation, getG1Product)
  .put(updateG1ProductValidation, updateG1Product)
  .delete(deleteG1ProductValidation, deleteG1Product);

module.exports = router;
