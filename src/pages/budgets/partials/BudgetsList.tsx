import { BudgetWithDetailsProps } from "@/components/shared/BudgetItem";
import { FinanceItem } from "@/components/shared/FinanceItem";

interface BudgetsListProps {
  budgets: BudgetWithDetailsProps[];
}

export const BudgetsList = ({ budgets }: BudgetsListProps) => {
  return (
    <div className="flex flex-col justify-start items-start w-full mt-5">
      <h2
        id="spending-summary-title"
        className="text-xl font-bold my-6 md:mt-0"
      >
        Spending Summary
      </h2>

      {budgets.map((budget, index) => (
        <div key={budget.id} className="w-full flex flex-col">
          <FinanceItem
            isBudgetsPage
            title={budget.categoryName}
            color={budget.theme}
            value={budget.budgetLimit}
            amountSpent={budget.amountSpent}
          />
          {index !== budgets.length - 1 && (
            <span className="my-3 w-full h-[1px] bg-grey-300" />
          )}
        </div>
      ))}
    </div>
  );
};
