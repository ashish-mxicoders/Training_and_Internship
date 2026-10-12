import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Next.js Core Concepts - Week 2 Day 08",
  description: "Server vs Client Components, Dynamic Routing, SearchParams, Data Fetching & Rendering Modes in Next.js App Router.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <p>
            Week-2 Day-08 Next.js Core Concepts Practice | Ashish Training & Internship
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Repository: <a href="https://github.com/ashish-mxicoders/Training_and_Internship" className="underline hover:text-indigo-600">ashish-mxicoders/Training_and_Internship</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
