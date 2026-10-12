"use client";

// 💡 EXPLANATION (Hindi / English):
// Ye ek CLIENT COMPONENT hai kyunki isme "use client" directive laga hai.
// Client components me hi hum interactive hooks jaise useState, useEffect,
// aur event listeners (onClick, onChange) use kar sakte hain.
// Server Component me direct onClick ya useState use karne par build error aayega!

import { useState } from "react";

export default function ClientCounter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          Client Component ("use client")
        </span>
        <span className="rounded bg-amber-200/60 px-2 py-0.5 text-[11px] font-mono text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
          Interactive State
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
        Current Count: <strong className="text-sm font-mono text-slate-900 dark:text-white">{count}</strong>
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => setCount((prev) => prev + 1)}
          className="rounded bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 transition active:scale-95"
        >
          Increment (+1)
        </button>
        <button
          onClick={() => setCount(0)}
          className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          Reset
        </button>
      </div>

      <p className="mt-2 text-[11px] text-amber-700/80 dark:text-amber-400/80 italic">
        * Browser hydration ke baad ye click events active ho jaate hain.
      </p>
    </div>
  );
}
