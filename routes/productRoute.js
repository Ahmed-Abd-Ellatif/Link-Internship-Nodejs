const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  createProductValidation,
  getProductValidation,
  updateProductValidation,
  deleteProductValidation,
} = require("../utils/validations/productValidation");

// Routes
router.route("/").get(getAllProducts).post(createProductValidation, createProduct);

router
  .route("/:id")
  .get(getProductValidation, getProduct)
  .put(updateProductValidation, updateProduct)
  .delete(deleteProductValidation, deleteProduct);

module.exports = router;
