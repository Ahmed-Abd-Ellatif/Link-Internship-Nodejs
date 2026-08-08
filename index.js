require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./utils/swagger");

const reviewRouter = require("./routes/reviewRoute");
const productRouter = require("./routes/productRoute");

const app = express();
const port = process.env.PORT || 3000;

// 1. CORS CONFIGURATION
const corsOptions = {
  origin: ["http://localhost:4200"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 2. BODY PARSER MIDDLEWARES
app.use(
  express.json({
    type: (req) =>
      !req.headers["content-type"] ||
      !/^application\/x-www-form-urlencoded|^multipart\/form-data/i.test(
        req.headers["content-type"],
      ),
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. ROUTES
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/api/Reviews", reviewRouter);
app.use("/api/products", productRouter);

app.all("/{*path}", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// 5. GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalError);

// 6. CONNECTING TO DATABASE
const url = process.env.DB_URL;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// 7. START SERVER (skipped on Vercel serverless)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
