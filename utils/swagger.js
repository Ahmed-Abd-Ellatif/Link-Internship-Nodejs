const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Intern Node API",
      version: "1.0.0",
      description:
        "REST API for Reviews and Products built with Express & Mongoose.",
    },
    servers: [
      {
        url: "https://link-internship-nodejs.vercel.app/api",
        description: "Production server (Vercel)",
      },
      {
        url: "http://localhost:3000/api",
        description: "Local server",
      },
    ],
    components: {
      schemas: {
        Review: {
          type: "object",
          required: ["userName", "description", "rating"],
          properties: {
            _id: { type: "string", example: "6a778962fd321bcc5517d540" },
            userName: { type: "string", example: "Ahmed Abd Ellatif" },
            description: { type: "string", example: "Great course!" },
            rating: { type: "number", minimum: 1, maximum: 5, example: 4.5 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          required: ["image", "title", "rate", "price", "description"],
          properties: {
            _id: { type: "string", example: "6a778962fd321bcc5517d540" },
            image: {
              type: "array",
              items: { type: "string" },
              minItems: 1,
              maxItems: 4,
              example: ["https://example.com/image1.png"],
            },
            title: { type: "string", example: "T-Shirt" },
            description: {
              type: "string",
              example: "A comfortable cotton t-shirt",
            },
            rate: { type: "number", minimum: 0, maximum: 5, example: 4.5 },
            price: { type: "number", minimum: 0, example: 200 },
            discount: {
              type: "number",
              minimum: 0,
              maximum: 100,
              example: 20,
            },
            size: {
              type: "array",
              items: { type: "string" },
              example: ["x-large"],
            },
            color: {
              type: "array",
              items: { type: "string" },
              example: ["red"],
            },
            topSelling: { type: "boolean", example: true },
            newArrival: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        G1Product: {
          type: "object",
          required: ["image", "title", "rate", "price"],
          properties: {
            _id: { type: "string", example: "6a778962fd321bcc5517d540" },
            image: {
              type: "array",
              items: { type: "string" },
              minItems: 1,
              maxItems: 4,
              example: ["https://example.com/image1.png"],
            },
            title: { type: "string", example: "T-Shirt" },
            description: {
              type: "string",
              example: "A comfortable cotton t-shirt",
            },
            rate: { type: "number", minimum: 0, maximum: 5, example: 4.5 },
            price: { type: "number", minimum: 0, example: 200 },
            discount: {
              type: "number",
              minimum: 0,
              maximum: 100,
              example: 20,
            },
            size: {
              type: "array",
              items: { type: "string" },
              example: ["x-large"],
            },
            color: {
              type: "array",
              items: { type: "string" },
              example: ["red"],
            },
            topSelling: { type: "boolean", example: true },
            newArrival: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        G1Cart: {
          type: "object",
          required: ["items"],
          properties: {
            _id: { type: "string", example: "6a778962fd321bcc5517d540" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string", example: "6a778962fd321bcc5517d540" },
                  product: { $ref: "#/components/schemas/G1Product" },
                  quantity: { type: "number", minimum: 1, example: 2 },
                  size: { type: "string", example: "x-large" },
                  color: { type: "string", example: "red" },
                },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        G3Product: {
          type: "object",
          required: ["image", "title", "rate", "price"],
          properties: {
            _id: { type: "string", example: "6a778962fd321bcc5517d540" },
            image: {
              type: "array",
              items: { type: "string" },
              minItems: 1,
              maxItems: 4,
              example: ["https://example.com/image1.png"],
            },
            title: { type: "string", example: "T-Shirt" },
            description: {
              type: "string",
              example: "A comfortable cotton t-shirt",
            },
            rate: { type: "number", minimum: 0, maximum: 5, example: 4.5 },
            price: { type: "number", minimum: 0, example: 200 },
            discount: {
              type: "number",
              minimum: 0,
              maximum: 100,
              example: 20,
            },
            size: {
              type: "array",
              items: { type: "string" },
              example: ["x-large"],
            },
            color: {
              type: "array",
              items: { type: "string" },
              example: ["red"],
            },
            topSelling: { type: "boolean", example: true },
            newArrival: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        G3Cart: {
          type: "object",
          required: ["items"],
          properties: {
            _id: { type: "string", example: "6a778962fd321bcc5517d540" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string", example: "6a778962fd321bcc5517d540" },
                  product: { $ref: "#/components/schemas/G3Product" },
                  quantity: { type: "number", minimum: 1, example: 2 },
                  size: { type: "string", example: "x-large" },
                  color: { type: "string", example: "red" },
                },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            status: { type: "string", example: "fail" },
            message: { type: "string", example: "Product not found" },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            currentPage: { type: "number", example: 1 },
            pageSize: { type: "number", example: 10 },
            totalItems: { type: "number", example: 25 },
            totalPages: { type: "number", example: 3 },
          },
        },
        Cart: {
          type: "object",
          required: ["items"],
          properties: {
            _id: { type: "string", example: "6a778962fd321bcc5517d540" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string", example: "6a778962fd321bcc5517d540" },
                  product: { $ref: "#/components/schemas/Product" },
                  quantity: { type: "number", minimum: 1, example: 2 },
                  size: { type: "string", example: "x-large" },
                  color: { type: "string", example: "red" },
                },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./controllers/*.js"],
};

module.exports = swaggerJsdoc(options);
