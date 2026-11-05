const express = require('express');
const app = express();

app.use(express.json());

// Step 1: Authentication Middleware (verifies token and sets req.user)
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Missing or invalid Authorization header'
    });
  }

  const token = authHeader.split(' ')[1];
  if (token !== 'secret123') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token'
    });
  }

  // Simulating user extracted from token (role can be passed via header for testing)
  const role = req.headers['x-user-role'] || 'user';
  req.user = { id: 101, name: 'Ashish', role };
  next();
};

// Step 2: Role-Based Access Control (RBAC) Middleware Factory
// Higher-order function returning Express middleware
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not authenticated'
      });
    }

    // Check if user's role exists in allowedRoles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

// 1. Public route: Accessible to everyone without login
app.get('/api/public', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Public resource accessible by all users'
  });
});

// 2. Authenticated route: Any logged-in user (user, manager, admin)
app.get('/api/profile', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Profile data',
    user: req.user
  });
});

// 3. Manager & Admin route: Only manager or admin can access
app.get('/api/reports', authenticate, authorize('manager', 'admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Business reports data',
    accessedBy: req.user
  });
});

// 4. Admin-only route: Strictly admin can access
app.delete('/api/admin/users/:id', authenticate, authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: `User with ID ${req.params.id} deleted by Admin`,
    deletedBy: req.user
  });
});

module.exports = {
  authenticate,
  authorize
};

// Run standalone if executed directly via node 06_role_based_access_control.js
if (require.main === module) {
  const PORT = 5006;
  app.listen(PORT, () => {
    console.log(`[06 Role-Based Access Control] Running on http://localhost:${PORT}`);
    console.log(`- GET    http://localhost:${PORT}/api/public (Public)`);
    console.log(`- GET    http://localhost:${PORT}/api/profile (Header: Authorization: Bearer secret123)`);
    console.log(`- GET    http://localhost:${PORT}/api/reports (Header: Authorization: Bearer secret123, x-user-role: manager)`);
    console.log(`- DELETE http://localhost:${PORT}/api/admin/users/10 (Header: Authorization: Bearer secret123, x-user-role: admin)`);
  });
}

