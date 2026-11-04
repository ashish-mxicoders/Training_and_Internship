const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);

// RBAC Protected route: Admin only
router.get('/admin/stats', authenticate, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin statistics accessed successfully',
    requestedBy: req.user
  });
});

// RBAC Protected route: Admin and Manager can update
router.put('/:id', authenticate, authorizeRoles('admin', 'manager'), userController.updateUser);

// RBAC Protected route: Strictly Admin only can delete
router.delete('/:id', authenticate, authorizeRoles('admin'), userController.deleteUser);

module.exports = router;
