export function PeriodSelector({ period, setPeriod }) {
  const periods = ["week", "fortnight", "month", "year"];

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {periods.map((p) => (
        <button
          key={p}
          onClick={() => setPeriod(p)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            period === p
              ? "bg-[#2383E2] text-white"
              : "bg-white dark:bg-[#1E1E1E] text-[#37352F] dark:text-[#DEDEDE] border border-[#E3E2E0] dark:border-[#2C2C2C] hover:bg-[#F7F6F3] dark:hover:bg-[#2C2C2C]"
          }`}
        >
          {p.charAt(0).toUpperCase() + p.slice(1)}
        </button>
      ))}
    </div>
  );
}
