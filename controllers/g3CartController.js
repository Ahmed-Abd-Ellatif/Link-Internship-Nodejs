const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const G3Cart = require("../models/g3CartSchema");
const G3Product = require("../models/g3ProductSchema");

const calculateItemTotal = (product, quantity) => {
  const price = product.price;
  const discount = product.discount || 0;
  const unitPrice = price - (price * discount) / 100;
  return +((unitPrice || 0) * quantity).toFixed(2);
};

/**
 * @swagger
 * /g3/cart:
 *   post:
 *     summary: Add a g3 product to cart
 *     tags: [G3Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product, quantity]
 *             properties:
 *               product: { type: string, description: G3 product id }
 *               quantity: { type: number, minimum: 1 }
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/G3Cart' }
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
// @desc    Add g3 product to cart
// @route   POST /api/g3/cart
// @access  Public
exports.addToG3Cart = asyncHandler(async (req, res, next) => {
  const { product, quantity } = req.body;

  const productExists = await G3Product.findById(product);
  if (!productExists) {
    return next(new ApiError("Product not found", 404));
  }

  let cart = await G3Cart.findOne();

  if (!cart) {
    cart = await G3Cart.create({ items: [{ product, quantity }] });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === product,
    );

    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      cart.items.push({ product, quantity });
    }

    await cart.save();
  }

  res.status(201).json({
    status: "success",
    message: "Product added to cart successfully",
    data: cart,
  });
});

/**
 * @swagger
 * /g3/cart:
 *   get:
 *     summary: Get cart with products, quantities and total price
 *     tags: [G3Cart]
 *     responses:
 *       200:
 *         description: Cart data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 results: { type: number }
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product: { $ref: '#/components/schemas/G3Product' }
 *                           quantity: { type: number }
 *                           totalPrice: { type: number }
 *                     totalPrice: { type: number }
 */
// @desc    Get cart with products, quantities and total price
// @route   GET /api/g3/cart
// @access  Public
exports.getG3Cart = asyncHandler(async (req, res) => {
  const cart = await G3Cart.findOne().populate("items.product");

  if (!cart || cart.items.length === 0) {
    return res.status(200).json({
      status: "success",
      results: 0,
      data: { items: [], totalPrice: 0 },
    });
  }

  const items = cart.items.map((item) => ({
    product: item.product,
    quantity: item.quantity,
    totalPrice: calculateItemTotal(item.product, item.quantity),
  }));

  const totalPrice = +items
    .reduce((sum, item) => sum + item.totalPrice, 0)
    .toFixed(2);

  res.status(200).json({
    status: "success",
    results: items.length,
    data: { items, totalPrice },
  });
});

/**
 * @swagger
 * /g3/cart/{productId}:
 *   delete:
 *     summary: Delete a g3 product from cart
 *     tags: [G3Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *         description: G3 product id
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/G3Cart' }
 *       404:
 *         description: Cart not found or product not in cart
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
// @desc    Delete a g3 product from cart
// @route   DELETE /api/g3/cart/:productId
// @access  Public
exports.deleteProductFromG3Cart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await G3Cart.findOne();

  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex === -1) {
    return next(new ApiError("Product not found in cart", 404));
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product removed from cart successfully",
    data: cart,
  });
});
