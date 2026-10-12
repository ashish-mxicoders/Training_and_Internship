// 💡 EXPLANATION (Dynamic Route [id]):
// Next.js App Router me folder ka naam `[id]` rakhne se ye single dynamic parameter ban jata hai.
// Next.js 15+ me `params` ek Promise hota hai, isliye hum `await params` karte hain.

import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <Link
        href="/routing"
        className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-medium inline-flex items-center gap-1"
      >
        ← Back to Routing Overview
      </Link>

      <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-6 dark:border-sky-900/60 dark:bg-sky-950/20">
        <span className="rounded bg-sky-200 px-2 py-0.5 text-xs font-mono font-bold text-sky-900 dark:bg-sky-900 dark:text-sky-200">
          Dynamic Segment: [id]
        </span>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
          Blog Post ID: <span className="text-sky-600 dark:text-sky-400 font-mono">{id}</span>
        </h1>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          File Location: <code>app/routing/blog/[id]/page.tsx</code>
        </p>

        <div className="mt-4 rounded-lg bg-white p-4 border border-sky-100 dark:bg-slate-900 dark:border-slate-800 text-xs font-mono">
          <p className="text-slate-500">// Extracted from await params:</p>
          <p className="text-sky-700 dark:text-sky-300 font-bold mt-1">
            params.id = &quot;{id}&quot;
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/routing/blog/101"
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
        >
          Try ID: 101
        </Link>
        <Link
          href="/routing/blog/react-server-components"
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
        >
          Try ID: react-server-components
        </Link>
        <Link
          href="/routing/blog/999"
          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
        >
          Try ID: 999
        </Link>
      </div>
    </div>
  );
}
