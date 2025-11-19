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
      <p className="text-sm text-gray-500 pt-6">
        Maximum of {formatToDollar(limit)}
      </p>

      <div className="mt-4 w-full h-8 p-1 bg-beige-100 rounded-full">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: theme }}
        />
      </div>
    </>
  );
}
