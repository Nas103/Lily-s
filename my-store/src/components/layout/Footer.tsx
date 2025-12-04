const columns = [
  {
    title: "Shoes",
    items: ["White Run", "Luna Racer", "P-6000", "Nova Trail"],
  },
  {
    title: "Clothing",
    items: ["Tech Fleece", "Studio Set", "Airy Layers", "City Tailor"],
  },
  {
    title: "Kids",
    items: ["Mini Run", "Future Sprint", "Nova Kid"],
  },
  {
    title: "Featured",
    items: ["Jordan Atelier", "Perfume Oils", "Modest Edit"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lily Atelier. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Cookies</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


