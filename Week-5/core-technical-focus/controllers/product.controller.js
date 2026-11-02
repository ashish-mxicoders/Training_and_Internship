const { readStorage, writeStorage } = require('../storage/storage.service');
const { createError } = require('../middlewares/error.middleware');

// GET /api/products
const getAllProducts = (req, res, next) => {
  try {
    const { category, minPrice } = req.query;
    const store = readStorage();
    let products = store.products || [];

    if (category) {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (minPrice) {
      products = products.filter(p => p.price >= Number(minPrice));
    }

    return res.status(200).json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
const getProductById = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const store = readStorage();
    const product = (store.products || []).find(p => p.id === id);

    if (!product) {
      throw createError(`Product with ID ${id} not found`, 404);
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/products
const createProduct = (req, res, next) => {
  try {
    const { title, price, stock, category } = req.body || {};

    if (!title || price === undefined) {
      throw createError('Title and price are required', 400);
    }

    const store = readStorage();
    const exists = (store.products || []).some(p => p.title.toLowerCase() === title.trim().toLowerCase());
    if (exists) {
      throw createError('Product title already exists', 409);
    }

    const newProduct = {
      id: (store.products && store.products.length > 0) ? Math.max(...store.products.map(p => p.id)) + 1 : 1,
      title: title.trim(),
      price: Number(price),
      stock: Number(stock) || 0,
      category: category || 'general'
    };

    store.products = store.products || [];
    store.products.push(newProduct);
    writeStorage(store);

    return res.status(201).json({
      success: true,
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
const deleteProduct = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const store = readStorage();
    const initialLen = store.products ? store.products.length : 0;

    store.products = (store.products || []).filter(p => p.id !== id);

    if (store.products.length === initialLen) {
      throw createError('Product not found to delete', 404);
    }

    writeStorage(store);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct
};
