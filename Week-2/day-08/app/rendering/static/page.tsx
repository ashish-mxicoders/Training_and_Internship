// 💡 EXPLANATION (Static Generation - SSG):
// Next.js me by default pages Static hote hain.
// `export const dynamic = "force-static"` se hum Next.js ko force karte hain
// ki ye page BUILD TIME par render ho aur HTML cache ho jaye.
// Reload karne par bhi ye time CHANGE NAHI HOGA (production build me)!

import Link from "next/link";

export const dynamic = "force-static";

export default function StaticRenderingPage() {
  const buildTime = new Date().toISOString();

  return (
    <div className="space-y-6">
      <Link
        href="/rendering"
        className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-medium inline-flex items-center gap-1"
      >
        ← Back to Rendering Overview
      </Link>

      <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-6 dark:border-teal-900/60 dark:bg-teal-950/20">
        <span className="rounded bg-teal-200 px-2 py-0.5 text-xs font-mono font-bold text-teal-900 dark:bg-teal-900 dark:text-teal-200">
          Static Generation (SSG)
        </span>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
          Build-Time Static Pre-Rendering
        </h1>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Route Configuration: <code>export const dynamic = &quot;force-static&quot;;</code>
        </p>

        <div className="mt-4 rounded-lg bg-white p-4 border border-teal-100 dark:bg-slate-900 dark:border-slate-800 text-xs font-mono">
          <p className="text-slate-500">// Generated Timestamp (Pre-rendered):</p>
          <p className="text-teal-700 dark:text-teal-300 font-bold mt-1 text-sm">
            {buildTime}
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            * In production (`npm run build &amp;&amp; npm start`), page reload karne par bhi ye timestamp freeze rehta hai!
          </p>
        </div>
      </div>
    </div>
  );
}
