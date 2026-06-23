import { formatToDollar } from "@/utils/formatToDollar";
import { CHART_CATEGORY_COLORS } from "@/utils/chartTokens";
import { ChartSkeleton } from "./ChartSkeleton";

type CategoryData = { name: string; total: number };

type Props = {
  data?: CategoryData[];
  isLoading: boolean;
};

export function CategoryChart({ data, isLoading }: Props) {
  if (isLoading || !data) return <ChartSkeleton height={220} />;

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[220px] text-ink-300 text-sm">
        No expense data for this period.
      </div>
    );
  }

  const max = data[0].total;

  return (
    <div className="flex flex-col gap-3">
      {data.map((item, i) => {
        const pct = max > 0 ? (item.total / max) * 100 : 0;
        const color = CHART_CATEGORY_COLORS[i % CHART_CATEGORY_COLORS.length];
        return (
          <div key={item.name} className="flex items-center gap-3">
            <span className="text-xs text-ink-200 w-28 shrink-0 truncate">
              {item.name}
            </span>
            <div className="flex-1 h-2 rounded-full bg-surface-500 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
            <span className="text-xs font-medium text-ink-100 w-20 text-right shrink-0">
              {formatToDollar(item.total)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
