import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './index.css';

/**
 * ============================================================================
 * ROOT ENTRY POINT (main.tsx)
 * ============================================================================
 * 
 * Context API Provider Pattern:
 * <ThemeProvider> ko <App /> ke around wrap kiya hai.
 * Iska matlab: App component aur uske andar ke jitne bhi child components hain
 * (Navbar, TaskList, etc.) sab bina props pass kiye `useTheme()` hook se
 * theme data aur toggle function directly access kar sakte hain.
 */

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
