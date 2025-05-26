export function CustomChartToolTipContent({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const labelMap = {
    tax: "Tax",
    totalAssessment: "Total Assessment",
  };

  return (
    <div className="rounded bg-background px-2 py-1 shadow-sm border text-xs">
      <p className="font-semibold mb-1">{label}</p>
      <ul className="space-y-0.5">
        {payload.map((entry, index) => (
          <li key={index} className="flex justify-between gap-4">
            <span className="text-muted-foreground">
              {labelMap[entry.dataKey] ?? entry.name}
            </span>
            <span className="font-medium">${entry.value.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
