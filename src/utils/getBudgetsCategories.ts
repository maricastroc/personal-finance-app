import { BudgetProps } from "@/types/budget";

export function getBudgetsCategories(budgets: BudgetProps[] | undefined) {
  if (!budgets || budgets.length === 0) {
    return [];
  }

  const categories = budgets.map((budget) => budget.category?.name);
  return Array.from(new Set(categories));
}
