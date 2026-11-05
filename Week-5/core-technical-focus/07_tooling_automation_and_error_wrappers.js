// =====================================================================
// Topic: Tooling & Automation (Claude Code CLI / AI Tools)
// - Auto-Generating OpenAPI / Swagger Documentation
// - Standard Error-Handling Wrappers (asyncHandler & ApiError)
// =====================================================================

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const app = express();

app.use(express.json());

// =====================================================================
// PART 1: Standard Error-Handling Wrappers
// Problem: In Express, writing try { ... } catch (err) { next(err); } in
// every controller leads to repetitive boilerplate code.
// Solution: asyncHandler wraps any async function and forwards errors
// to Express next(err) automatically using Promise.catch(next).
// =====================================================================

/**
 * Standard Async Handler Wrapper
 * @param {Function} fn - Async controller function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Standard Custom API Error Factory
 * Attaches HTTP status code to native Error object
 */
const createApiError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Standard API Response Wrapper
 * Ensures uniform JSON responses across all endpoints
 */
const sendApiResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data
  });
};

// =====================================================================
// PART 2: In-Memory Mock Data
// =====================================================================
let inventoryItems = [
  { id: 1, name: 'Ergonomic Desk Chair', price: 8500, stock: 12 },
  { id: 2, name: 'Standing Desk Converter', price: 14000, stock: 7 },
  { id: 3, name: 'Monitor Light Bar', price: 2800, stock: 25 }
];

// Helper: Simulate async database call with delay
const findItemInDb = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(inventoryItems.find((item) => item.id === id));
    }, 100);
  });
};

// =====================================================================
// PART 3: Route Handlers using Standard asyncHandler (NO try-catch needed!)
// =====================================================================

// GET /api/v1/items - Get all items
app.get(
  '/api/v1/items',
  asyncHandler(async (req, res) => {
    // Notice: Clean code without try-catch blocks!
    return sendApiResponse(res, 200, 'Items retrieved successfully', inventoryItems);
  })
);

// GET /api/v1/items/:id - Get single item by ID
app.get(
  '/api/v1/items/:id',
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw createApiError('Invalid Item ID parameter', 400);
    }

    const item = await findItemInDb(id);
    if (!item) {
      throw createApiError(`Item with ID ${id} not found`, 404);
    }

    return sendApiResponse(res, 200, 'Item found', item);
  })
);

// POST /api/v1/items - Create new item with validation
app.post(
  '/api/v1/items',
  asyncHandler(async (req, res) => {
    const { name, price, stock } = req.body;

    if (!name || price === undefined) {
      throw createApiError('Name and price are required fields', 400);
    }

    const newItem = {
      id: inventoryItems.length + 1,
      name: name.trim(),
      price: Number(price),
      stock: Number(stock) || 0
    };

    inventoryItems.push(newItem);
    return sendApiResponse(res, 201, 'Item created successfully', newItem);
  })
);

// =====================================================================
// PART 4: Auto-Generated OpenAPI / Swagger Documentation
// (Generated using AI CLI tooling workflow - Claude Code)
// =====================================================================

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Inventory & Automation API (Week 5)',
    version: '1.0.0',
    description:
      'API documented using OpenAPI 3.0 specification auto-generated with AI CLI tools (Claude Code) and standard error-handling wrappers (asyncHandler).'
  },
  servers: [{ url: 'http://localhost:5001' }],
  paths: {
    '/api/v1/items': {
      get: {
        summary: 'Get all inventory items',
        responses: {
          200: { description: 'List of items returned successfully' }
        }
      },
      post: {
        summary: 'Create a new inventory item',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'price'],
                properties: {
                  name: { type: 'string', example: 'Noise Cancelling Headphones' },
                  price: { type: 'number', example: 4500 },
                  stock: { type: 'integer', example: 15 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Item created' },
          400: { description: 'Missing required fields' }
        }
      }
    },
    '/api/v1/items/{id}': {
      get: {
        summary: 'Get item by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Item found' },
          404: { description: 'Item not found' }
        }
      }
    }
  }
};

// Mount Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// =====================================================================
// PART 5: Global Centralized Error Handling Middleware (4 arguments)
// Any error caught by asyncHandler automatically lands here!
// =====================================================================
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    timestamp: new Date().toISOString()
  });
});

// Run standalone if executed directly
if (require.main === module) {
  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Interactive Swagger Docs at http://localhost:${PORT}/api-docs`);
    console.log(`Test GET items: http://localhost:${PORT}/api/v1/items`);
  });
}

module.exports = {
  app,
  asyncHandler,
  createApiError,
  sendApiResponse
};
