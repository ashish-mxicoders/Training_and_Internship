const express = require('express');
const router = express.Router();

// Middleware: Verify user token
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Token missing'
    });
  }
  req.user = { id: 101, role: 'admin', name: 'Ashish' };
  next();
};

// Middleware: Check admin role
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Forbidden: Admin access required'
  });
};

// Static route
router.get('/users', (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { id: 1, name: 'Rahul Sharma', role: 'developer' },
      { id: 2, name: 'Priya Verma', role: 'designer' }
    ]
  });
});

// Dynamic route parameter (:id)
router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: { id, name: 'Ashish' }
  });
});

// Nested route parameters
router.get('/users/:userId/orders/:orderId', (req, res) => {
  const { userId, orderId } = req.params;
  res.status(200).json({
    success: true,
    data: { userId, orderId, item: 'Laptop' }
  });
});

// Query parameters (/search?keyword=express&page=1)
router.get('/search', (req, res) => {
  const { keyword = '', page = 1, limit = 10 } = req.query;
  res.status(200).json({
    success: true,
    query: { keyword, page: Number(page), limit: Number(limit) }
  });
});

// Protected route with multiple middlewares
router.post('/admin/dashboard', authenticateUser, requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin Dashboard',
    user: req.user
  });
});

// Route chaining for same endpoint
router.route('/products/:productId')
  .get((req, res) => {
    res.status(200).json({ success: true, message: `Fetched product #${req.params.productId}` });
  })
  .put(authenticateUser, (req, res) => {
    res.status(200).json({ success: true, message: `Updated product #${req.params.productId}` });
  })
  .delete(authenticateUser, requireAdmin, (req, res) => {
    res.status(204).send();
  });

module.exports = router;
