# TaskFlow - MERN Task Management Application (100% TypeScript Edition) 🚀

> **Strict TypeScript Implementation (Zero `any`)**  
> Built for Week 1 Internship (Day 5). Every file in `backend` and `frontend` is strongly typed using modern TypeScript, strictly typed Mongoose models, Express custom request types, and React Context/Props interfaces.

---

## 🌟 What makes this 100% TypeScript?

### 1. Zero `any` Types
* `"strict": true`
* `"noImplicitAny": true`
* `"strictNullChecks": true`
* `"noUnusedLocals": true`
* `"noUnusedParameters": true`

### 2. Backend TypeScript Architecture (`backend/src`)
* **Typed Mongoose Documents**: `IUserDocument`, `ITaskDocument` extending `mongoose.Document<Types.ObjectId>`.
* **Union Types**: `TaskPriority = "low" | "medium" | "high"`.
* **Generic Express Request Interface**:
  ```typescript
  export interface IAuthRequest<
    Params = Record<string, string>,
    ResBody = unknown,
    ReqBody = unknown,
    ReqQuery = Record<string, string | undefined>
  > extends Request<Params, ResBody, ReqBody, ReqQuery> {
    user?: IUserDocument;
  }
  ```
* **Decoded JWT Payload**: Strongly typed `IJwtPayload`.

### 3. Frontend TypeScript Architecture (`frontend/src`)
* **Strict Model Contracts**: `Task`, `User`, `Priority`, `StatusFilter`, `PriorityFilter`.
* **Typed API Layer**: Native fetch wrapper with generic response helper:
  ```typescript
  const handleResponse = async <T>(response: Response): Promise<T>
  ```
* **Typed React Contexts**: `AuthContextType`, `ThemeContextType` with custom typed hooks (`useAuth()`, `useTheme()`).
* **Strongly Typed Components**: All React components type their props with dedicated interfaces (`TaskCardProps`, `TaskModalProps`, `TaskStatsProps`, `TaskFiltersProps`).

---

## 📁 TypeScript Directory Layout

```text
mern-project-typescript/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                 # Typed Mongoose connection
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts     # Typed JWT middleware (IAuthRequest)
│   │   ├── models/
│   │   │   ├── User.ts               # Model<IUserDocument>
│   │   │   └── Task.ts               # Model<ITaskDocument>
│   │   ├── routes/
│   │   │   ├── authRoutes.ts         # Register, Login, Me handlers
│   │   │   └── taskRoutes.ts         # CRUD endpoints with ITaskDbFilter
│   │   ├── types/
│   │   │   └── index.ts              # Global backend interfaces & types
│   │   └── server.ts                 # Express bootstrap & listen
│   ├── .env                          # MONGO_URI, PORT, JWT_SECRET
│   ├── package.json
│   └── tsconfig.json                 # Strict TypeScript configuration
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AuthCard.tsx          # Login & Register forms with autofill
    │   │   ├── EmptyState.tsx        # Empty state with typed action handlers
    │   │   ├── Navbar.tsx            # Navigation, dark mode toggle, logout
    │   │   ├── TaskCard.tsx          # Task item with priority styling
    │   │   ├── TaskFilters.tsx       # Search and typed status/priority filters
    │   │   ├── TaskModal.tsx         # Add/Edit task modal with TaskFormData
    │   │   └── TaskStats.tsx         # Metrics & progress percentage calculation
    │   ├── context/
    │   │   ├── AuthContext.tsx       # Auth provider & useAuth hook
    │   │   └── ThemeContext.tsx      # Dark/light mode provider & useTheme hook
    │   ├── services/
    │   │   └── api.ts                # Generic fetch API client
    │   ├── types/
    │   │   └── index.ts              # Global frontend contracts
    │   ├── App.tsx                   # Main dashboard & view switcher
    │   ├── index.css                 # Tailwind v4 import & dark mode variant
    │   └── main.tsx                  # React 19 root
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.app.json
    └── vite.config.ts
```

---

## ⚡ How to Run the TypeScript Project Locally

### 1. Start the Backend Server (TypeScript)

Open a terminal:
```bash
cd "g:\Ashish Company Folder\MxiCoders\Training_and_Internship\Week-1\day-05\mern-project-typescript\backend"
npm run dev
```
*(Or compile and run: `npm run build && npm start`)*

Backend will start on: **`http://localhost:5000`**

### 2. Start the Frontend Application (TypeScript)

Open a second terminal:
```bash
cd "g:\Ashish Company Folder\MxiCoders\Training_and_Internship\Week-1\day-05\mern-project-typescript\frontend"
npm run dev
```

Frontend will start on: **`http://localhost:5173`**

---

## 🎯 Verification & Testing

1. Open `http://localhost:5173`.
2. Click **"⚡ Autofill Demo Credentials"** and sign in.
3. Add, edit, filter, and complete tasks.
4. Toggle dark / light mode.
5. Notice that both `backend` and `frontend` have full IntelliSense, autocomplete, compile-time safety, and **0 type errors**.
