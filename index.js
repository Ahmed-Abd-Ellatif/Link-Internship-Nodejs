require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const swaggerSpecs = require("./utils/swagger");

const reviewRouter = require("./routes/reviewRoute");
const productRouter = require("./routes/productRoute");

const app = express();
const port = process.env.PORT || 3000;

// 1. CORS CONFIGURATION
const corsOptions = {
  origin: [
    "http://localhost:4200",
    "http://localhost:3000/docs/",
    "https://link-internship-nodejs.vercel.app/docs/",
  ],
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
app.get("/docs/swagger.json", (req, res) => res.json(swaggerSpecs));
app.get("/docs", (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Intern Node API - Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.32.12/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.32.12/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.32.12/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = function () {
        window.ui = SwaggerUIBundle({
          url: "/docs/swagger.json",
          dom_id: "#swagger-ui",
          deepLinking: true,
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          plugins: [SwaggerUIBundle.plugins.DownloadUrl],
          layout: "StandaloneLayout",
        });
      };
    </script>
  </body>
  </html>`;
  res.send(html);
});
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
