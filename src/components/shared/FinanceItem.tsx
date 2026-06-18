import { formatToDollar } from "@/utils/formatToDollar";

interface FinanceItemProps {
  title: string;
  value: number;
  color: string;
  isBudgetsPage?: boolean;
  amountSpent?: number;
}

export function FinanceItem({
  title,
  value,
  color,
  amountSpent,
  isBudgetsPage = false,
}: FinanceItemProps) {
  return (
    <div
      className="flex items-center w-full"
      role="group"
      aria-label={`${title}: ${formatToDollar(value)}`}
    >
      <span
        aria-hidden="true"
        className={`w-0.5 rounded-full mr-3 shrink-0 ${
          !isBudgetsPage ? "h-10" : "h-5"
        }`}
        style={{ backgroundColor: color }}
      />

      <div
        className={`flex gap-1 ${
          !isBudgetsPage ? "flex-col" : "w-full justify-between items-center"
        }`}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-ink-400 leading-none">
          {title}
        </p>

        <div className="flex items-baseline gap-1">
          <p className="text-sm font-semibold text-ink-100 leading-tight">
            {isBudgetsPage
              ? formatToDollar(amountSpent || 0)
              : formatToDollar(value || 0)}
          </p>

          {isBudgetsPage && amountSpent !== undefined && (
            <p className="text-[10px] text-ink-400">
              / {formatToDollar(value || 0)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
