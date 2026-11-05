# Week 5: Core Technical Focus & Tooling Automation

Comprehensive backend training module covering Express.js architecture, custom middlewares, asynchronous error-handling wrappers, and AI CLI tooling automation (OpenAPI / Swagger auto-generation).

---

## 📁 Project Structure

```text
Week-5/core-technical-focus/
├── 01_router_and_path_mapping.js                # Router mapping & route parameters
├── 02_controller_validation_and_response.js      # Controller layer & input validation
├── 03_middleware_basics.js                      # Custom logging, auth & timing middlewares
├── 04_async_promises_try_catch_error_handling.js # Promises, async/await & basic error catching
├── 05_restful_api_and_http_codes.js             # Standard RESTful conventions & HTTP status codes
├── 06_role_based_access_control.js              # RBAC middleware (admin vs user permissions)
├── 07_tooling_automation_and_error_wrappers.js  # Tooling automation & standard asyncHandler wrapper
│
├── config/
│   └── swagger.js                              # Swagger UI configuration
├── controllers/
│   ├── product.controller.js                   # Products CRUD controller
│   └── user.controller.js                      # Users CRUD controller with role checks
├── docs/
│   └── openapi.json                            # OpenAPI 3.0 specification
├── middlewares/
│   ├── asyncWrapper.middleware.js              # Standard asyncHandler error wrapper
│   ├── auth.middleware.js                      # Token verification & role authorization
│   ├── error.middleware.js                     # Centralized 4-argument error handler
│   └── logger.middleware.js                    # HTTP request logger
├── routes/
│   ├── index.js                                # Main API router (/api)
│   ├── product.routes.js                       # Product endpoints
│   └── user.routes.js                          # User endpoints
├── scripts/
│   └── generate_swagger.js                     # AI CLI tool script for generating OpenAPI spec
├── storage/
│   └── storage.service.js                      # JSON file-backed persistence layer
├── utils/
│   └── apiResponse.js                          # Standard API response & error formatters
├── server.js                                   # Main Express application entry point
└── package.json
```

---

## 🛠️ Key Concepts & Implementations

### 1. Standard Error-Handling Wrappers (`asyncHandler`)
In typical Express applications, writing `try { ... } catch (err) { next(err); }` in every controller creates repetitive boilerplate.
We implemented `asyncHandler`:
```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```
- Automatically catches any rejected Promise or thrown error.
- Passes errors directly to Express's global centralized error handler.

### 2. Standardized API Response & Error Formatting
- Uniform Success Structure: `{ success: true, statusCode: 200, message: "...", data: { ... } }`
- Uniform Error Structure: `{ success: false, statusCode: 400, message: "...", timestamp: "..." }`

### 3. Tooling & Automation: Auto-Generated OpenAPI / Swagger
- Uses AI CLI tools (Claude Code workflow) to inspect routes and automatically generate an OpenAPI 3.0 specification (`docs/openapi.json`).
- Served via `swagger-ui-express` at `/api/docs` for interactive API testing.

---

## 🚀 How to Run

### Run the Standalone Automation & Wrapper Demo:
```bash
node 07_tooling_automation_and_error_wrappers.js
```
- App: `http://localhost:5001/api/v1/items`
- Interactive Swagger UI: `http://localhost:5001/api-docs`

### Run the Main Modular Server:
```bash
npm start
```
- App: `http://localhost:5000/api`
- Interactive Swagger UI: `http://localhost:5000/api/docs`
- Health Check: `http://localhost:5000/api/health`

### Auto-Generate OpenAPI Specification via CLI:
```bash
npm run docs:generate
```

