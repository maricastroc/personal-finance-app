import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import {
  type ValueType,
  type NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { formatToDollar } from "@/utils/formatToDollar";
import { CHART_GREEN } from "@/utils/chartTokens";
import { ChartSkeleton } from "./ChartSkeleton";

type BalanceData = { month: string; balance: number };

type Props = {
  data?: BalanceData[];
  isLoading: boolean;
};

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip rounded-lg px-3 py-2 text-xs">
      <p className="font-semibold mb-1">{label}</p>
      <p style={{ color: CHART_GREEN }}>
        Balance: {formatToDollar(Number(payload[0].value ?? 0))}
      </p>
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
            <stop offset="5%" stopColor={CHART_GREEN} stopOpacity={0.2} />
            <stop offset="95%" stopColor={CHART_GREEN} stopOpacity={0} />
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
          stroke={CHART_GREEN}
          strokeWidth={2}
          fill="url(#balanceGradient)"
          dot={{ fill: CHART_GREEN, r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: CHART_GREEN, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
