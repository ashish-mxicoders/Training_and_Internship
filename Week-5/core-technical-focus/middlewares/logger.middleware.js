// Request ID and performance logging middleware
const requestLogger = (req, res, next) => {
  const reqId = `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  req.requestId = reqId;
  res.setHeader('X-Request-Id', reqId);

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.requestId}] ${req.method} ${req.originalUrl || req.url} - Status: ${res.statusCode} (${duration}ms)`);
  });

  next();
};

module.exports = { requestLogger };

