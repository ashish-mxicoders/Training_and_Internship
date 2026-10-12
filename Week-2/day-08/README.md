# 🚀 Week-2 Day-08: Next.js App Router Core Concepts & Architecture

Ye project specifically **Next.js App Router ke 5 sabse zaroori core concepts** ko bilkul **simple, clean aur practical tarike** se sikhne ke liye banaya gaya hai:

1. **Server vs. Client Components Deep-Dive** (Component Boundary, Hydration Process, Composition Pattern passing Server Component as `{children}`).
2. **Dynamic & Nested Routing** (Single `[id]`, Catch-All `[...slug]`, Optional Catch-All `[[...slug]]`, Persistent Nested Layouts).
3. **Handling SearchParams & Query Strings** (Server `searchParams` prop vs Client `useSearchParams()`, `usePathname()`, `useRouter()` hooks).
4. **Data Fetching Strategies** (Server Component direct async/await fetch with 0kB client JS bundle vs Client-side `useEffect` + `useState` using `https://api.genderize.io?name=peter`).
5. **Rendering Modes (Static vs. Dynamic)** (Static Generation SSG vs On-Demand Dynamic Rendering SSR, Route Segment Configs).

---

## 📁 Project Architecture & File Structure

```text
Week-2/day-08/
├── app/
│   ├── globals.css                       # Tailwind CSS imports & global styles
│   ├── layout.tsx                        # Root Layout with sticky Navbar & Footer
│   ├── page.tsx                          # Dashboard Overview of all 5 concepts
│   │
│   ├── server-vs-client/                 # [Concept 1] Server vs Client Deep-Dive
│   │   └── page.tsx                      # Server Component, boundaries & hydration notes
│   │
│   ├── routing/                          # [Concept 2] Dynamic & Nested Routing
│   │   ├── page.tsx                      # Routing hub with interactive links
│   │   ├── blog/
│   │   │   └── [id]/
│   │   │       └── page.tsx              # Dynamic Route: [id] (Single segment)
│   │   ├── docs/
│   │   │   └── [...slug]/
│   │   │       └── page.tsx              # Catch-All Route: [...slug] (Array of segments)
│   │   ├── shop/
│   │   │   └── [[...slug]]/
│   │   │       └── page.tsx              # Optional Catch-All: [[...slug]] (Can be empty)
│   │   └── nested/
│   │       ├── layout.tsx                # Persistent Shell Layout (doesn't re-render)
│   │       ├── page.tsx                  # /routing/nested (Index page)
│   │       └── settings/
│   │           └── page.tsx              # /routing/nested/settings (Sub-route)
│   │
│   ├── search-params/                    # [Concept 3] SearchParams & Query Strings
│   │   └── page.tsx                      # Server searchParams prop + Client hooks demo
│   │
│   ├── data-fetching/                    # [Concept 4] Data Fetching Strategies
│   │   └── page.tsx                      # Server Fetch vs Client Fetch (Genderize API)
│   │
│   └── rendering/                        # [Concept 5] Rendering Modes
│       ├── page.tsx                      # SSG vs SSR comparison
│       ├── static/
│       │   └── page.tsx                  # Static Generation (force-static / build-time)
│       └── dynamic/
│           └── page.tsx                  # Dynamic Rendering (force-dynamic / request-time)
│
├── components/
│   ├── Navbar.tsx                        # Top navigation bar
│   ├── ConceptCard.tsx                   # Reusable UI card for home dashboard
│   ├── ClientCounter.tsx                 # Client Component using useState & onClick
│   ├── ClientWrapper.tsx                 # Composition Pattern: Server Component as children
│   ├── ClientSearchFilter.tsx            # Client query params with useSearchParams()
│   ├── ServerDataDemo.tsx                # Server fetch using api.genderize.io
│   └── ClientDataDemo.tsx                # Client fetch using api.genderize.io with live input box
│
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## 🧠 Concepts Breakdown

### 1. Server vs. Client Components & Hydration
* **Server Components (Default):**
  * App router me har component by default Server Component hota hai.
  * Inka JavaScript client browser ko **kabhi nahi bheja jaata** (Zero Client JS bundle).
  * Direct Database queries, file system read, aur secret API keys access kar sakte hain.
  * ❌ `useState`, `useEffect`, ya event handlers (`onClick`, `onChange`) use nahi kar sakte.
* **Client Components (`"use client"`):**
  * File ke top par `"use client"` likhna padta hai.
  * Browser me download hote hain aur interactive hote hain (`useState`, `onClick`, `useSearchParams`).
* **Composition Pattern (Passing Server Components as Children):**
  ```tsx
  // ✅ Server Component child ko Client Component me as children pass karein:
  <ClientWrapper>
    <ServerChildComponent />
  </ClientWrapper>
  ```
  Is pattern se `ServerChildComponent` server par hi render hota hai aur uska code client bundle me nahi jaata.
* **Hydration Process:**
  Server pehle fast initial static HTML bhejta hai. Fir browser me React ka JavaScript download hoke us HTML ke sath event listeners attach karta hai (Hydration).

---

### 2. Dynamic & Nested Routing

| Route Type | Folder Syntax | Example URL | Received Params |
|---|---|---|---|
| **Dynamic Route** | `[id]` | `/routing/blog/101` | `{ id: "101" }` |
| **Catch-All Route** | `[...slug]` | `/routing/docs/a/b/c` | `{ slug: ["a", "b", "c"] }` |
| **Optional Catch-All** | `[[...slug]]` | `/routing/shop` OR `/routing/shop/a/b` | `{ slug: undefined }` OR `{ slug: ["a", "b"] }` |

* **Nested Layouts (`app/routing/nested/layout.tsx`):**
  Nested sub-routes (e.g. `/routing/nested` aur `/routing/nested/settings`) navigate karte waqt parent layout destroy ya re-render nahi hota (state persist rehti hai).

---

### 3. Handling SearchParams & Query Strings
* **Server Component Approach:**
  Page component ko direct `searchParams` prop milta hai (Next.js 15+ me Promise based):
  ```tsx
  export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    return <div>Search: {q}</div>;
  }
  ```
* **Client Component Approach:**
  Interactive search input ya filters ke liye `useSearchParams()`, `usePathname()`, aur `useRouter()` use karte hain:
  ```tsx
  "use client";
  import { useSearchParams, useRouter, usePathname } from "next/navigation";

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("q", term);
    router.push(`${pathname}?${params.toString()}`);
  };
  ```

---

### 4. Data Fetching Strategies & Genderize.io Third-Party API

Is project me **`https://api.genderize.io?name=peter`** API ka practical use kiya gaya hai:

1. **Server-Side Data Fetching (`ServerDataDemo.tsx`):**
   * Direct async/await inside component:
     ```tsx
     export default async function ServerDataDemo() {
       const res = await fetch("https://api.genderize.io?name=peter", { next: { revalidate: 60 } });
       const data = await res.json();
       return <div>Name: {data.name} | Gender: {data.gender}</div>;
     }
     ```
   * Fast load, zero client JavaScript bundle.
2. **Client-Side Data Fetching with Live Input Box (`ClientDataDemo.tsx`):**
   * Input box me user koi bhi name enter karta hai (e.g. `peter`, `ashish`, `emma`).
   * `useEffect` debounced trigger ke sath API call karta hai aur instant result box me **Name, Predicted Gender (♂ Male / ♀ Female), Probability %, aur Sample Count** show karta hai.
   * `loading`, `error`, aur `data` state handling included.

---

### 5. Rendering Modes: Static vs. Dynamic

* **Static Generation (SSG):**
  * Route Segment Config: `export const dynamic = "force-static"`
  * Page build time par pre-render ho jata hai. Fast speed and CDN caching.
* **Dynamic Rendering (SSR):**
  * Route Segment Config: `export const dynamic = "force-dynamic"`
  * Har single incoming request par server par live generation hoti hai. Live timestamps or user cookies ke liye best.

---

## 🛠️ How to Run the Project

```bash
# Navigate to day-08 folder
cd Week-2/day-08

# Start development server
npm run dev
```

Browser me open karein: [http://localhost:3000](http://localhost:3000)

Production Build check karne ke liye:
```bash
npm run build
npm start
```

---

*Repository:* [ashish-mxicoders/Training_and_Internship](https://github.com/ashish-mxicoders/Training_and_Internship)
