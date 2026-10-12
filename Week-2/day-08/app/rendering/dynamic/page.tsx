// 💡 EXPLANATION (Dynamic Rendering - SSR):
// `export const dynamic = "force-dynamic"` se Next.js is page ko
// HAR REQUEST PAR ON-DEMAND render karta hai.
// Reload karne par ye time HAR BAAR CHANGE HOGA!

import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DynamicRenderingPage() {
  const requestTime = new Date().toISOString();

  return (
    <div className="space-y-6">
      <Link
        href="/rendering"
        className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-medium inline-flex items-center gap-1"
      >
        ← Back to Rendering Overview
      </Link>

      <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-6 dark:border-rose-900/60 dark:bg-rose-950/20">
        <span className="rounded bg-rose-200 px-2 py-0.5 text-xs font-mono font-bold text-rose-900 dark:bg-rose-900 dark:text-rose-200">
          Dynamic Rendering (SSR)
        </span>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
          Request-Time On-Demand Rendering
        </h1>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Route Configuration: <code>export const dynamic = &quot;force-dynamic&quot;;</code>
        </p>

        <div className="mt-4 rounded-lg bg-white p-4 border border-rose-100 dark:bg-slate-900 dark:border-slate-800 text-xs font-mono">
          <p className="text-slate-500">// Generated Timestamp (Fresh on each request):</p>
          <p className="text-rose-700 dark:text-rose-300 font-bold mt-1 text-sm">
            {requestTime}
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            * Browser refresh (F5) dabane par ye timestamp turant naya show karega!
          </p>
        </div>
      </div>
    </div>
  );
}
