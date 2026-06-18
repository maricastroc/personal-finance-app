import { describe, it, expect } from "vitest";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../transaction";

const validCreate = {
  amount: 100,
  categoryName: "Food",
  contactName: "John Doe",
  type: "expense" as const,
};

const validUpdate = {
  amount: 50,
  categoryName: "Transport",
  contactName: "Jane Doe",
  type: "income" as const,
};

describe("createTransactionSchema", () => {
  it("accepts valid expense data", () => {
    expect(() => createTransactionSchema.parse(validCreate)).not.toThrow();
  });

  it("accepts income and transfer types", () => {
    expect(() =>
      createTransactionSchema.parse({ ...validCreate, type: "income" })
    ).not.toThrow();
    expect(() =>
      createTransactionSchema.parse({ ...validCreate, type: "transfer" })
    ).not.toThrow();
  });

  it("rejects zero amount", () => {
    const result = createTransactionSchema.safeParse({
      ...validCreate,
      amount: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty categoryName", () => {
    const result = createTransactionSchema.safeParse({
      ...validCreate,
      categoryName: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty contactName", () => {
    const result = createTransactionSchema.safeParse({
      ...validCreate,
      contactName: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid type", () => {
    const result = createTransactionSchema.safeParse({
      ...validCreate,
      type: "refund",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateTransactionSchema", () => {
  it("accepts valid data", () => {
    expect(() => updateTransactionSchema.parse(validUpdate)).not.toThrow();
  });

  it("does not accept transfer type", () => {
    const result = updateTransactionSchema.safeParse({
      ...validUpdate,
      type: "transfer",
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero amount", () => {
    const result = updateTransactionSchema.safeParse({
      ...validUpdate,
      amount: 0,
    });
    expect(result.success).toBe(false);
  });
});
