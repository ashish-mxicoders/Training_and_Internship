# TaskFlow - MERN Task Management Application 🚀

> **Week 1 Internship Project (Day 5)**  
> Built with clean, beginner-friendly **JavaScript (ES6+)** so you can learn the full architecture and refactor it into **100% strictly typed TypeScript (without using `any`)**!

---

## 🌟 Features Included

1. **Authentication System (JWT + Bcrypt)**
   - User Registration with validation and password hashing
   - User Login with JWT token generation
   - Session persistence in `localStorage`
   - Secure Protected Routes (`authMiddleware`)

2. **Task Management (Full CRUD)**
   - **Create Task**: Title, description, priority (`low`, `medium`, `high`), due date
   - **Read Tasks**: List tasks for the authenticated user only
   - **Update Task**: Edit title, description, priority, or deadline
   - **Toggle Status**: Instant toggle between *Pending* and *Completed*
   - **Delete Task**: Remove task with confirmation
   - **Filter & Search**: Search by keywords, filter by status (All, Pending, Completed), filter by priority

3. **Analytics & Progress Overview**
   - Live metrics: Total Tasks, Completed, Pending, Urgent Tasks
   - Dynamic completion progress bar percentage

4. **UI & Theme**
   - **Dark / Light Mode**: Instant toggle with theme persistence in `localStorage`
   - Modern, clean design using **Tailwind CSS v4**
   - Responsive layout for desktop and mobile

5. **Database Connection**
   - Connected to MongoDB Atlas:
     - Collection/Database: `task-manager-mern-js-company`

---

## 📁 Project Structure

```text
mern-project/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT token verification middleware
│   ├── models/
│   │   ├── User.js               # Mongoose User schema & model
│   │   └── Task.js               # Mongoose Task schema & model
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth (register, login, me)
│   │   └── taskRoutes.js         # /api/tasks (CRUD endpoints)
│   ├── .env                      # MONGO_URI, PORT, JWT_SECRET
│   ├── package.json
│   └── server.js                 # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AuthCard.jsx      # Login & Register forms with autofill
    │   │   ├── EmptyState.jsx    # Illustration for zero/no-match tasks
    │   │   ├── Navbar.jsx        # Navigation bar, theme toggle, logout
    │   │   ├── TaskCard.jsx      # Individual task card with status toggle
    │   │   ├── TaskFilters.jsx   # Search & filter controls
    │   │   ├── TaskModal.jsx     # Add/Edit task modal
    │   │   └── TaskStats.jsx     # Metrics counters and progress bar
    │   ├── context/
    │   │   ├── AuthContext.jsx   # Auth provider (user, token, login, logout)
    │   │   └── ThemeContext.jsx  # Dark/light mode provider
    │   ├── services/
    │   │   └── api.js            # Centralized API fetch methods
    │   ├── App.jsx               # Main application container
    │   ├── index.css             # Tailwind v4 import & dark mode variant
    │   └── main.jsx              # React entry root
    ├── package.json
    └── vite.config.js
```

---

## ⚡ How to Run the Project Locally

### 1. Start the Backend Server

Open a terminal and navigate to the backend folder:

```bash
cd backend
npm run dev
# Or: node server.js
```

The server will start on: **`http://localhost:5000`**  
You will see:
```text
MongoDB Connected successfully: cluster0...
Database Name: task-manager-mern-js-company
Server is running on: http://localhost:5000
```

### 2. Start the Frontend Application

Open a second terminal and navigate to the frontend folder:

```bash
cd frontend
npm run dev
```

The frontend will run on: **`http://localhost:5173`** (or the port Vite prints in your terminal).

---

## 🎯 Quick Demo / Testing Instructions

1. Open `http://localhost:5173` in your browser.
2. On the login screen, click **"⚡ Autofill Demo Credentials"** to test immediately, or click **"Register"** to create a custom user account.
3. Click **"Create Task"** to add a task with title, description, priority, and due date.
4. Test clicking the checkbox on any task to mark it completed. Notice the completion progress bar and counters update in real-time!
5. Toggle between **Dark Mode** and **Light Mode** using the moon/sun button in the top right.
6. Verify in MongoDB Atlas that the data is saved in database `task-manager-mern-js-company`.

---

## 📘 Your Next Step: Refactoring to TypeScript (Zero `any`)

When you are ready to refactor this code to **TypeScript**, follow this roadmap:

### 1. Backend Refactor (`.js` ➔ `.ts`)
1. Run: `npm install -D typescript ts-node @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken`
2. Create `tsconfig.json` with `"strict": true`, `"noImplicitAny": true`.
3. Create TypeScript interfaces:
   - `interface IUserDocument extends mongoose.Document { name: string; email: string; password: string; }`
   - `interface ITaskDocument extends mongoose.Document { title: string; description: string; priority: 'low' | 'medium' | 'high'; dueDate: Date | null; isCompleted: boolean; user: mongoose.Types.ObjectId; }`
   - `interface AuthenticatedRequest extends Request { user?: IUserDocument; }`

### 2. Frontend Refactor (`.jsx` ➔ `.tsx`)
1. Rename files from `.jsx` to `.tsx`.
2. Define types:
   - `export type Priority = 'low' | 'medium' | 'high';`
   - `export interface ITask { _id: string; title: string; description?: string; priority: Priority; dueDate?: string | null; isCompleted: boolean; createdAt: string; }`
   - `export interface IUser { id: string; name: string; email: string; }`
3. Type component props and state without `any`:
   - `interface TaskCardProps { task: ITask; onToggleStatus: (id: string) => void; onEdit: (task: ITask) => void; onDelete: (id: string) => void; }`
