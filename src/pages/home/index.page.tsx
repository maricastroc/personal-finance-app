import { NextSeo } from "next-seo";
import { useAppContext } from "@/contexts/AppContext";
import Layout from "@/components/layouts/layout.page";
import { LoadingPage } from "@/components/shared/LoadingPage";
import { FinanceCard } from "./partials/FinanceCard";
import { TransactionProps } from "@/types/transaction";
import useRequest from "@/utils/useRequest";
import { formatToDollar } from "@/utils/formatToDollar";
import { useLoadingOnRouteChange } from "@/utils/useLoadingOnRouteChange";
import { BudgetsSection } from "./partials/BudgetsSection";
import { RecurringBillsSection } from "./partials/RecurringBillsSection";
import { TransactionsSection } from "./partials/TransactionsSection";
import { PotsSection } from "./partials/PotsSection";
import { PageHeader } from "./partials/PageHeader";
import { swrConfig } from "@/utils/constants";
import { PotsResult } from "@/types/pots-result";
import { BudgetProps } from "@/types/budget";
import { useBalance } from "@/contexts/BalanceContext";
import { RecurringBillsResult } from "@/types/recurring-bills-result";

type HomeSummary = {
  potsData: PotsResult;
  budgets: BudgetProps[];
  recurringBills: RecurringBillsResult;
  transactions: TransactionProps[];
};

export default function Home() {
  const { isSidebarOpen } = useAppContext();

  const isRouteLoading = useLoadingOnRouteChange();

  const { incomes, expenses, currentBalance, isLoading } = useBalance();

  const { data: summary, isValidating } = useRequest<HomeSummary>(
    { url: "/home/summary", method: "GET" },
    swrConfig
  );

  if (isRouteLoading) {
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
              value={formatToDollar(currentBalance)}
              isValidating={isLoading}
            />
            <FinanceCard
              variant="income"
              title="Incomes"
              value={formatToDollar(incomes)}
              isValidating={isLoading}
            />
            <FinanceCard
              variant="outcome"
              title="Expenses"
              value={formatToDollar(expenses)}
              isValidating={isLoading}
            />
          </section>

          <section className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6">
            <div className="flex flex-col">
              <PotsSection
                pots={summary?.potsData?.pots}
                totalCurrentAmount={summary?.potsData?.totalCurrentAmount}
                isValidating={isValidating}
              />
              <TransactionsSection
                transactions={summary?.transactions}
                isValidating={isValidating}
              />
            </div>

            <div className="flex flex-col flex-grow">
              <BudgetsSection
                budgets={summary?.budgets}
                isValidating={isValidating}
              />
              <RecurringBillsSection
                recurringBills={summary?.recurringBills}
                isValidating={isValidating}
              />
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
