import { CategoryProps } from "@/types/category";

export function mapCategoriesForSelect(
  allCategories: CategoryProps[],
  selectedBudgetsCategories: string[]
) {
  return allCategories.map((category) => ({
    label: category.name,
    value: category.name,
    isUsed: selectedBudgetsCategories.includes(category.name),
  }));
}
