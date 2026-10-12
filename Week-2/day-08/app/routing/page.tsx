// 💡 TOPIC 2: Dynamic & Nested Routing Overview
import Link from "next/link";

export default function RoutingOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 mb-2">
          Concept 02
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Dynamic & Nested Routing in App Router
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Understand single dynamic routes, catch-all routes, optional catch-all routes, and nested layouts.
        </p>
      </div>

      {/* Grid of Routing Types */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 1. Dynamic Route [id] */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 dark:text-white">
              1. Dynamic Route: <code>[id]</code>
            </h3>
            <span className="rounded bg-sky-100 px-2 py-0.5 text-xs font-mono text-sky-800 dark:bg-sky-950 dark:text-sky-300">
              Single Segment
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
            Folder name me square brackets <code>[id]</code> use karke dynamic parameter banate hain.
            Folder path: <code>app/routing/blog/[id]/page.tsx</code>.
          </p>
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500">Live Links:</span>
            <Link
              href="/routing/blog/101"
              className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-mono"
            >
              → /routing/blog/101 (ID: 101)
            </Link>
            <Link
              href="/routing/blog/nextjs-routing-guide"
              className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-mono"
            >
              → /routing/blog/nextjs-routing-guide (Slug ID)
            </Link>
          </div>
        </div>

        {/* 2. Catch-All Route [...slug] */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 dark:text-white">
              2. Catch-All Route: <code>[...slug]</code>
            </h3>
            <span className="rounded bg-violet-100 px-2 py-0.5 text-xs font-mono text-violet-800 dark:bg-violet-950 dark:text-violet-300">
              Multiple Segments
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
            Folder name me 3 dots <code>[...slug]</code> lagane se ye multiple URL segments ko ek array me catch kar leta hai.
            Folder path: <code>app/routing/docs/[...slug]/page.tsx</code>.
          </p>
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500">Live Links:</span>
            <Link
              href="/routing/docs/introduction"
              className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-mono"
            >
              → /routing/docs/introduction (1 segment)
            </Link>
            <Link
              href="/routing/docs/tutorials/nextjs/routing"
              className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-mono"
            >
              → /routing/docs/tutorials/nextjs/routing (3 segments)
            </Link>
          </div>
        </div>

        {/* 3. Optional Catch-All Route [[...slug]] */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 dark:text-white">
              3. Optional Catch-All: <code>[[...slug]]</code>
            </h3>
            <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-mono text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              Optional Array
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
            Double square brackets <code>[[...slug]]</code> se slug optional ho jata hai! Matlab <code>/shop</code> bhi match hoga
            aur <code>/shop/phones/iphone</code> bhi match hoga.
          </p>
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500">Live Links:</span>
            <Link
              href="/routing/shop"
              className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-mono"
            >
              → /routing/shop (No slug passed, matches base!)
            </Link>
            <Link
              href="/routing/shop/electronics/laptops/apple"
              className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-mono"
            >
              → /routing/shop/electronics/laptops/apple
            </Link>
          </div>
        </div>

        {/* 4. Nested Routing & Nested Layouts */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 dark:text-white">
              4. Nested Routing & Layouts
            </h3>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-mono text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Parent-Child
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
            Next.js App router me har subfolder ka apna <code>layout.tsx</code> ho sakta hai jo child pages ke sath persist karta hai
            aur re-render nahi hota!
          </p>
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500">Live Links:</span>
            <Link
              href="/routing/nested"
              className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-mono"
            >
              → /routing/nested (Parent Dashboard)
            </Link>
            <Link
              href="/routing/nested/settings"
              className="text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-mono"
            >
              → /routing/nested/settings (Sub-route sharing layout)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
