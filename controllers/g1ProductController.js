const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const G1Product = require("../models/g1ProductSchema");

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
 * /g1/products:
 *   get:
 *     summary: Get list of g1 products (paginated & filterable)
 *     tags: [G1Products]
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
 *         description: List of g1 products
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
 *                   items: { $ref: '#/components/schemas/G1Product' }
 */
// @desc    Get list of g1 products (with pagination & filtering)
// @route   GET /api/g1/products
// @access  Public
exports.getAllG1Products = asyncHandler(async (req, res) => {
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
  const totalItems = await G1Product.countDocuments(filter);
  const products = await G1Product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    results: products.length,
    pagination: getPagination(totalItems, page, limit),
    data: products,
  });
});

/**
 * @swagger
 * /g1/products/{id}:
 *   get:
 *     summary: Get specific g1 product by id
 *     tags: [G1Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Product id
 *     responses:
 *       200:
 *         description: G1 product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/G1Product' }
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
// @desc    Get specific g1 product by id
// @route   GET /api/g1/products/:id
// @access  Public
exports.getG1Product = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await G1Product.findById(id);

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
 * /g1/products:
 *   post:
 *     summary: Create a new g1 product
 *     tags: [G1Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [image, title, rate, price]
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
 *         description: G1 product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/G1Product' }
 *       400:
 *         description: Validation error
 */
// @desc    Create g1 product
// @route   POST /api/g1/products
// @access  Public
exports.createG1Product = asyncHandler(async (req, res) => {
  const createdProduct = await G1Product.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: createdProduct,
  });
});

/**
 * @swagger
 * /g1/products/{id}:
 *   put:
 *     summary: Update a g1 product
 *     tags: [G1Products]
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
 *         description: G1 product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/G1Product' }
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
// @desc    Update specific g1 product
// @route   PUT /api/g1/products/:id
// @access  Public
exports.updateG1Product = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedProduct = await G1Product.findByIdAndUpdate(id, req.body, {
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
 * /g1/products/{id}:
 *   delete:
 *     summary: Delete a g1 product
 *     tags: [G1Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: G1 product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/G1Product' }
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
// @desc    Delete specific g1 product
// @route   DELETE /api/g1/products/:id
// @access  Public
exports.deleteG1Product = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedProduct = await G1Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    return next(new ApiError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: deletedProduct,
  });
});
