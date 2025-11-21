import {
  BudgetItem,
  BudgetWithDetailsProps,
} from "@/components/shared/BudgetItem";
import HomeCard from "./HomeCard";
import { SkeletonBudgetSection } from "@/components/skeletons/SkeletonBudgetSection";
import { FinanceItem } from "@/components/shared/FinanceItem";
import { EmptyContent } from "@/components/shared/EmptyContent";
import { useRouter } from "next/router";

interface BudgetsSectionProps {
  isValidating: boolean;
  budgets: BudgetWithDetailsProps[] | undefined;
}

export const BudgetsSection = ({
  isValidating,
  budgets,
}: BudgetsSectionProps) => {
  const router = useRouter();

  return (
    <HomeCard
      flexGrow
      routePath="/budgets"
      title="Budgets"
      buttonLabel="See Details"
    >
      {isValidating ? (
        <SkeletonBudgetSection />
      ) : budgets && budgets.length ? (
        <div className="flex flex-grow flex-col gap-6 sm:grid sm:grid-cols-[3fr,1.1fr] sm:max-width-[30rem] sm:items-center sm:w-full lg:items-start lg:mt-[-1rem]">
          <BudgetItem />
          <div className="grid grid-cols-2 sm:flex sm:flex-col sm:justify-end sm:items-end sm:w-full gap-4 lg:mt-8">
            {budgets.map((budget, index) => (
              <FinanceItem
                key={index}
                title={budget.categoryName}
                color={budget.theme}
                value={budget.budgetLimit}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyContent
          content="No budgets yet!"
          description="Create pots to set money aside for specific goals or expenses."
          icon={
            <img
              src="/assets/images/icon-nav-budgets.svg"
              alt="Budget icon"
              className="w-12 h-12"
            />
          }
          buttonLabel="Manage Budgets"
          onButtonClick={() => {
            router.push("/budgets");
          }}
        />
      )}
    </HomeCard>
  );
};
