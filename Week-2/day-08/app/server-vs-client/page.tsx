// 💡 TOPIC 1: Server vs. Client Components Deep-Dive
// App Router me sabhi components BY DEFAULT Server Components hote hain.
// Server Component ka code sirf server par chalta hai, iska JavaScript client browser ko nahi bheja jaata.

import ClientCounter from "@/components/ClientCounter";
import ClientWrapper from "@/components/ClientWrapper";

// Ye ek Server Component hai jo hum ClientWrapper ke andar as {children} pass karenge:
function ServerChildContent() {
  const serverRenderTime = new Date().toLocaleTimeString();

  return (
    <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
      <div className="font-bold flex items-center gap-1.5 mb-1">
        <span>⚡ Server Component (Rendered on Server)</span>
      </div>
      <p>
        Ye content Server par render hua tha at: <strong>{serverRenderTime}</strong>.
      </p>
      <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
        Halanki ye ClientWrapper ke andar hai, par ye as a <code>children</code> prop pass hua hai,
        isliye iska JavaScript browser bundle me include <strong>NAHI</strong> hua!
      </p>
    </div>
  );
}

export default function ServerVsClientPage() {
  const serverTime = new Date().toLocaleTimeString();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 mb-2">
          Concept 01
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Server vs. Client Components Deep-Dive
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Understanding Component Boundaries, Composition Pattern, and Hydration behavior.
        </p>
      </div>

      {/* Grid: Server vs Client Comparison */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left: Server Component */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white">
              1. Server Component (Default)
            </h3>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Zero JS Bundle
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Next.js App router me agar aapne file ke top par <code>&quot;use client&quot;</code> nahi likha hai,
            to wo automatically <strong>Server Component</strong> hai.
          </p>

          <div className="mt-4 rounded-lg bg-slate-100 p-3 text-xs font-mono text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <p><strong>Environment:</strong> Server Node.js</p>
            <p><strong>Render Time:</strong> {serverTime}</p>
            <p><strong>Can use useState?</strong> ❌ No</p>
            <p><strong>Can use onClick?</strong> ❌ No</p>
            <p><strong>Can access DB/Secrets?</strong> ✅ Yes directly</p>
          </div>
        </div>

        {/* Right: Client Component */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 dark:text-white">
              2. Client Component (&quot;use client&quot;)
            </h3>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Interactive
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            File ke top par <code>&quot;use client&quot;</code> likhne par Next.js component ko client-side
            JavaScript bundle me include karta hai taaki browser me interactivity kaam kare.
          </p>

          {/* Live Client Component Demo */}
          <ClientCounter />
        </div>
      </div>

      {/* Composition Pattern Demo */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          3. Composition Pattern: Passing Server Components as Children
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          <strong>Problem:</strong> Agar aap kisi Server Component ko directly Client Component ke andar <code>import</code> karenge,
          toh Next.js us imported component ko bhi Client Component bana dega.<br />
          <strong>Solution:</strong> Server Component ko parent (Server Page) me render karein aur Client Component ko
          as <code>{'{children}'}</code> pass karein!
        </p>

        {/* Passing Server Component as Children */}
        <ClientWrapper>
          <ServerChildContent />
        </ClientWrapper>
      </div>

      {/* Hydration Deep Dive Explanation */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/60 dark:bg-blue-950/20">
        <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
          🧠 Hydration Kya Hota Hai? (Hydration Explained in Simple Terms)
        </h4>
        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            1. <strong>Server Pre-rendering:</strong> Server pehle static HTML generate karke browser ko bhejta hai taaki user ko turant page dikh jaye.
          </p>
          <p>
            2. <strong>Client Hydration:</strong> Browser me jab React ka JavaScript code download aur execute hota hai, to wo exist karte huye HTML ke sath
            event listeners (onClick, onChange) aur state connect karta hai. Is process ko <strong>Hydration</strong> kehte hain.
          </p>
          <p>
            3. <strong>Hydration Mismatch Warning:</strong> Agar server par generate hui HTML aur client browser par first render hone wali HTML me difference ho
            (jaise <code>localStorage</code> ya <code>window.innerWidth</code> direct render karna), toh Hydration Error aata hai.
          </p>
        </div>
      </div>
    </div>
  );
}
