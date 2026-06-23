import { useCallback, useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useAppContext } from "@/contexts/AppContext";
import Layout from "@/components/layouts/layout.page";
import { LoadingPage } from "@/components/shared/LoadingPage";
import { useLoadingOnRouteChange } from "@/utils/useLoadingOnRouteChange";
import useRequest from "@/utils/useRequest";
import { MonthlyChart } from "./partials/MonthlyChart";
import { CategoryChart } from "./partials/CategoryChart";
import { BalanceChart } from "./partials/BalanceChart";
import { MetricsCards } from "./partials/MetricsCards";
import { FinancialInsights } from "./partials/FinancialInsights";
import {
  PeriodSelector,
  DEFAULT_PERIOD,
  PRESETS,
  type Period,
} from "./partials/PeriodSelector";

type MonthlyData = { month: string; income: number; expense: number };
type BalanceData = { month: string; balance: number };
type CategoryData = { name: string; total: number };
type InsightItem = { type: "positive" | "warning" | "neutral"; text: string };

type Metrics = {
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  avgMonthlyExpense: number;
  savingsRate: number;
  txCount: number;
  largestExpense: { amount: number; category: string } | null;
};

type InsightsData = {
  monthly: MonthlyData[];
  balanceHistory: BalanceData[];
  categories: CategoryData[];
  metrics: Metrics;
  insights: InsightItem[];
};

export default function Insights() {
  const { isSidebarOpen } = useAppContext();
  const isRouteLoading = useLoadingOnRouteChange();
  const router = useRouter();

  const [activeKey, setActiveKey] = useState("6m");
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);
  const [customFrom, setCustomFrom] = useState(DEFAULT_PERIOD.from);
  const [customTo, setCustomTo] = useState(DEFAULT_PERIOD.to);

  useEffect(() => {
    const { from, to, preset } = router.query;
    if (from && to) {
      const key = typeof preset === "string" ? preset : "custom";
      setActiveKey(key);
      setPeriod({ from: String(from), to: String(to) });
      if (key === "custom") {
        setCustomFrom(String(from));
        setCustomTo(String(to));
      }
    }
  }, [router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyPeriod = useCallback(
    (key: string, next: Period) => {
      setActiveKey(key);
      setPeriod(next);
      router.replace(
        {
          pathname: "/insights",
          query: { from: next.from, to: next.to, preset: key },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  const handleCustomChange = (from: string, to: string) => {
    setCustomFrom(from);
    setCustomTo(to);
    applyPeriod("custom", { from, to });
  };

  const { data: insights, isValidating } = useRequest<InsightsData>(
    { url: `/insights?from=${period.from}&to=${period.to}`, method: "GET" },
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      dedupingInterval: 10000,
    }
  );

  if (isRouteLoading) return <LoadingPage />;

  const activePreset = PRESETS.find((p) => p.key === activeKey);
  function formatMonth(ym: string) {
    return format(parse(ym.slice(0, 7), "yyyy-MM", new Date()), "MMM yyyy");
  }

  const subtitle =
    activeKey === "custom"
      ? `${formatMonth(customFrom)} → ${formatMonth(customTo)}`
      : activePreset?.label ?? "";

  return (
    <>
      <NextSeo
        title="Insights | Finance App"
        additionalMetaTags={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
        ]}
      />
      <Layout>
        <section
          className={`px-4 w-full md:px-10 py-5 md:p-10 pb-20 md:pb-32 lg:pb-8 lg:pl-0 ${
            isSidebarOpen ? "lg:pr-10" : "lg:pr-20"
          }`}
        >
          {/* Header + period selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-xl font-bold text-ink-50">Insights</h1>
            <PeriodSelector
              activeKey={activeKey}
              customFrom={customFrom}
              customTo={customTo}
              onPreset={applyPeriod}
              onCustomChange={handleCustomChange}
            />
          </div>

          <div className="flex flex-col gap-6">
            {/* Quick metrics */}
            <MetricsCards
              metrics={insights?.metrics}
              isLoading={isValidating}
            />

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Income vs Expenses" subtitle={subtitle}>
                <MonthlyChart
                  data={insights?.monthly}
                  isLoading={isValidating}
                />
              </ChartCard>
              <ChartCard title="Balance Over Time" subtitle={subtitle}>
                <BalanceChart
                  data={insights?.balanceHistory}
                  isLoading={isValidating}
                />
              </ChartCard>
            </div>

            {/* Category breakdown — horizontal bars */}
            <ChartCard title="Spending by Category" subtitle={subtitle}>
              <CategoryChart
                data={insights?.categories}
                isLoading={isValidating}
              />
            </ChartCard>

            {/* Text insights */}
            <FinancialInsights
              insights={insights?.insights}
              isLoading={isValidating}
            />
          </div>
        </section>
      </Layout>
    </>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl px-5 py-6 md:p-8"
      style={{
        background: "var(--card-gradient)",
        border: "1px solid var(--card-border)",
      }}
    >
      <div className="mb-6">
        <h2 className="text-base font-semibold text-ink-50">{title}</h2>
        <p className="text-xs text-ink-300 mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
