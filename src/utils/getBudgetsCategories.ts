import { BudgetWithDetailsProps } from '@/components/shared/BudgetItem'

export function getBudgetsCategories(
  budgets: BudgetWithDetailsProps[] | undefined,
) {
  if (!budgets || budgets.length === 0) {
    return []
  }

  const categories = budgets.map((budget) => budget.categoryName)
  return Array.from(new Set(categories))
}
