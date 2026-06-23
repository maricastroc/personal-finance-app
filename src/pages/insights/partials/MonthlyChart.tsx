import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatToDollar } from "@/utils/formatToDollar";
import { ChartSkeleton } from "./ChartSkeleton";

type MonthlyData = { month: string; income: number; expense: number };

type Props = {
  data?: MonthlyData[];
  isLoading: boolean;
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="custom-tooltip rounded-lg px-3 py-2 text-xs"
      style={{ minWidth: 140 }}
    >
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.fill }}>
          {entry.name}: {formatToDollar(entry.value)}
        </p>
      ))}
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 16 }}
          formatter={(value) =>
            <span style={{ color: "var(--ink-200)" }}>{value}</span>
          }
        />
        <Bar dataKey="income" name="Income" fill="#4dada8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" name="Expense" fill="#d15d4e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
