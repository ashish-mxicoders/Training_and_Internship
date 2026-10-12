// 💡 TOPIC 4: Data Fetching Strategies
// Next.js App Router me data fetch karne ke 2 main strategies hain:
// 1. Direct async/await inside Server Components (Zero client JavaScript).
// 2. Client-side fetching using useEffect + useState (Browser fetch with state management).

import ServerDataDemo from "@/components/ServerDataDemo";
import ClientDataDemo from "@/components/ClientDataDemo";

export default function DataFetchingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 mb-2">
          Concept 04
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Data Fetching Strategies in Next.js
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Server-side async fetch (Zero Client JS) vs. Client-side useEffect fetch (States & Reactivity).
        </p>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Server Fetch */}
        <div className="space-y-3">
          <ServerDataDemo />
          <div className="rounded-lg bg-slate-100 p-4 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            <h5 className="font-bold text-slate-900 dark:text-white mb-1">
              ✅ Server Fetch Ke Fayde:
            </h5>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>API secrets & tokens safe rehte hain (browser me leak nahi hote).</li>
              <li>Browser ko koi fetch JavaScript download nahi karni padti.</li>
              <li>Search Engines (SEO) ko data se bhara hua HTML milta hai.</li>
            </ul>
          </div>
        </div>

        {/* Client Fetch */}
        <div className="space-y-3">
          <ClientDataDemo />
          <div className="rounded-lg bg-slate-100 p-4 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            <h5 className="font-bold text-slate-900 dark:text-white mb-1">
              ✅ Client Fetch Kab Use Karein:
            </h5>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>User ke click ya input change par dynamic reload karna ho.</li>
              <li>Polling ya real-time updates (setInterval / WebSocket).</li>
              <li>Private user dashboards jahan initial SEO zaroori na ho.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
