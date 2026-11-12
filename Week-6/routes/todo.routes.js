// ==============================================================================
// TODO ROUTES
// ==============================================================================
// Express Router ka use karke hum endpoints ko controllers ke saath map karte hain.
// Base URL in server.js: /api/todos
// ==============================================================================

const express = require('express');
const router = express.Router();

// Controller functions ko import karte hain
const {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  toggleTodoStatus,
  deleteTodo,
} = require('../controllers/todo.controller');

// 1. POST /api/todos - Naya Todo create karna
router.post('/', createTodo);

// 2. GET /api/todos - Saare Todos fetch karna (supports ?completed=true)
router.get('/', getAllTodos);

// 3. GET /api/todos/:id - Single Todo fetch karna ID ke hisaab se
router.get('/:id', getTodoById);

// 4. PUT /api/todos/:id - Existing Todo ko update karna
router.put('/:id', updateTodo);

// 5. PATCH /api/todos/:id/toggle - Todo ka completed status toggle (true/false) karna
router.patch('/:id/toggle', toggleTodoStatus);

// 6. DELETE /api/todos/:id - Todo ko delete karna
router.delete('/:id', deleteTodo);

module.exports = router;

