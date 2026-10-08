import { useTheme } from '../context/ThemeContext';

/**
 * ============================================================================
 * COMPONENT ARCHITECTURE: Navbar (Header Component)
 * ============================================================================
 * 
 * 🏗️ COMPONENT ARCHITECTURE CONCEPT:
 * - Single Responsibility: Navbar sirf top navigation aur global controls
 *   (jaise Theme switcher, guide modal toggle) handle karta hai.
 * - Context Consumption: Yahan 'useTheme()' hook use karke directly theme
 *   access kar rahe hain (bina parent App se props pass kiye - No prop drilling!).
 */

interface NavbarProps {
  onOpenGuide: () => void;
}

export const Navbar = ({ onOpenGuide }: NavbarProps) => {
  // Context API se directly values access kar rahe hain
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand">
          <div className="brand-logo">⚛️</div>
          <div>
            <h1 className="brand-title">React Core Architecture</h1>
            <p className="brand-subtitle">Week-2 Day-06 Hands-on Master Project</p>
          </div>
        </div>

        <div className="navbar-actions">
          {/* Guide Modal Trigger */}
          <button 
            type="button" 
            className="btn btn-secondary guide-btn"
            onClick={onOpenGuide}
            title="Read Concept Cheat Sheet"
          >
            📖 Concepts Guide
          </button>

          {/* Theme Switcher using Context API */}
          <button 
            type="button" 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </div>
    </header>
  );
};
