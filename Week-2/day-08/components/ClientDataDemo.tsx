"use client";

// 💡 EXPLANATION (Client-side Data Fetching with Genderize API):
// Yahan hum third-party API: https://api.genderize.io?name={name} use kar rahe hain.
// User input me koi bhi name likhega (e.g. peter, john, priya),
// toh `useEffect` automatically API call karega aur data ko ek interactive box me display karega!

import { useState, useEffect } from "react";

interface GenderizeResponse {
  count: number;
  name: string;
  gender: string | null;
  probability: number;
}

export default function ClientDataDemo() {
  const [name, setName] = useState<string>("peter");
  const [data, setData] = useState<GenderizeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Agar input khali ho toh fetch mat karo
    const trimmedName = name.trim();
    if (!trimmedName) {
      setData(null);
      return;
    }

    // Debounce timer: user ke type karte waqt continuous spam calls na ho
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`https://api.genderize.io?name=${encodeURIComponent(trimmedName)}`);
        
        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }

        const result: GenderizeResponse = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [name]);

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-5 dark:border-violet-950/60 dark:bg-violet-950/20">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-violet-100 dark:border-violet-900/40">
        <span className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-400">
          Client Fetch: Genderize.io API
        </span>
        <span className="rounded bg-violet-200/70 px-2 py-0.5 text-[11px] font-mono text-violet-900 dark:bg-violet-900/50 dark:text-violet-200">
          Live Input Hook
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {/* Input Box */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Enter Name to Predict Gender:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type any name (e.g. peter, emma, rahul)..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 shadow-xs focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            * Jaise hi aap name enter karenge, automatic <code>useEffect</code> fetch chalega.
          </p>
        </div>

        {/* Quick suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-slate-500">Quick Try:</span>
          {["peter", "emma", "ashish", "maria", "alex"].map((sample) => (
            <button
              key={sample}
              onClick={() => setName(sample)}
              className="rounded bg-white px-2 py-0.5 border border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-lg bg-white p-4 text-center text-xs text-violet-600 animate-pulse border border-violet-100 dark:bg-slate-900 dark:border-slate-800">
            ⏳ Fetching prediction for &quot;{name}&quot; from api.genderize.io...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-600 border border-rose-200">
            ❌ Error: {error}
          </div>
        )}

        {/* Result Data Box */}
        {!loading && !error && data && (
          <div className="rounded-xl border border-violet-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-mono font-semibold text-slate-500">
                API Prediction Result Box
              </span>
              <span className="text-[11px] font-mono text-violet-600 dark:text-violet-400">
                api.genderize.io
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800">
                <span className="text-[11px] text-slate-500">Target Name:</span>
                <p className="text-sm font-bold capitalize text-slate-900 dark:text-white">
                  {data.name || name}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800">
                <span className="text-[11px] text-slate-500">Predicted Gender:</span>
                <p className="text-sm font-bold capitalize text-violet-700 dark:text-violet-400">
                  {data.gender ? (
                    <>
                      {data.gender === "male" ? "♂ Male" : "♀ Female"}
                    </>
                  ) : (
                    "Unknown"
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800">
                <span className="text-[11px] text-slate-500">Probability:</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {(data.probability * 100).toFixed(0)}%
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800">
                <span className="text-[11px] text-slate-500">Sample Count:</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {data.count.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
