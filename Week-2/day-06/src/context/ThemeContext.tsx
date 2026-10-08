import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ThemeMode, ThemeContextType } from '../types';

/**
 * ============================================================================
 * CONTEXT API (Global State Management without Prop Drilling)
 * ============================================================================
 * 
 * ❓ CONTEXT API KYA HAI?
 * React me jab hame kisi state (jaise Theme, User Auth, Language) ko deeply 
 * nested components tak pahunchana hota hai, to normal tarike se hame har component
 * ke through props pass karne padte hain (jise "Prop Drilling" kehte hain).
 * 
 * Context API ek aisi centralized "pipe" ya "store" create karta hai jisse 
 * app ka koi bhi child component directly access kar sakta hai bina intermediate
 * props pass kiye.
 * 
 * 3 Main Steps:
 * 1. createContext()    -> Context create karta hai.
 * 2. <Context.Provider> -> State ko children components ko supply karta hai.
 * 3. useContext()       -> Children components me state ko consume (use) karta hai.
 */

// Step 1: Context create karna (initial value null ya undefined di jaati hai)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

// Step 2: Provider Component jo State ko hold karta hai aur provide karta hai
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // useState se theme state manage kar rahe hain
  // Pehle check karte hain localStorage me pehle se saved theme hai ya nahi
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('app-theme') as ThemeMode;
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  // useEffect: Jab bhi theme change ho, DOM ke root class aur localStorage ko update karo
  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }, [theme]);

  // Theme toggle function
  const toggleTheme = (): void => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    // Provider ke 'value' prop me wo data dete hain jo sabhi children ko chahiye
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Step 3: Custom Hook for easy & safe consumption
/**
 * Custom Hook: useTheme
 * Faida: Har bar useContext(ThemeContext) likhne aur null check karne ki
 * zaroorat nahi padti. Direct const { theme, toggleTheme } = useTheme() use karo.
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  // Runtime safety check: Agar koi component ThemeProvider ke bahar use kare to error de do
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
