// ==============================================================================
// TODO CONTROLLER (CRUD Operations)
// ==============================================================================
// Is controller me hum Todo application ke saare business logic aur 
// PostgreSQL database queries handle karte hain.
//
// CRUD stands for:
//   C - Create  (POST)   -> Naya task add karna
//   R - Read    (GET)    -> Tasks ko fetch/read karna
//   U - Update  (PUT/PATCH) -> Existing task ko update karna
//   D - Delete  (DELETE) -> Task ko database se delete karna
// ==============================================================================

const { query } = require('../config/db');

// ==============================================================================
// 1. CREATE: Naya Todo create karna
// Route: POST /api/todos
// Request Body: { "title": "Buy Milk", "description": "From local store" }
// ==============================================================================
const createTodo = async (req, res) => {
  try {
    // req.body se client dwara bheja gaya data nikalte hain
    const { title, description } = req.body;

    // Validation: Title empty nahi hona chahiye
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: "title" field zaroori hai (mandatory)!',
      });
    }

    // SQL Query Explanation:
    // Hum parameterized query ($1, $2) use karte hain taaki SQL Injection se bacha ja sake.
    // 'RETURNING *' ka matlab hai ki insert hone ke baad naya created record hume turant mil jaye.
    const insertQuery = `
      INSERT INTO todos (title, description)
      VALUES ($1, $2)
      RETURNING *;
    `;

    // Query execute karte hain
    // description agar na diya ho toh null ya empty string save ho
    const values = [title.trim(), description ? description.trim() : null];
    const result = await query(insertQuery, values);

    // 201 Created status code ke saath response bhejte hain
    return res.status(201).json({
      success: true,
      message: 'Todo successfully create ho gaya!',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in createTodo:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Todo create nahi ho paya.',
      error: error.message,
    });
  }
};

// ==============================================================================
// 2. READ ALL: Saare Todos fetch karna
// Route: GET /api/todos
// Optional Filter: GET /api/todos?completed=true ya GET /api/todos?completed=false
// ==============================================================================
const getAllTodos = async (req, res) => {
  try {
    const { completed } = req.query;

    let sqlQuery = 'SELECT * FROM todos';
    const queryParams = [];

    // Optional Filter: Agar user ne query me ?completed=true/false bheja ho
    if (completed !== undefined) {
      const isCompletedBool = completed === 'true';
      sqlQuery += ' WHERE is_completed = $1';
      queryParams.push(isCompletedBool);
    }

    // Todos ko ID ke hisaab se ascending order me sort karte hain
    sqlQuery += ' ORDER BY id ASC;';

    const result = await query(sqlQuery, queryParams);

    return res.status(200).json({
      success: true,
      totalCount: result.rows.length,
      message: 'Todos successfully retrieve ho gaye!',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error in getAllTodos:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Todos fetch nahi ho paye.',
      error: error.message,
    });
  }
};

// ==============================================================================
// 3. READ ONE: Single Todo ID ke hisaab se fetch karna
// Route: GET /api/todos/:id
// Example: GET /api/todos/1
// ==============================================================================
const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check ki ID valid number hai ya nahi
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID: ID ek valid number honi chahiye!',
      });
    }

    const selectQuery = 'SELECT * FROM todos WHERE id = $1;';
    const result = await query(selectQuery, [id]);

    // Agar us ID ka todo nahi mila toh 404 Not Found bhejte hain
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `ID ${id} wala Todo nahi mila (Not Found).`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Todo mil gaya!',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in getTodoById:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Todo fetch karte waqt error aaya.',
      error: error.message,
    });
  }
};

// ==============================================================================
// 4. UPDATE: Existing Todo ko update karna
// Route: PUT /api/todos/:id
// Request Body: { "title": "Updated Title", "description": "Updated", "is_completed": true }
// ==============================================================================
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, is_completed } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID: ID ek valid number honi chahiye!',
      });
    }

    // Pehle check karte hain ki kya ye Todo exist karta hai
    const existingTodoCheck = await query('SELECT * FROM todos WHERE id = $1;', [id]);
    if (existingTodoCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Update failed: ID ${id} wala Todo database me nahi hai.`,
      });
    }

    const currentTodo = existingTodoCheck.rows[0];

    // COALESCE logic: Agar naya value pass hua toh naya lo, nahi toh purana rehne do
    const updatedTitle = title !== undefined ? title.trim() : currentTodo.title;
    const updatedDescription = description !== undefined ? description.trim() : currentTodo.description;
    const updatedStatus = is_completed !== undefined ? Boolean(is_completed) : currentTodo.is_completed;

    const updateQuery = `
      UPDATE todos
      SET title = $1,
          description = $2,
          is_completed = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *;
    `;

    const result = await query(updateQuery, [
      updatedTitle,
      updatedDescription,
      updatedStatus,
      id,
    ]);

    return res.status(200).json({
      success: true,
      message: `ID ${id} wala Todo update ho gaya!`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in updateTodo:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Todo update karte waqt error aaya.',
      error: error.message,
    });
  }
};

// ==============================================================================
// 5. TOGGLE STATUS: Todo ka completed status true/false switch karna
// Route: PATCH /api/todos/:id/toggle
// Example: Ek click me incomplete task ko completed mark karna ya vice-versa
// ==============================================================================
const toggleTodoStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID: ID ek valid number honi chahiye!',
      });
    }

    // SQL Trick: "is_completed = NOT is_completed" boolean ko invert kar deta hai
    const toggleQuery = `
      UPDATE todos
      SET is_completed = NOT is_completed,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;

    const result = await query(toggleQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Toggle failed: ID ${id} wala Todo nahi mila.`,
      });
    }

    const updatedTodo = result.rows[0];
    const statusText = updatedTodo.is_completed ? 'Completed (Ho gaya)' : 'Pending (Baki hai)';

    return res.status(200).json({
      success: true,
      message: `Todo status change hokar "${statusText}" ho gaya!`,
      data: updatedTodo,
    });
  } catch (error) {
    console.error('Error in toggleTodoStatus:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Todo toggle karte waqt error aaya.',
      error: error.message,
    });
  }
};

// ==============================================================================
// 6. DELETE: Todo ko database se remove karna
// Route: DELETE /api/todos/:id
// ==============================================================================
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID: ID ek valid number honi chahiye!',
      });
    }

    const deleteQuery = 'DELETE FROM todos WHERE id = $1 RETURNING *;';
    const result = await query(deleteQuery, [id]);

    // Agar koi row delete nahi hui, matlab wo ID exist hi nahi karti
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Delete failed: ID ${id} wala Todo database me nahi mila.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `ID ${id} wala Todo successfully delete kar diya gaya!`,
      deletedItem: result.rows[0],
    });
  } catch (error) {
    console.error('Error in deleteTodo:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Todo delete karte waqt error aaya.',
      error: error.message,
    });
  }
};

// Sabhi controller functions ko export karte hain
module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  toggleTodoStatus,
  deleteTodo,
};

