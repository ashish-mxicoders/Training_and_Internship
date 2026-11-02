const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');

router.use('/users', userRoutes);
router.use('/products', productRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend server is active',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

