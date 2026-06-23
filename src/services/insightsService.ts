import { prisma } from "@/lib/prisma";
import {
  startOfMonth,
  endOfMonth,
  format,
  eachMonthOfInterval,
} from "date-fns";

type MonthlyRow = { month: Date; type: string; total: number };
type CategoryRow = { name: string; total: number };
type CountRow = { total: number };

export type InsightsParams = {
  from: Date;
  to: Date;
};

export type InsightItem = {
  type: "positive" | "warning" | "neutral";
  text: string;
};

export async function getInsights(userId: string, params: InsightsParams) {
  const { from, to } = params;
  const rangeStart = startOfMonth(from);
  const rangeEnd = endOfMonth(to);

  // Previous equivalent period for comparisons
  const rangeLengthMs = rangeEnd.getTime() - rangeStart.getTime();
  const prevRangeEnd = new Date(rangeStart.getTime() - 1);
  const prevRangeStart = new Date(prevRangeEnd.getTime() - rangeLengthMs);

  const [
    monthlyRaw,
    categoriesRaw,
    user,
    txCountRaw,
    prevExpenseRaw,
    currentExpenseRaw,
    largestTxRaw,
  ] = await Promise.all([
    prisma.$queryRaw<MonthlyRow[]>`
        SELECT
          DATE_TRUNC('month', date) AS month,
          type,
          SUM(amount)::float AS total
        FROM transactions
        WHERE "userId" = ${userId}
          AND type IN ('income', 'expense')
          AND date >= ${rangeStart}
          AND date <= ${rangeEnd}
        GROUP BY DATE_TRUNC('month', date), type
        ORDER BY month ASC
      `,
    prisma.$queryRaw<CategoryRow[]>`
        SELECT
          COALESCE(c.name, 'Uncategorized') AS name,
          SUM(t.amount)::float AS total
        FROM transactions t
        LEFT JOIN categories c ON t."categoryId" = c.id
        WHERE t."userId" = ${userId}
          AND t.type = 'expense'
          AND t.date >= ${rangeStart}
          AND t.date <= ${rangeEnd}
        GROUP BY c.name
        ORDER BY total DESC
        LIMIT 8
      `,
    prisma.user.findUnique({
      where: { id: userId },
      select: { currentBalance: true },
    }),
    prisma.$queryRaw<CountRow[]>`
        SELECT COUNT(*)::int AS total
        FROM transactions
        WHERE "userId" = ${userId}
          AND date >= ${rangeStart}
          AND date <= ${rangeEnd}
      `,
    // Total expense in previous period
    prisma.$queryRaw<CountRow[]>`
        SELECT COALESCE(SUM(amount), 0)::float AS total
        FROM transactions
        WHERE "userId" = ${userId}
          AND type = 'expense'
          AND date >= ${prevRangeStart}
          AND date <= ${prevRangeEnd}
      `,
    // Total expense in current period
    prisma.$queryRaw<CountRow[]>`
        SELECT COALESCE(SUM(amount), 0)::float AS total
        FROM transactions
        WHERE "userId" = ${userId}
          AND type = 'expense'
          AND date >= ${rangeStart}
          AND date <= ${rangeEnd}
      `,
    // Largest single expense
    prisma.transaction.findFirst({
      where: {
        userId,
        type: "expense",
        date: { gte: rangeStart, lte: rangeEnd },
      },
      orderBy: { amount: "desc" },
      include: { category: true },
    }),
  ]);

  // ── Monthly chart data ──────────────────────────────────────────────────────
  const monthDates = eachMonthOfInterval({ start: rangeStart, end: rangeEnd });
  const months = monthDates.map((d) => format(d, "MMM yy"));

  const monthlyMap: Record<string, { income: number; expense: number }> = {};
  months.forEach((m) => (monthlyMap[m] = { income: 0, expense: 0 }));

  for (const row of monthlyRaw) {
    const label = format(new Date(row.month), "MMM yy");
    if (monthlyMap[label]) {
      monthlyMap[label][row.type as "income" | "expense"] = row.total;
    }
  }

  const monthly = months.map((month) => ({
    month,
    income: monthlyMap[month].income,
    expense: monthlyMap[month].expense,
  }));

  // ── Balance history ─────────────────────────────────────────────────────────
  let runningBalance = user?.currentBalance ?? 0;
  const balanceHistory = [...monthly].reverse().map((m) => {
    const balance = runningBalance;
    runningBalance = runningBalance - m.income + m.expense;
    return { month: m.month, balance };
  });
  balanceHistory.reverse();

  // ── Category breakdown ──────────────────────────────────────────────────────
  const categories = categoriesRaw.map((r) => ({
    name: r.name,
    total: r.total,
  }));

  // ── Quick metrics ───────────────────────────────────────────────────────────
  const totalIncome = monthly.reduce((s, m) => s + m.income, 0);
  const totalExpense = monthly.reduce((s, m) => s + m.expense, 0);
  const txCount = txCountRaw[0]?.total ?? 0;
  const avgMonthlyExpense =
    months.length > 0 ? totalExpense / months.length : 0;
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  const metrics = {
    totalIncome,
    totalExpense,
    netCashFlow: totalIncome - totalExpense,
    avgMonthlyExpense,
    savingsRate,
    txCount,
    largestExpense: largestTxRaw
      ? {
          amount: largestTxRaw.amount,
          category: largestTxRaw.category?.name ?? "Uncategorized",
        }
      : null,
  };

  // ── Text insights ───────────────────────────────────────────────────────────
  const prevExpense = prevExpenseRaw[0]?.total ?? 0;
  const currentExpense = currentExpenseRaw[0]?.total ?? 0;
  const insights: InsightItem[] = [];

  if (prevExpense > 0) {
    const expenseChange = ((currentExpense - prevExpense) / prevExpense) * 100;
    if (expenseChange <= -5) {
      insights.push({
        type: "positive",
        text: `Spending decreased ${Math.abs(expenseChange).toFixed(
          0
        )}% compared to the previous period`,
      });
    } else if (expenseChange >= 10) {
      insights.push({
        type: "warning",
        text: `Spending increased ${expenseChange.toFixed(
          0
        )}% compared to the previous period`,
      });
    }
  }

  if (savingsRate >= 20) {
    insights.push({
      type: "positive",
      text: `Savings rate of ${savingsRate.toFixed(
        0
      )}% — you're keeping more than you spend`,
    });
  } else if (savingsRate > 0 && savingsRate < 10) {
    insights.push({
      type: "warning",
      text: `Savings rate is only ${savingsRate.toFixed(
        0
      )}% — consider reducing expenses`,
    });
  } else if (savingsRate <= 0 && totalIncome > 0) {
    insights.push({
      type: "warning",
      text: `Expenses exceeded income in this period`,
    });
  }

  if (categories.length > 0) {
    const categoryTotal = categories.reduce((s, c) => s + c.total, 0);
    if (categoryTotal > 0) {
      const top = categories[0];
      const topPct = (top.total / categoryTotal) * 100;
      if (topPct > 50) {
        insights.push({
          type: "warning",
          text: `${top.name} accounts for ${topPct.toFixed(
            1
          )}% of all expenses`,
        });
      } else {
        insights.push({
          type: "positive",
          text: `Spending spread across categories — ${
            top.name
          } is the largest at ${topPct.toFixed(1)}%`,
        });
      }
    }
  }

  if (largestTxRaw) {
    insights.push({
      type: "neutral",
      text: `Largest transaction: ${
        largestTxRaw.category?.name ?? largestTxRaw.contactName
      } ($${largestTxRaw.amount.toFixed(2)})`,
    });
  }

  const monthsWithExpense = monthly.filter((m) => m.expense > 0);
  if (monthsWithExpense.length >= 2) {
    const lastMonth = monthsWithExpense[monthsWithExpense.length - 1];
    const prevMonth = monthsWithExpense[monthsWithExpense.length - 2];
    if (lastMonth.expense < prevMonth.expense) {
      insights.push({
        type: "positive",
        text: `Last month's spending ($${lastMonth.expense.toFixed(
          0
        )}) was lower than the month before ($${prevMonth.expense.toFixed(0)})`,
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      type: "neutral",
      text: "Not enough transaction data in this period to generate insights",
    });
  }

  return { monthly, balanceHistory, categories, metrics, insights };
}
