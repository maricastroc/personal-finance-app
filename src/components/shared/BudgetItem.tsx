import { formatToDollar } from "@/utils/formatToDollar";
import useRequest from "@/utils/useRequest";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";

export interface BudgetItemProps {
  isBudgetsScreen?: boolean;
}

export interface BudgetWithDetailsProps {
  id: string;
  categoryName: string;
  amountSpent: number;
  theme: string;
  budgetLimit: number;
}

export function BudgetItem({ isBudgetsScreen }: BudgetItemProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { data: budgets } = useRequest<BudgetWithDetailsProps[]>({
    url: "/budgets",
    method: "GET",
  });

  if (!budgets?.length) {
    return (
      <p className="text-gray-500 text-center" role="status">
        No budgets available
      </p>
    );
  }

  const budgetLimitSum = budgets.reduce((sum, b) => sum + b.budgetLimit, 0);
  const amountSpentSum = budgets.reduce((sum, b) => sum + b.amountSpent, 0);

  const data = budgets.map((b) => ({
    name: b.categoryName,
    value: b.budgetLimit,
    theme: b.theme,
  }));

  const tooltipContent = (props: TooltipProps<number, string>) => {
    const { active, payload } = props;

    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const percentage = budgetLimitSum
        ? ((value / budgetLimitSum) * 100).toFixed(2)
        : "0.00";

      return (
        <div className="custom-tooltip bg-white text-gray-700 shadow-lg text-sm font-semibold p-2 rounded-md">
          <p>{`${name}: ${percentage}%`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      aria-label="Budget donut chart showing total spent versus total limits by category"
      className="flex justify-center"
    >
      <span className="sr-only">
        Total spent {formatToDollar(amountSpentSum)} out of a limit of{" "}
        {formatToDollar(budgetLimitSum)}.
      </span>

      <ResponsiveContainer
        width={260}
        height={isBudgetsScreen ? 250 : 331.5}
        style={{ margin: "0 auto" }}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="80%"
            outerRadius="100%"
            stroke="none"
          >
            {budgets.map((b, index) => (
              <Cell
                key={`cell-outer-${index}`}
                fill={activeIndex === index ? `${b.theme}80` : b.theme}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => setActiveIndex(index)}
                cursor="pointer"
              />
            ))}
          </Pie>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="67%"
            outerRadius="80%"
            stroke="none"
          >
            {budgets.map((b, index) => (
              <Cell
                key={`cell-inner-${index}`}
                fill={activeIndex === index ? `${b.theme}98` : b.theme}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => setActiveIndex(index)}
                cursor="pointer"
              />
            ))}
          </Pie>

          <Tooltip content={tooltipContent} />

          <text
            aria-hidden="true"
            x="50%"
            y="48%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#000"
            fontSize="24"
            fontWeight="bold"
          >
            {formatToDollar(amountSpentSum)}
          </text>

          <text
            aria-hidden="true"
            x="50%"
            y="58%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#696868"
            fontSize="15"
          >
            of {formatToDollar(budgetLimitSum)} limit
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
