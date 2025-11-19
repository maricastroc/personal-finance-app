import { CategoryProps } from "@/types/category";

export function mapCategoriesForSelect(
  allCategories: CategoryProps[],
  existedCategories: string[]
) {
  return allCategories.map((category) => ({
    label: category.name,
    value: category.name,
    isUsed: existedCategories.includes(category.name),
  }));
}
