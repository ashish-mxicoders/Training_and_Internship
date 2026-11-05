// =====================================================================
// Swagger UI Configuration
// Purpose: Mounts the OpenAPI 3.0 specification into an interactive web UI
// =====================================================================

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/openapi.json');

// Custom options for clean dark-themed Swagger UI header
const swaggerOptions = {
  customSiteTitle: 'Week 5 - Backend API Documentation',
  customCss: '.swagger-ui .topbar { background-color: #0f172a; }'
};

module.exports = {
  swaggerUi,
  swaggerDocs: swaggerDocument,
  swaggerOptions
};
