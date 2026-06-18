import { describe, it, expect } from "vitest";
import { mapCategoriesForSelect } from "../mapCategoriesForSelect";
import { CategoryProps } from "@/types/category";

const categories: CategoryProps[] = [
  { id: "1", name: "Food" },
  { id: "2", name: "Transport" },
  { id: "3", name: "Entertainment" },
];

describe("mapCategoriesForSelect", () => {
  it("marks categories that are already in use", () => {
    const result = mapCategoriesForSelect(categories, ["Food", "Transport"]);
    expect(result).toEqual([
      { label: "Food", value: "Food", isUsed: true },
      { label: "Transport", value: "Transport", isUsed: true },
      { label: "Entertainment", value: "Entertainment", isUsed: false },
    ]);
  });

  it("marks all categories as unused when none are selected", () => {
    const result = mapCategoriesForSelect(categories, []);
    result.forEach((item) => expect(item.isUsed).toBe(false));
  });

  it("marks all categories as used when all are selected", () => {
    const result = mapCategoriesForSelect(categories, [
      "Food",
      "Transport",
      "Entertainment",
    ]);
    result.forEach((item) => expect(item.isUsed).toBe(true));
  });

  it("returns an empty array when no categories are provided", () => {
    expect(mapCategoriesForSelect([], [])).toEqual([]);
  });
});
