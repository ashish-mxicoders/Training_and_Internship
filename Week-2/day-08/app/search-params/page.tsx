// 💡 TOPIC 3: Handling SearchParams & Query Strings
// Next.js App Router me Query Strings handle karne ke 2 alag tareeqe hote hain:
// 1. SERVER COMPONENT: Page component ko directly `searchParams` prop milta hai (Promise in Next.js 15+).
// 2. CLIENT COMPONENT: `useSearchParams()`, `usePathname()`, aur `useRouter()` hooks use kiye jaate hain.

import ClientSearchFilter from "@/components/ClientSearchFilter";

interface SearchParamsProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function SearchParamsPage({ searchParams }: SearchParamsProps) {
  // Next.js 15+ me searchParams ek Promise hota hai:
  const params = await searchParams;

  const searchQuery = params.q || "";
  const category = params.category || "all";
  const sort = params.sort || "latest";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 mb-2">
          Concept 03
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Handling SearchParams & Query Strings
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Server Component <code>searchParams</code> prop vs. Client Component <code>useSearchParams()</code> hook.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Client Component with interactive input */}
        <div>
          <ClientSearchFilter />
        </div>

        {/* Right: Server Component displaying received query params */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200 dark:border-emerald-900/40">
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
              Server Component: Page Prop (searchParams)
            </h4>
            <span className="rounded bg-emerald-200/70 px-2 py-0.5 text-[11px] font-mono text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200">
              Server-Side Read
            </span>
          </div>

          <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Ye right side ka component ek <strong>Server Component</strong> hai. Jaise hi aap left side me filters click
            karte hain, URL update hota hai aur Next.js Server par ye component naye <code>searchParams</code> ke sath
            re-render hoke response bhejta hai.
          </p>

          <div className="mt-4 rounded-lg bg-white p-4 border border-emerald-100 dark:bg-slate-900 dark:border-slate-800 text-xs font-mono space-y-2">
            <p className="text-slate-500">// Received on Server via await searchParams:</p>
            <div className="space-y-1 text-emerald-800 dark:text-emerald-300">
              <p>
                <strong>searchParams.q:</strong> {searchQuery ? `"${searchQuery}"` : "(empty)"}
              </p>
              <p>
                <strong>searchParams.category:</strong> &quot;{category}&quot;
              </p>
              <p>
                <strong>searchParams.sort:</strong> &quot;{sort}&quot;
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-emerald-100/60 p-3 text-xs text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300">
            <p className="font-semibold mb-1">💡 Key Takeaway:</p>
            <p>
              • <strong>Server:</strong> Use <code>searchParams</code> prop in <code>page.tsx</code> for data filtering on server or SEO.
              <br />
              • <strong>Client:</strong> Use <code>useSearchParams()</code> hook in interactive components to read URL without page refresh.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
