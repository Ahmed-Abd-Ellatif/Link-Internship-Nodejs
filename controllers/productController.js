const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Product = require("../models/productSchema");

const getPagination = (totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    currentPage: page,
    pageSize: limit,
    totalItems,
    totalPages,
  };
};

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get list of products (paginated & filterable)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: number }
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema: { type: number }
 *         description: Items per page (default 10)
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *         description: Sort fields separated by comma (e.g. `-price,title`)
 *       - in: query
 *         name: title
 *         schema: { type: string }
 *         description: Filter by title (partial match)
 *       - in: query
 *         name: price
 *         schema: { type: number }
 *         description: Filter by exact price
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *         description: Filter by minimum price
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *         description: Filter by maximum price
 *       - in: query
 *         name: color
 *         schema: { type: string }
 *         description: Filter by color (e.g. red)
 *       - in: query
 *         name: size
 *         schema: { type: string }
 *         description: Filter by size (e.g. x-large)
 *       - in: query
 *         name: topSelling
 *         schema: { type: boolean }
 *         description: Filter by top selling (true/false)
 *       - in: query
 *         name: newArrival
 *         schema: { type: boolean }
 *         description: Filter by new arrival (true/false)
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 results: { type: number }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Product' }
 */
// @desc    Get list of products (with pagination & filtering)
// @route   GET /api/products
// @access  Public
exports.getAllProducts = asyncHandler(async (req, res) => {
  // 1) Build filter object
  const filter = {};

  if (req.query.title) {
    filter.title = { $regex: req.query.title, $options: "i" };
  }

  if (req.query.color) {
    filter.color = req.query.color;
  }

  if (req.query.size) {
    filter.size = req.query.size;
  }

  if (req.query.topSelling !== undefined) {
    filter.topSelling = req.query.topSelling === "true";
  }

  if (req.query.newArrival !== undefined) {
    filter.newArrival = req.query.newArrival === "true";
  }

  if (req.query.price !== undefined) {
    filter.price = +req.query.price;
  } else {
    const priceRange = {};
    if (req.query.minPrice !== undefined) priceRange.$gte = +req.query.minPrice;
    if (req.query.maxPrice !== undefined) priceRange.$lte = +req.query.maxPrice;
    if (Object.keys(priceRange).length > 0) filter.price = priceRange;
  }

  // 2) Pagination
  const page = Math.abs(+req.query.page) || 1;
  const limit = Math.abs(+req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // 3) Sorting
  const sortBy = req.query.sort
    ? req.query.sort.split(",").join(" ")
    : "-createdAt";

  // 4) Query
  const totalItems = await Product.countDocuments(filter);
  const products = await Product.find(filter).sort(sortBy).skip(skip).limit(limit);

  res.status(200).json({
    status: "success",
    results: products.length,
    pagination: getPagination(totalItems, page, limit),
    data: products,
  });
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get specific product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Product id
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
// @desc    Get specific product by id
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [image, title, rate, price, description]
 *             properties:
 *               image: { type: array, items: { type: string }, minItems: 1, maxItems: 4 }
 *               title: { type: string }
 *               description: { type: string }
 *               rate: { type: number, minimum: 0, maximum: 5 }
 *               price: { type: number, minimum: 0 }
 *               discount: { type: number, minimum: 0, maximum: 100 }
 *               size: { type: string }
 *               color: { type: string }
 *               topSelling: { type: boolean }
 *               newArrival: { type: boolean }
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       400:
 *         description: Validation error
 */
// @desc    Create product
// @route   POST /api/products
// @access  Public
exports.createProduct = asyncHandler(async (req, res) => {
  const createdProduct = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: createdProduct,
  });
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image: { type: array, items: { type: string }, minItems: 1, maxItems: 4 }
 *               title: { type: string }
 *               description: { type: string }
 *               rate: { type: number, minimum: 0, maximum: 5 }
 *               price: { type: number, minimum: 0 }
 *               discount: { type: number, minimum: 0, maximum: 100 }
 *               size: { type: string }
 *               color: { type: string }
 *               topSelling: { type: boolean }
 *               newArrival: { type: boolean }
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
// @desc    Update specific product
// @route   PUT /api/products/:id
// @access  Public
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    return next(new ApiError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
// @desc    Delete specific product
// @route   DELETE /api/products/:id
// @access  Public
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    return next(new ApiError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: deletedProduct,
  });
});
