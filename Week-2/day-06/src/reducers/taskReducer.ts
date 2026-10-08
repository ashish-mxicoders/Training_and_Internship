import type { Task, TaskFormData } from '../types';

/**
 * ============================================================================
 * useReducer (Complex State Logic Management)
 * ============================================================================
 * 
 * ❓ useReducer KYA HAI AUR KAB USE KAREIN?
 * - useState simple values (strings, booleans, single counters) ke liye best hai.
 * - Lekin jab aapki state complex ho (e.g., Array of objects, multiple actions,
 *   ek action par multiple state changes hona), tab `useReducer` best hota hai.
 * 
 * 🔑 Reducer Pattern ke 3 main parts hote hain:
 * 1. State: Aapka current data.
 * 2. Action: Ek object jo batata hai ki "Kya karna hai" (`type`) aur naya data (`payload`).
 * 3. Reducer Function: Ek PURE FUNCTION jo (currentState, action) leta hai aur
 *    NEW STATE return karta hai (Original state ko mutate kabhi nahi karta!).
 */

// 1. Action Types (TypeScript Discriminated Union)
export type TaskAction =
  | { type: 'ADD_TASK'; payload: TaskFormData }
  | { type: 'TOGGLE_TASK'; payload: { id: string } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'LOAD_SAVED_TASKS'; payload: Task[] };

// 2. Initial State
export const initialTasksState: Task[] = [
  {
    id: 'demo-1',
    title: 'Learn Component Architecture',
    description: 'Separate components into Container, Presentational, and Reusable UI modules.',
    priority: 'high',
    isCompleted: true,
    createdAt: new Date().toLocaleDateString(),
  },
  {
    id: 'demo-2',
    title: 'Master React Hooks (useState & useEffect)',
    description: 'Understand local component state, side-effects, and cleanup intervals.',
    priority: 'high',
    isCompleted: false,
    createdAt: new Date().toLocaleDateString(),
  },
  {
    id: 'demo-3',
    title: 'Master useReducer & Context API',
    description: 'Handle complex state transitions and share state globally without prop-drilling.',
    priority: 'medium',
    isCompleted: false,
    createdAt: new Date().toLocaleDateString(),
  },
];

/**
 * 3. Reducer Function
 * Note: Ye function pure hota hai. State ko direct modify nahi karte,
 * hamesha naya object ya naya array copy karke return karte hain (...spread operator).
 */
export const taskReducer = (state: Task[], action: TaskAction): Task[] => {
  switch (action.type) {
    case 'ADD_TASK': {
      // Naya task create karke array ke start me add karna
      const newTask: Task = {
        id: 'task-' + Date.now(),
        title: action.payload.title,
        description: action.payload.description,
        priority: action.payload.priority,
        isCompleted: false,
        createdAt: new Date().toLocaleDateString(),
      };
      return [newTask, ...state];
    }

    case 'TOGGLE_TASK': {
      // Task ki completion status ko flip (invert) karna
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      );
    }

    case 'DELETE_TASK': {
      // Selected task ko array se remove karna
      return state.filter((task) => task.id !== action.payload.id);
    }

    case 'CLEAR_COMPLETED': {
      // Sabhi completed tasks ko ek sath remove karna
      return state.filter((task) => !task.isCompleted);
    }

    case 'LOAD_SAVED_TASKS': {
      // LocalStorage ya initial load ke waqt saved tasks set karna
      return action.payload;
    }

    default:
      // Unknown action par current state as-it-is return karo
      return state;
  }
};
