// 💡 EXPLANATION (Nested Sub-Route Page):
// Ye page /routing/nested/settings URL par load hota hai.
// Dekhiye kaise parent layout same rehta hai, re-render nahi hota!

export default function NestedSettingsPage() {
  return (
    <div className="rounded-xl bg-white p-5 border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        ⚙️ Nested Sub-route: <code>/routing/nested/settings</code>
      </h3>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        Notice karein ki upar ka Dashboard Shell Layout reload nahi hua!
        Sirf ye inner child component update hua hai. Next.js App router nested routing ko isi tarah efficiently optimize karta hai.
      </p>

      <div className="mt-4 space-y-2 text-xs">
        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <input type="checkbox" defaultChecked className="rounded text-amber-600" />
          <span>Enable instant route pre-fetching</span>
        </label>
        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <input type="checkbox" defaultChecked className="rounded text-amber-600" />
          <span>Keep nested layout cache alive</span>
        </label>
      </div>
    </div>
  );
}
