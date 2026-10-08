# ⚛️ Week-2 Day-06: React Core Concepts & Architecture

Ye project specifically **React ke 4 sabse important core concepts** ko practically sikhne ke liye banaya gaya hai:
1. **Component Architecture** (Container vs Presentational, Props Interfaces, Modular Structure)
2. **`useState` Hook** (Local State, Two-way Binding, Controlled Forms)
3. **`useEffect` Hook** (Side-effects, Dependency Array, Auto-persistence, Cleanup Functions)
4. **`useReducer` Hook** (Complex State Transitions, Reducer Pure Functions, Action Dispatching)
5. **Context API** (Global State without Prop Drilling, Theme Provider, Custom Hook)

---

## 📁 Project Architecture & File Structure

```text
Week-2/day-06/
├── src/
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces (Task, Priority, Filter, Theme)
│   ├── context/
│   │   └── ThemeContext.tsx         # [Context API] Global Theme Provider + useTheme Hook
│   ├── reducers/
│   │   └── taskReducer.ts           # [useReducer] Pure Reducer Function & Action Types
│   ├── components/
│   │   ├── Navbar.tsx               # Header, consumes Context API directly
│   │   ├── TaskStats.tsx            # Presentational component: Calculates & displays metrics
│   │   ├── ActivityTimer.tsx        # [useEffect Demo] Interval timer with Cleanup Function
│   │   ├── TaskForm.tsx             # [useState Demo] Controlled inputs & Form validation
│   │   ├── TaskFilter.tsx           # Controlled Filter buttons & Clear actions
│   │   ├── TaskItem.tsx             # Reusable Atomic UI Card with typed Props
│   │   ├── TaskList.tsx             # Container for Task items & Empty State
│   │   └── ConceptGuideModal.tsx    # Interactive popup explaining all concepts
│   ├── App.tsx                      # Root Orchestrator integrating all hooks
│   ├── App.css                      # Modern CSS styling & animations
│   ├── index.css                    # CSS Tokens & Light/Dark Theme variables
│   └── main.tsx                     # Entry point wrapping App with ThemeProvider
├── package.json
└── tsconfig.json
```

---

## 🧠 Concepts Breakdown

### 1. Component Architecture
* **Presentational Components (`TaskItem`, `TaskStats`):** Inka kaam sirf props lena aur UI render karna hota hai. Inme koi direct API calls ya complex state logic nahi hoti.
* **Container / Stateful Components (`App`, `TaskForm`):** Ye state hold karte hain aur data/callbacks children ko pass karte hain.
* **Separation of Concerns:** Har component ek single responsibility handle karta hai.

---

### 2. `useState` Hook
* Local component-level state handle karne ke liye use hota hai.
* **Controlled Input Pattern in `TaskForm.tsx`:**
```tsx
const [title, setTitle] = useState<string>('');

<input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

---

### 3. `useEffect` Hook
* React component ke render cycle ke bahar side-effects execute karne ke liye:
* **Auto-saving to LocalStorage (`App.tsx`):**
```tsx
useEffect(() => {
  localStorage.setItem('day06_tasks_list', JSON.stringify(tasks));
}, [tasks]); // Runs whenever 'tasks' change
```
* **Cleanup Function in `ActivityTimer.tsx` (Memory Leak Prevention):**
```tsx
useEffect(() => {
  if (!isRunning) return;
  const timer = setInterval(() => setSeconds((s) => s + 1), 1000);

  // 🧹 CLEANUP FUNCTION: Runs when component unmounts
  return () => clearInterval(timer);
}, [isRunning]);
```

---

### 4. `useReducer` Hook
* Jab state complex ho (e.g. array of tasks, multiple operations: add, delete, toggle, clear), tab `useReducer` state management ko predictable aur testable banata hai.
* **Pattern in `taskReducer.ts` & `App.tsx`:**
```tsx
// 1. Reducer Pure Function
export const taskReducer = (state: Task[], action: TaskAction): Task[] => {
  switch (action.type) {
    case 'ADD_TASK':
      return [action.payload, ...state];
    case 'TOGGLE_TASK':
      return state.map(t => t.id === action.payload.id ? { ...t, isCompleted: !t.isCompleted } : t);
    default:
      return state;
  }
};

// 2. Component usage
const [tasks, dispatch] = useReducer(taskReducer, initialState);
dispatch({ type: 'ADD_TASK', payload: newTask });
```

---

### 5. Context API (No Prop-Drilling)
* Global data (Theme, Current User, Settings) ko deeply nested components tak bina beech ke har component me props pass kiye pahunchane ke liye:
* **3-step structure (`ThemeContext.tsx`):**
  1. `createContext()`: Context create kiya.
  2. `<ThemeProvider>`: Root level (`main.tsx`) par App ko wrap kiya.
  3. `useTheme()`: Kisi bhi child component (`Navbar.tsx`) me direct consume kiya.

---

## 🚀 How to Run Locally

```bash
cd Week-2/day-06
npm install
npm run dev
```
Browser me `http://localhost:5173` open karein.
