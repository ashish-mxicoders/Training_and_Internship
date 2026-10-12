"use client";

// 💡 EXPLANATION (Passing Server Components as Children):
// Agar hum kisi Server Component ko directly Client Component ke andar import karenge,
// toh Next.js use bhi client bundle me convert kar dega.
// LEKIN agar hum Server Component ko as `children` prop Client Component ko pass karein,
// toh Server Component server par hi render hota hai aur uska JavaScript bundle
// client browser me nahi bheja jaata!
// This is called the "Composition Pattern" (Hydration Boundary).

import React, { useState } from "react";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/20">
      <div className="flex items-center justify-between pb-3 border-b border-indigo-100 dark:border-indigo-900/40">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
            Client Component Container (ClientWrapper)
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manages interactivity (Toggle open/close using useState)
          </p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 transition"
        >
          {isOpen ? "Hide Children" : "Show Children"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pl-4 border-l-2 border-indigo-400 dark:border-indigo-600">
          <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            👇 Server Component Rendered via {'{children}'}:
          </p>
          {children}
        </div>
      )}
    </div>
  );
}
