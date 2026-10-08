import { useState } from 'react';

/**
 * ============================================================================
 * INTERACTIVE LEARNING MODAL: Concepts Cheat Sheet
 * ============================================================================
 * 
 * Demonstrates useState for active tab navigation and modal visibility.
 * Provides clear, accessible notes on each core Day-06 concept.
 */

interface ConceptGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'architecture' | 'useState' | 'useEffect' | 'useReducer' | 'context';

export const ConceptGuideModal = ({ isOpen, onClose }: ConceptGuideModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('architecture');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon">📚</span>
            <h2 className="modal-title">Week-2 Day-06 React Concepts Guide</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="modal-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            🏗️ Architecture
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'useState' ? 'active' : ''}`}
            onClick={() => setActiveTab('useState')}
          >
            🪝 useState
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'useEffect' ? 'active' : ''}`}
            onClick={() => setActiveTab('useEffect')}
          >
            ⚡ useEffect
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'useReducer' ? 'active' : ''}`}
            onClick={() => setActiveTab('useReducer')}
          >
            🔄 useReducer
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'context' ? 'active' : ''}`}
            onClick={() => setActiveTab('context')}
          >
            🌐 Context API
          </button>
        </div>

        {/* Tab Content */}
        <div className="modal-body">
          {activeTab === 'architecture' && (
            <div className="tab-pane">
              <h3>1. Component Architecture (Best Practices)</h3>
              <p>
                React apps ko scalable banane ke liye components ko clear folders aur responsibilities me divide kiya jata hai:
              </p>
              <ul>
                <li><strong>Presentational Components:</strong> Sirf UI display karte hain via props (e.g., <code>TaskItem</code>, <code>TaskStats</code>).</li>
                <li><strong>Container / Stateful Components:</strong> Logic, state aur event handlers hold karte hain (e.g., <code>App</code>, <code>TaskForm</code>).</li>
                <li><strong>Single Responsibility:</strong> Har file ek specific task karti hai (Separation of Concerns).</li>
                <li><strong>TypeScript Contracts:</strong> Har component ke Props ke liye explicit TypeScript <code>interface</code> define kiya jata hai.</li>
              </ul>
            </div>
          )}

          {activeTab === 'useState' && (
            <div className="tab-pane">
              <h3>2. useState Hook</h3>
              <p>
                Local component state manage karne ke liye use hota hai jo user actions (typing, toggling) par re-render trigger karta hai.
              </p>
              <pre className="code-box">
{`// Example from TaskForm.tsx
const [title, setTitle] = useState<string>('');

// Two-way binding:
<input 
  value={title} 
  onChange={(e) => setTitle(e.target.value)} 
/>`}
              </pre>
              <p><strong>Golden Rule:</strong> State ko directly mutate mat karein (`state = newVal` ❌), hamesha setter function use karein (`setState(newVal)` ✅).</p>
            </div>
          )}

          {activeTab === 'useEffect' && (
            <div className="tab-pane">
              <h3>3. useEffect Hook</h3>
              <p>
                React ke pure rendering flow se bahar side-effects perform karne ke liye:
              </p>
              <ul>
                <li><code>[]</code> (Empty array): Sirf ek baar mount hone par run hota hai.</li>
                <li><code>[dependency]</code>: Jab dependency change hoti hai tab run hota hai (jaise localStorage sync).</li>
                <li><strong>Cleanup Function:</strong> Timers aur subscriptions ko memory leak se bachane ke liye cleanup return kiya jata hai.</li>
              </ul>
              <pre className="code-box">
{`// Example from ActivityTimer.tsx
useEffect(() => {
  const id = setInterval(() => setSeconds(s => s + 1), 1000);
  return () => clearInterval(id); // 🧹 Cleanup function!
}, [isRunning]);`}
              </pre>
            </div>
          )}

          {activeTab === 'useReducer' && (
            <div className="tab-pane">
              <h3>4. useReducer Hook</h3>
              <p>
                Jab state me multiple related fields hon, ya complex state transitions (Add, Toggle, Delete, Filter) hon, tab <code>useReducer</code> code ko organized aur predictable banata hai.
              </p>
              <pre className="code-box">
{`// Reducer Pattern:
const [tasks, dispatch] = useReducer(taskReducer, initialState);

// Dispatch an action:
dispatch({ type: 'ADD_TASK', payload: newTaskData });
dispatch({ type: 'TOGGLE_TASK', payload: { id: '123' } });`}
              </pre>
              <p><strong>Reducer Rules:</strong> Reducer ek pure function hota hai jo new array/object copy return karta hai.</p>
            </div>
          )}

          {activeTab === 'context' && (
            <div className="tab-pane">
              <h3>5. Context API</h3>
              <p>
                Global state (jaise Theme, Auth user, Language) ko bina har level par props pass kiye (Prop-drilling) kisi bhi child component me directly access karne ke liye.
              </p>
              <pre className="code-box">
{`// 1. Create Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Wrap App with Provider
<ThemeProvider><App /></ThemeProvider>

// 3. Consume in any child component
const { theme, toggleTheme } = useTheme();`}
              </pre>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
