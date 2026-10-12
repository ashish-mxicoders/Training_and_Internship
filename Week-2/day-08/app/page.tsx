import ConceptCard from "@/components/ConceptCard";

export default function Home() {
  const concepts = [
    {
      number: "01",
      title: "Server vs. Client Components Deep-Dive",
      badge: "Architecture & Hydration",
      description:
        "Understand the boundary between Server & Client components, passing Server Components as children props, and hydration behavior.",
      route: "/server-vs-client",
      features: [
        "Server Components by default (0kB client JS bundle)",
        '"use client" directive for interactivity & hooks',
        "Passing Server Components as children to avoid re-bundling",
        "Understanding Hydration and client-side lifecycle",
      ],
    },
    {
      number: "02",
      title: "Dynamic & Nested Routing",
      badge: "App Router Navigation",
      description:
        "Practical implementation of dynamic routes ([id]), catch-all routes ([...slug]), optional catch-all routes ([[...slug]]), and nested layouts.",
      route: "/routing",
      features: [
        "Single Dynamic Segment: /blog/[id]",
        "Catch-All Dynamic Segment: /docs/[...slug]",
        "Optional Catch-All Segment: /shop/[[...slug]]",
        "Nested Layouts & Sub-routes (/routing/nested/settings)",
      ],
    },
    {
      number: "03",
      title: "Handling SearchParams & Query Strings",
      badge: "URL State Management",
      description:
        "Comparison between reading query params in Server Components via searchParams prop vs Client Components via useSearchParams() & useRouter().",
      route: "/search-params",
      features: [
        "Server Component: async searchParams prop (Next.js 15/16)",
        "Client Component: useSearchParams() + useRouter() hooks",
        "Modifying query strings without reloading the page",
        "Suspense boundary wrapping for client search params",
      ],
    },
    {
      number: "04",
      title: "Data Fetching Strategies",
      badge: "Server vs. Client Fetch",
      description:
        "Explore fetching data directly inside async Server Components vs fetching with useEffect/useState in Client Components.",
      route: "/data-fetching",
      features: [
        "Server-side async/await fetch (Fast initial HTML, No client JS)",
        "Client-side useEffect + useState (Interactive updates, Loading/Error)",
        "Revalidation strategies (next: { revalidate })",
        "Comparison of bundle size, SEO, and performance",
      ],
    },
    {
      number: "05",
      title: "Rendering Modes (Static vs. Dynamic)",
      badge: "SSG vs. SSR",
      description:
        "Core difference between Static Generation (build-time caching) and Dynamic Rendering (request-time rendering) with route segment configs.",
      route: "/rendering",
      features: [
        "Static Generation: Build-time pre-rendered HTML",
        "Dynamic Rendering: On-demand request-time generation",
        "Route Segment Config: export const dynamic = 'force-dynamic'",
        "Live timestamp comparison to observe caching in action",
      ],
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <section className="rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-8 shadow-xs dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300 mb-4">
          <span>🚀 Week-2 Day-08 Learning Tracker</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Next.js App Router Core Fundamentals
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
          Ye project Next.js ke 5 sabse zaroori concepts ko bilkul <strong>simple, basic aur clean structure</strong> me
          demonstrate karta hai. Har route me clear explanations, Hindi/English comments aur live interactive components diye gaye hain.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-xs">
          <span className="rounded-md bg-slate-200/80 px-2.5 py-1 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Next.js App Router (v16)
          </span>
          <span className="rounded-md bg-slate-200/80 px-2.5 py-1 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Tailwind CSS
          </span>
          <span className="rounded-md bg-slate-200/80 px-2.5 py-1 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            TypeScript
          </span>
          <span className="rounded-md bg-slate-200/80 px-2.5 py-1 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            React 19
          </span>
        </div>
      </section>

      {/* Concept Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Core Learning Modules
          </h2>
          <span className="text-xs text-slate-500">5 Essential Next.js Topics</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {concepts.map((c) => (
            <ConceptCard key={c.number} {...c} />
          ))}
        </div>
      </section>
    </div>
  );
}
