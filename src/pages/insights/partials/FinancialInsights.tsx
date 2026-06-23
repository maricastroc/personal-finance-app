import { ChartSkeleton } from "./ChartSkeleton";

type InsightItem = {
  type: "positive" | "warning" | "neutral";
  text: string;
};

type Props = {
  insights?: InsightItem[];
  isLoading: boolean;
};

const icons = {
  positive: "✓",
  warning: "⚠",
  neutral: "→",
};

const colors = {
  positive: "text-accent-green",
  warning: "text-accent-yellow",
  neutral: "text-ink-300",
};

const bgColors = {
  positive: "bg-accent-greenDim",
  warning: "bg-surface-600",
  neutral: "bg-surface-600",
};

export function FinancialInsights({ insights, isLoading }: Props) {
  if (isLoading || !insights) return <ChartSkeleton height={80} />;

  return (
    <div
      className="rounded-xl px-5 py-4 md:px-8 md:py-5"
      style={{
        background: "var(--card-gradient)",
        border: "1px solid var(--card-border)",
      }}
    >
      <h2 className="text-sm font-semibold text-ink-50 mb-3">
        Financial Insights
      </h2>
      <ul className="flex flex-col gap-2">
        {insights.map((item, i) => (
          <li key={i} className="flex items-center gap-2.5">
            <span className={`text-sm font-bold leading-none ${colors[item.type]}`}>
              {icons[item.type]}
            </span>
            <p className="text-xs text-ink-200 leading-snug">{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
