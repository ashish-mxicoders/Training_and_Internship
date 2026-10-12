// 💡 EXPLANATION (Nested Layout):
// Next.js App Router me nested folders apna khud ka `layout.tsx` define kar sakte hain.
// Ye layout sirf is folder aur iske children par apply hota hai.
// Jab aap child pages (/settings wagera) ke beech navigate karte hain,
// toh ye layout PERSIST karta hai (re-mount ya re-render nahi hota).

import Link from "next/link";
import React from "react";

export default function NestedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <Link
        href="/routing"
        className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-medium inline-flex items-center gap-1"
      >
        ← Back to Routing Overview
      </Link>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-6 dark:border-amber-900/60 dark:bg-amber-950/20">
        {/* Nested Layout Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-amber-200 dark:border-amber-900/60 gap-3">
          <div>
            <span className="rounded bg-amber-200 px-2 py-0.5 text-xs font-mono font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-200">
              Nested Layout (Persistent UI Shell)
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Dashboard Section Shell
            </h2>
            <p className="text-xs text-slate-500">
              Path: <code>app/routing/nested/layout.tsx</code>
            </p>
          </div>

          {/* Sub-navigation inside layout */}
          <div className="flex gap-2">
            <Link
              href="/routing/nested"
              className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs border border-amber-200 hover:bg-amber-50 dark:bg-slate-800 dark:text-slate-200 dark:border-amber-900"
            >
              Overview
            </Link>
            <Link
              href="/routing/nested/settings"
              className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs border border-amber-200 hover:bg-amber-50 dark:bg-slate-800 dark:text-slate-200 dark:border-amber-900"
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Dynamic Children Injected Here */}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
