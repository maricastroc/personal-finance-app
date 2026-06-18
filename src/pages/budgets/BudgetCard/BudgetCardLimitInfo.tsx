import { formatToDollar } from "@/utils/formatToDollar";

interface BudgetCardLimitInfoProps {
  limit: number;
  pct: number;
  theme: string;
}

export function BudgetCardLimitInfo({
  limit,
  pct,
  theme,
}: BudgetCardLimitInfoProps) {
  return (
    <>
      <p className="text-sm text-ink-300 pt-6">
        Maximum of {formatToDollar(limit)}
      </p>

      <div className="mt-4 w-full h-8 p-1 bg-surface-700 rounded-full">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: theme }}
        />
      </div>
    </>
  );
}
