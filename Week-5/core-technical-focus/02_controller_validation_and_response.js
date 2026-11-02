// Mock database
const users = [
  { id: 1, name: 'Ashish Kumar', email: 'ashish@example.com', role: 'admin', age: 24 },
  { id: 2, name: 'John Doe', email: 'john@example.com', role: 'user', age: 28 }
];

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Create user: extracts body, validates input, returns 201
const createUserController = (req, res) => {
  const { name, email, password, age, role } = req.body || {};

  // Input validation
  const errors = [];
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  }
  if (!email || !isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }
  if (!password || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }
  if (age !== undefined && (typeof age !== 'number' || age < 18)) {
    errors.push({ field: 'age', message: 'Age must be 18 or above' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  // Duplicate email check
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered'
    });
  }

  const newUser = {
    id: users.length + 1,
    name: name.trim(),
    email: email.toLowerCase(),
    role: role || 'user',
    age: age || null
  };

  users.push(newUser);

  return res.status(201).json({
    success: true,
    data: newUser
  });
};

// Get user by ID: extracts params, validates ID, returns 200 or 404
const getUserByIdController = (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  return res.status(200).json({
    success: true,
    data: user
  });
};

// Search users: extracts query params, handles filtering & pagination
const searchUsersController = (req, res) => {
  const { role, search, page = '1', limit = '10' } = req.query;
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);

  let result = [...users];

  if (role) {
    result = result.filter(u => u.role.toLowerCase() === role.toLowerCase());
  }
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
  }

  return res.status(200).json({
    success: true,
    data: result,
    meta: {
      page: parsedPage,
      limit: parsedLimit,
      total: result.length
    }
  });
};

module.exports = {
  createUserController,
  getUserByIdController,
  searchUsersController
};
