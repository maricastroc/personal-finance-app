import { formatToDollar } from "@/utils/formatToDollar";
import { ChartSkeleton } from "./ChartSkeleton";

type Metrics = {
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  avgMonthlyExpense: number;
  savingsRate: number;
  txCount: number;
  largestExpense: { amount: number; category: string } | null;
};

type Props = {
  metrics?: Metrics;
  isLoading: boolean;
};

function Card({
  label,
  value,
  valueColor,
  sub,
}: {
  label: string;
  value: string;
  valueColor?: string;
  sub?: string;
}) {
  return (
    <div
      className="rounded-xl px-5 py-5 flex flex-col gap-1"
      style={{
        background: "var(--card-gradient)",
        border: "1px solid var(--card-border)",
      }}
    >
      <span className="text-xs text-ink-300 uppercase tracking-wide">
        {label}
      </span>
      <span className={`text-xl font-bold ${valueColor ?? "text-ink-50"}`}>
        {value}
      </span>
      {sub && <span className="text-xs text-ink-300">{sub}</span>}
    </div>
  );
}

export function MetricsCards({ metrics, isLoading }: Props) {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ChartSkeleton key={i} height={96} />
        ))}
      </div>
    );
  }

  const savingsColor =
    metrics.savingsRate >= 20
      ? "text-accent-green"
      : metrics.savingsRate > 0
      ? "text-accent-yellow"
      : "text-accent-red";

  const netColor =
    metrics.netCashFlow >= 0 ? "text-accent-green" : "text-accent-red";
  const netPrefix = metrics.netCashFlow >= 0 ? "+" : "";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        label="Net Cash Flow"
        value={`${netPrefix}${formatToDollar(Math.abs(metrics.netCashFlow))}`}
        valueColor={netColor}
        sub={metrics.netCashFlow >= 0 ? "Positive period" : "Deficit period"}
      />
      <Card
        label="Savings Rate"
        value={`${
          metrics.savingsRate > 0 ? metrics.savingsRate.toFixed(0) : 0
        }%`}
        valueColor={savingsColor}
        sub={
          metrics.savingsRate >= 20
            ? "On track"
            : metrics.savingsRate > 0
            ? "Room to improve"
            : "Exceeded income"
        }
      />
      <Card
        label="Largest Expense"
        value={
          metrics.largestExpense
            ? formatToDollar(metrics.largestExpense.amount)
            : "—"
        }
        valueColor="text-accent-red"
        sub={metrics.largestExpense?.category}
      />
      <Card
        label="Avg Monthly Spending"
        value={formatToDollar(metrics.avgMonthlyExpense)}
        valueColor="text-accent-green"
        sub={`${metrics.txCount} transactions`}
      />
    </div>
  );
}
