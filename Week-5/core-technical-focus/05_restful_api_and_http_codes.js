const express = require('express');
const app = express();

app.use(express.json());

// In-memory data
let products = [
  { id: 1, title: 'Keyboard', price: 2500, stock: 15, category: 'electronics' },
  { id: 2, title: 'Mouse', price: 1200, stock: 30, category: 'electronics' }
];

// GET: 200 OK (Fetch collection with query filters)
app.get('/api/v1/products', (req, res) => {
  const { category, minPrice } = req.query;
  let result = [...products];

  if (category) {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (minPrice) {
    result = result.filter(p => p.price >= Number(minPrice));
  }

  return res.status(200).json({
    success: true,
    data: result,
    total: result.length
  });
});

// GET: 200 OK or 404 Not Found (Fetch single item)
app.get('/api/v1/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  return res.status(200).json({
    success: true,
    data: product
  });
});

// POST: 201 Created (or 400 Bad Request, 409 Conflict)
app.post('/api/v1/products', (req, res) => {
  const { title, price, stock, category } = req.body || {};

  // 400 Bad Request: missing required fields
  if (!title || price === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Title and price are required'
    });
  }

  // 409 Conflict: duplicate entry
  const duplicate = products.some(p => p.title.toLowerCase() === title.trim().toLowerCase());
  if (duplicate) {
    return res.status(409).json({
      success: false,
      message: 'Product title already exists'
    });
  }

  const newProduct = {
    id: products.length + 1,
    title: title.trim(),
    price: Number(price),
    stock: Number(stock) || 0,
    category: category || 'general'
  };

  products.push(newProduct);

  return res.status(201).json({
    success: true,
    data: newProduct
  });
});

// PUT: 200 OK (Full replacement)
app.put('/api/v1/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const { title, price, stock, category } = req.body || {};
  if (!title || price === undefined || stock === undefined || !category) {
    return res.status(400).json({
      success: false,
      message: 'All fields required for full update'
    });
  }

  products[index] = { id, title, price, stock, category };

  return res.status(200).json({
    success: true,
    data: products[index]
  });
});

// PATCH: 200 OK (Partial update)
app.patch('/api/v1/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if (req.body.title !== undefined) product.title = req.body.title;
  if (req.body.price !== undefined) product.price = Number(req.body.price);
  if (req.body.stock !== undefined) product.stock = Number(req.body.stock);

  return res.status(200).json({
    success: true,
    data: product
  });
});

// DELETE: 204 No Content
app.delete('/api/v1/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const prevLength = products.length;
  products = products.filter(p => p.id !== id);

  if (products.length === prevLength) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  return res.status(204).send();
});

// 401 vs 403 status codes
app.get('/api/v1/admin/reports', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    // 401: Authentication missing
    return res.status(401).json({ success: false, message: 'Missing token' });
  }

  const role = req.headers['x-role'];
  if (role !== 'admin') {
    // 403: Forbidden (authenticated, but lack permissions)
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  return res.status(200).json({ success: true, data: { status: 'healthy' } });
});

module.exports = app;
