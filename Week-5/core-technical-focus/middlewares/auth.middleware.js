// Authentication verification middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Missing Authorization header'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Format must be Bearer <token>'
    });
  }

  const token = parts[1];
  // Simple token verification (pass 'secret123' in postman header: Authorization: Bearer secret123)
  if (token !== 'secret123') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Invalid token'
    });
  }

  req.user = { id: 1, name: 'Ashish', role: 'admin' };
  next();
};

module.exports = { authenticate };

