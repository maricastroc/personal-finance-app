import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  type TooltipProps,
} from "recharts";
import {
  type ValueType,
  type NameType,
  type Payload,
} from "recharts/types/component/DefaultTooltipContent";
import { formatToDollar } from "@/utils/formatToDollar";
import { CHART_GREEN, CHART_RED } from "@/utils/chartTokens";
import { ChartSkeleton } from "./ChartSkeleton";

type MonthlyData = { month: string; income: number; expense: number };

type Props = {
  data?: MonthlyData[];
  isLoading: boolean;
};

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="custom-tooltip rounded-lg px-3 py-2 text-xs"
      style={{ minWidth: 140 }}
    >
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry: Payload<ValueType, NameType>) => {
        const color = entry.dataKey === "income" ? CHART_GREEN : CHART_RED;
        return (
          <p key={String(entry.dataKey)} style={{ color }}>
            {entry.name}: {formatToDollar(Number(entry.value ?? 0))}
          </p>
        );
      })}
    </div>
  );
}

export function MonthlyChart({ data, isLoading }: Props) {
  if (isLoading || !data) return <ChartSkeleton />;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barCategoryGap="30%" barGap={4}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="rgba(255,255,255,0.06)"
        />
        <XAxis
          dataKey="month"
          tick={{ fill: "var(--ink-300)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--ink-300)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          width={40}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 16 }}
          formatter={(value) => (
            <span style={{ color: "var(--ink-200)" }}>{value}</span>
          )}
        />
        <Bar
          dataKey="income"
          name="Income"
          fill={CHART_GREEN}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expense"
          name="Expense"
          fill={CHART_RED}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
