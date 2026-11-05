const express = require('express');
const app = express();

app.use(express.json());

// Application-level middleware: Generates unique request ID
const requestIdMiddleware = (req, res, next) => {
  const reqId = `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  req.requestId = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
};

// Logging middleware: tracks method, url, status and execution time
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.requestId}] ${req.method} ${req.originalUrl || req.url} - ${res.statusCode} (${duration}ms)`);
  });
  next();
};

// Route protection middleware: checks Bearer token
const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token format. Expected: Bearer <token>'
    });
  }

  const token = parts[1];
  if (token !== 'secret123') {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  req.user = { id: 101, username: 'ashish', role: 'admin' };
  next();
};

// Sanitization middleware: trims whitespace from request body
const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
};

// Register global middlewares
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(sanitizeBody);

// Public route
app.get('/api/public/status', (req, res) => {
  res.status(200).json({
    success: true,
    requestId: req.requestId,
    status: 'Server active'
  });
});

// Protected route
app.get('/api/private/profile', requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    requestId: req.requestId,
    user: req.user
  });
});

module.exports = {
  requestIdMiddleware,
  requestLogger,
  requireAuth,
  sanitizeBody
};

// Run standalone if executed directly via node 03_middleware_basics.js
if (require.main === module) {
  const PORT = 5003;
  app.listen(PORT, () => {
    console.log(`[03 Middleware Basics] Running on http://localhost:${PORT}`);
    console.log(`- GET  http://localhost:${PORT}/api/public/status (Public with Request ID)`);
    console.log(`- GET  http://localhost:${PORT}/api/private/profile (Requires Authorization: Bearer secret123)`);
  });
}
