import { describe, it, expect } from "vitest";
import { getBudgetsCategories } from "../getBudgetsCategories";
import { BudgetProps } from "@/types/budget";

const makeBudget = (categoryName: string): BudgetProps =>
  ({
    id: "1",
    amount: 100,
    categoryId: "1",
    category: { id: "1", name: categoryName },
    themeId: "1",
    theme: { id: "1", color: "#00ff00", description: "Green" },
    userId: "1",
    user: { id: "1", name: "Test", email: "test@test.com" },
  } as BudgetProps);

describe("getBudgetsCategories", () => {
  it("returns category names from a list of budgets", () => {
    const budgets = [makeBudget("Food"), makeBudget("Transport")];
    expect(getBudgetsCategories(budgets)).toEqual(["Food", "Transport"]);
  });

  it("deduplicates repeated category names", () => {
    const budgets = [
      makeBudget("Food"),
      makeBudget("Food"),
      makeBudget("Transport"),
    ];
    expect(getBudgetsCategories(budgets)).toEqual(["Food", "Transport"]);
  });

  it("returns an empty array for an empty list", () => {
    expect(getBudgetsCategories([])).toEqual([]);
  });

  it("returns an empty array for undefined", () => {
    expect(getBudgetsCategories(undefined)).toEqual([]);
  });
});
