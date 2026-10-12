// 💡 EXPLANATION (Optional Catch-All Route [[...slug]]):
// Double square brackets `[[...slug]]` use karne se parameter OPTIONAL ban jata hai!
// - Catch-All ([...slug]) me `/docs` 404 dega agar slug na ho.
// - LEKIN Optional Catch-All ([[...slug]]) me `/shop` bhi chalega (slug = undefined)
//   aur `/shop/clothes/men` bhi chalega (slug = ['clothes', 'men']).

import Link from "next/link";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function ShopOptionalCatchAllPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      <Link
        href="/routing"
        className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-medium inline-flex items-center gap-1"
      >
        ← Back to Routing Overview
      </Link>

      <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-6 dark:border-teal-900/60 dark:bg-teal-950/20">
        <span className="rounded bg-teal-200 px-2 py-0.5 text-xs font-mono font-bold text-teal-900 dark:bg-teal-900 dark:text-teal-200">
          Optional Catch-All: [[...slug]]
        </span>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
          {slug && slug.length > 0 ? (
            <>
              Shop Category: <span className="font-mono text-teal-600 dark:text-teal-400">/{slug.join("/")}</span>
            </>
          ) : (
            <span className="text-teal-700 dark:text-teal-300">
              Shop Home (No sub-slug passed!)
            </span>
          )}
        </h1>

        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          File Location: <code>app/routing/shop/[[...slug]]/page.tsx</code>
        </p>

        {/* Display Array or Undefined */}
        <div className="mt-4 rounded-lg bg-white p-4 border border-teal-100 dark:bg-slate-900 dark:border-slate-800 text-xs font-mono">
          <p className="text-slate-500">// Slug value received:</p>
          <p className="text-teal-700 dark:text-teal-300 font-bold mt-1">
            slug = {slug ? JSON.stringify(slug) : "undefined (Matched base root route directly!)"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Test with and without route segments:
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/routing/shop"
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          >
            Base Root Route: /routing/shop
          </Link>
          <Link
            href="/routing/shop/electronics"
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          >
            1 Segment: /shop/electronics
          </Link>
          <Link
            href="/routing/shop/electronics/laptops/apple"
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
          >
            3 Segments: /shop/electronics/laptops/apple
          </Link>
        </div>
      </div>
    </div>
  );
}
