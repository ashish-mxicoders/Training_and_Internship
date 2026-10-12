// 💡 EXPLANATION (Nested Route Page):
// Ye page /routing/nested URL par load hota hai aur parent `layout.tsx` ke andar render hota hai.

export default function NestedIndexPage() {
  return (
    <div className="rounded-xl bg-white p-5 border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        📊 Nested Route Index: <code>/routing/nested</code>
      </h3>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        Ye index page hai jo parent layout ke slot me render hua hai. Agar aap upar &quot;Settings&quot; button
        par click karenge, toh layout persist rahega aur sirf ye inner component change hoga!
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Active Metric:</span>
          <p className="text-slate-500 mt-1">Status: Active (200 OK)</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Navigation:</span>
          <p className="text-slate-500 mt-1">Preserved Shell Layout</p>
        </div>
      </div>
    </div>
  );
}
