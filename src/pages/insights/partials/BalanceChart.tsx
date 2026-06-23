import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatToDollar } from "@/utils/formatToDollar";
import { ChartSkeleton } from "./ChartSkeleton";

type BalanceData = { month: string; balance: number };

type Props = {
  data?: BalanceData[];
  isLoading: boolean;
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip rounded-lg px-3 py-2 text-xs">
      <p className="font-semibold mb-1">{label}</p>
      <p style={{ color: "#4dada8" }}>Balance: {formatToDollar(payload[0].value)}</p>
    </div>
  );
}

export function BalanceChart({ data, isLoading }: Props) {
  if (isLoading || !data) return <ChartSkeleton />;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4dada8" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#4dada8" stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#4dada8"
          strokeWidth={2}
          fill="url(#balanceGradient)"
          dot={{ fill: "#4dada8", r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#4dada8", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
