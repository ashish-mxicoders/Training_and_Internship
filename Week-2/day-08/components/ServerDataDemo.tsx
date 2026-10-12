// 💡 EXPLANATION (Server Component Data Fetching):
// Yahan hum wahi Third-Party API (https://api.genderize.io?name=peter)
// seedha Server Component ke andar `await fetch(...)` se call kar rahe hain.
//
// FAAYDE (Benefits):
// 1. Zero Client JavaScript: Browser me koi fetch code ya useEffect download nahi hota.
// 2. Direct Node.js Server par fetch hoke complete HTML client ko bheja jata hai.

interface GenderizeResponse {
  count: number;
  name: string;
  gender: string | null;
  probability: number;
}

export default async function ServerDataDemo() {
  let data: GenderizeResponse | null = null;
  let fetchTime = "";

  try {
    const res = await fetch("https://api.genderize.io?name=peter", {
      next: { revalidate: 60 }, // Cache on server for 60 seconds
    });

    if (res.ok) {
      data = await res.json();
      fetchTime = new Date().toLocaleTimeString();
    }
  } catch (err) {
    console.error("Server fetch error:", err);
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-950/60 dark:bg-emerald-950/20">
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-900/40">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          Server Fetch: Genderize.io (name=peter)
        </span>
        <span className="rounded bg-emerald-200/70 px-2 py-0.5 text-[11px] font-mono text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200">
          Zero Client Bundle
        </span>
      </div>

      <div className="mt-3 space-y-3">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Ye data seedha <strong>Node.js Server</strong> par direct <code>await fetch(&quot;https://api.genderize.io?name=peter&quot;)</code> se fetch hua hai.
        </p>

        {data ? (
          <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
              <span className="text-xs font-mono font-semibold text-slate-500">
                Server-Rendered Box
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                Fetched at: {fetchTime}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800">
                <span className="text-[11px] text-slate-500">Name:</span>
                <p className="text-sm font-bold capitalize text-slate-900 dark:text-white">
                  {data.name}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800">
                <span className="text-[11px] text-slate-500">Gender:</span>
                <p className="text-sm font-bold capitalize text-emerald-700 dark:text-emerald-400">
                  {data.gender === "male" ? "♂ Male" : "♀ Female"}
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
        ) : (
          <div className="text-xs text-rose-500">Failed to fetch data on server.</div>
        )}
      </div>
    </div>
  );
}
