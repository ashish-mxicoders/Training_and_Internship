const { readStorage, writeStorage } = require('../storage/storage.service');
const { createError } = require('../middlewares/error.middleware');

// GET /api/users
const getAllUsers = (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const store = readStorage();
    let users = store.users || [];

    if (role) {
      users = users.filter(u => u.role.toLowerCase() === role.toLowerCase());
    }
    if (search) {
      const term = search.toLowerCase();
      users = users.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
    }

    return res.status(200).json({
      success: true,
      data: users,
      meta: {
        total: users.length,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id
const getUserById = (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      throw createError('User ID must be a valid number', 400);
    }

    const store = readStorage();
    const user = (store.users || []).find(u => u.id === userId);

    if (!user) {
      throw createError(`User with ID ${userId} not found`, 404);
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/users
const createUser = (req, res, next) => {
  try {
    const { name, email, role, age } = req.body || {};

    // Request validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw createError('Name is required', 400);
    }
    if (!email || !email.includes('@')) {
      throw createError('Valid email is required', 400);
    }

    const store = readStorage();
    const exists = (store.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw createError('Email already registered', 409);
    }

    const newUser = {
      id: (store.users && store.users.length > 0) ? Math.max(...store.users.map(u => u.id)) + 1 : 1,
      name: name.trim(),
      email: email.toLowerCase(),
      role: role || 'user',
      age: Number(age) || null
    };

    store.users = store.users || [];
    store.users.push(newUser);
    writeStorage(store);

    return res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id
const updateUser = (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const store = readStorage();
    const index = (store.users || []).findIndex(u => u.id === userId);

    if (index === -1) {
      throw createError('User not found to update', 404);
    }

    const { name, email, role, age } = req.body || {};
    if (name) store.users[index].name = name.trim();
    if (email) store.users[index].email = email.toLowerCase();
    if (role) store.users[index].role = role;
    if (age !== undefined) store.users[index].age = Number(age);

    writeStorage(store);

    return res.status(200).json({
      success: true,
      data: store.users[index]
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id
const deleteUser = (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const store = readStorage();
    const initialLen = store.users ? store.users.length : 0;

    store.users = (store.users || []).filter(u => u.id !== userId);

    if (store.users.length === initialLen) {
      throw createError('User not found to delete', 404);
    }

    writeStorage(store);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
