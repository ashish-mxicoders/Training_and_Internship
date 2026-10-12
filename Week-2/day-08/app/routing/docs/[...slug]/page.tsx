// 💡 EXPLANATION (Catch-All Route [...slug]):
// Next.js App Router me folder ka naam `[...slug]` (with 3 dots) rakhne se ye
// ek se jyada dynamic URL path segments ko catch karke ek ARRAY me convert kar deta hai.
// Example: `/docs/frameworks/react/getting-started`
// => params.slug = ['frameworks', 'react', 'getting-started']

import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DocsCatchAllPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      <Link
        href="/routing"
        className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-medium inline-flex items-center gap-1"
      >
        ← Back to Routing Overview
      </Link>

      <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-6 dark:border-violet-900/60 dark:bg-violet-950/20">
        <span className="rounded bg-violet-200 px-2 py-0.5 text-xs font-mono font-bold text-violet-900 dark:bg-violet-900 dark:text-violet-200">
          Catch-All Route: [...slug]
        </span>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
          Docs Hierarchy: <span className="font-mono text-violet-600 dark:text-violet-400">/{slug.join("/")}</span>
        </h1>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          File Location: <code>app/routing/docs/[...slug]/page.tsx</code>
        </p>

        {/* Display Array structure */}
        <div className="mt-4 rounded-lg bg-white p-4 border border-violet-100 dark:bg-slate-900 dark:border-slate-800 text-xs font-mono">
          <p className="text-slate-500">// Catch-All returned Array:</p>
          <pre className="text-violet-700 dark:text-violet-300 font-bold mt-1">
            {JSON.stringify(slug, null, 2)}
          </pre>
          <p className="mt-2 text-[11px] text-slate-500">
            Total Path Segments: {slug.length}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Try different path depths:
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/routing/docs/introduction"
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          >
            1 Segment (/docs/introduction)
          </Link>
          <Link
            href="/routing/docs/features/server-actions"
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          >
            2 Segments (/docs/features/server-actions)
          </Link>
          <Link
            href="/routing/docs/advanced/routing/parallel-routes/modal"
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          >
            4 Segments (/docs/advanced/routing/...)
          </Link>
        </div>
      </div>
    </div>
  );
}
