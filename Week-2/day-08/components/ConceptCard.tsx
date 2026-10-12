import Link from "next/link";

interface ConceptCardProps {
  number: string;
  title: string;
  badge: string;
  description: string;
  route: string;
  features: string[];
}

export default function ConceptCard({
  number,
  title,
  badge,
  description,
  route,
  features,
}: ConceptCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 font-mono text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            {number}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {badge}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {description}
        </p>

        <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
          {features.map((feat, i) => (
            <li key={i} className="flex items-center text-xs text-slate-600 dark:text-slate-400">
              <span className="mr-2 text-indigo-500 font-bold">✓</span>
              {feat}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <Link
          href={route}
          className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 focus:outline-none"
        >
          Explore Live Demo & Code →
        </Link>
      </div>
    </div>
  );
}
