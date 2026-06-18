import { describe, it, expect } from "vitest";
import { createBudgetSchema, updateBudgetSchema } from "../budget";

const validData = {
  categoryName: "Food",
  themeId: "theme-1",
  amount: 500,
};

describe("createBudgetSchema", () => {
  it("accepts valid data", () => {
    expect(() => createBudgetSchema.parse(validData)).not.toThrow();
  });

  it("rejects empty categoryName", () => {
    const result = createBudgetSchema.safeParse({
      ...validData,
      categoryName: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty themeId", () => {
    const result = createBudgetSchema.safeParse({ ...validData, themeId: "" });
    expect(result.success).toBe(false);
  });

  it("rejects zero amount", () => {
    const result = createBudgetSchema.safeParse({ ...validData, amount: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects negative amount", () => {
    const result = createBudgetSchema.safeParse({ ...validData, amount: -100 });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const result = createBudgetSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("updateBudgetSchema", () => {
  it("accepts valid data", () => {
    expect(() => updateBudgetSchema.parse(validData)).not.toThrow();
  });

  it("rejects negative amount", () => {
    const result = updateBudgetSchema.safeParse({ ...validData, amount: -1 });
    expect(result.success).toBe(false);
  });
});
