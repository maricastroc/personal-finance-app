/* eslint-disable react-hooks/exhaustive-deps */
import { NextSeo } from "next-seo";
import { useAppContext } from "@/contexts/AppContext";
import Layout from "@/components/layouts/layout.page";
import { BudgetWithDetailsProps } from "@/components/shared/BudgetItem";
import { LoadingPage } from "@/components/shared/LoadingPage";
import { FinanceCard } from "./partials/FinanceCard";
import { TransactionProps } from "@/types/transaction";
import { RecurringBillProps } from "@/types/recurringBills";
import useRequest from "@/utils/useRequest";
import { formatToDollar } from "@/utils/formatToDollar";
import { useLoadingOnRouteChange } from "@/utils/useLoadingOnRouteChange";
import { BudgetsSection } from "./partials/BudgetsSection";
import { RecurringBillsSection } from "./partials/RecurringBillsSection";
import { TransactionsSection } from "./partials/TransactionsSection";
import { PotsSection } from "./partials/PotsSection";
import { PageHeader } from "./partials/PageHeader";
import { useEffect, useState } from "react";
import { swrConfig } from "@/utils/constants";
import { PotsResult } from "@/types/pots-result";

interface BalanceProps {
  incomes: number | undefined;
  expenses: number | undefined;
  currentBalance: number | undefined;
}

interface RecurringBillsWithDetails {
  bills: RecurringBillProps[];
  total: number;
}

export interface RecurringBillsResult {
  overdue: RecurringBillsWithDetails;
  upcoming: RecurringBillsWithDetails;
  dueSoon: RecurringBillsWithDetails;
  bills: RecurringBillProps[];
  monthlyTotal: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function Home() {
  const { isSidebarOpen } = useAppContext();

  const isRouteLoading = useLoadingOnRouteChange();

  const [initialLoad, setInitialLoad] = useState(true);

  const { data: balance, isValidating: isValidatingBalance } =
    useRequest<BalanceProps>({ url: "/balance", method: "GET" }, swrConfig);

  const { data: potsData, isValidating: isValidatingPots } =
    useRequest<PotsResult>({ url: "/pots", method: "GET" }, swrConfig);

  const { data: budgets, isValidating: isValidatingBudgets } = useRequest<
    BudgetWithDetailsProps[]
  >({ url: "/budgets", method: "GET" }, swrConfig);

  const { data: recurringBills, isValidating: isValidatingBills } =
    useRequest<RecurringBillsResult>(
      { url: "/recurring_bills", method: "GET" },
      swrConfig
    );

  const { data: transactions, isValidating: isValidatingTransactions } =
    useRequest<TransactionProps[]>(
      { url: "/transactions/latest", method: "GET" },
      swrConfig
    );

  const isAnyDataValidating =
    isValidatingBalance ||
    isValidatingTransactions ||
    isValidatingPots ||
    isValidatingBudgets ||
    isValidatingBills;

  useEffect(() => {
    if (!isAnyDataValidating && initialLoad) {
      setInitialLoad(false);
    }
  }, [isAnyDataValidating, initialLoad]);

  // Mostra loading apenas na primeira carga ou mudança de rota
  if (isRouteLoading || initialLoad) {
    return <LoadingPage />;
  }

  return (
    <>
      <NextSeo
        title="Home | Finance App"
        additionalMetaTags={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
        ]}
      />

      <Layout>
        <div
          className={`flex-grow px-4 py-5 md:p-10 pb-20 md:pb-32 lg:pb-8 lg:pl-0 ${
            isSidebarOpen ? "lg:pr-10" : "lg:pr-20"
          }`}
        >
          <PageHeader />

          <section className="grid md:grid-cols-3 gap-4 mt-8 md:h-[7.5rem] lg:mt-6 lg:gap-6">
            <FinanceCard
              title="Current Balance"
              value={formatToDollar(balance?.currentBalance || 0)}
              isValidating={isValidatingBalance && initialLoad}
            />
            <FinanceCard
              variant="income"
              title="Incomes"
              value={formatToDollar(balance?.incomes || 0)}
              isValidating={isValidatingBalance && initialLoad}
            />
            <FinanceCard
              variant="outcome"
              title="Expenses"
              value={formatToDollar(balance?.expenses || 0)}
              isValidating={isValidatingBalance && initialLoad}
            />
          </section>

          <section className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6">
            <div className="flex flex-col">
              <PotsSection
                pots={potsData?.pots}
                totalCurrentAmount={potsData?.totalCurrentAmount}
                isValidating={isValidatingPots && initialLoad}
              />
              <TransactionsSection
                transactions={transactions}
                isValidating={isValidatingTransactions && initialLoad}
              />
            </div>

            <div className="flex flex-col flex-grow">
              <BudgetsSection
                budgets={budgets}
                isValidating={isValidatingBudgets && initialLoad}
              />
              <RecurringBillsSection
                recurringBills={recurringBills}
                isValidating={isValidatingBills && initialLoad}
              />
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
