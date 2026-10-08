import { useState, useEffect } from 'react';

/**
 * ============================================================================
 * HOOK DEMO: useEffect with Cleanup Function (ActivityTimer)
 * ============================================================================
 * 
 * ❓ useEffect KYA HAI?
 * React me components pure functions hone chahiye jo sirf JSX render karein.
 * Jab bhi component ke bahar kuch "Side Effect" perform karna ho:
 * - Timers (setInterval / setTimeout)
 * - Event Listeners (window resize, scroll)
 * - LocalStorage sync
 * - Subscriptions / WebSockets
 * To unhe 'useEffect' ke andar wrap kiya jata hai.
 * 
 * ⚠️ CLEANUP FUNCTION KA IMPORTANCE:
 * Agar aap setInterval chala kar chhod denge aur user component unmount kar de,
 * to timer background me chalta rahega jisse Memory Leak ho jati hai.
 * useEffect ka return callback: `return () => clearInterval(timer)` 
 * component unmount hone par cleanup karta hai.
 */

export const ActivityTimer = () => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    // Agar timer paused hai, to kuch mat karo
    if (!isRunning) return;

    // 1. Side effect start kiya: Har 1 second me state update karo
    const intervalId = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // 2. CLEANUP FUNCTION (Very Important!):
    // Jab component unmount hoga ya 'isRunning' change hoga, 
    // ye return function purane interval ko clear karega.
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]); // Dependency Array: Sirf tab dubara chalega jab isRunning change ho

  // Seconds ko mm:ss format me convert karne ke liye helper
  const formatTime = (totalSec: number): string => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-badge">
      <div className="timer-info">
        <span className="timer-pulse"></span>
        <span className="timer-label">Session Learning Time:</span>
        <strong className="timer-display">{formatTime(seconds)}</strong>
      </div>
      <div className="timer-controls">
        <button
          type="button"
          className="btn-timer"
          onClick={() => setIsRunning((prev) => !prev)}
        >
          {isRunning ? '⏸️ Pause' : '▶️ Resume'}
        </button>
        <button
          type="button"
          className="btn-timer"
          onClick={() => {
            setSeconds(0);
            setIsRunning(true);
          }}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
};
