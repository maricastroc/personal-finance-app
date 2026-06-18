import { describe, it, expect } from "vitest";
import {
  updateRecurringBillSchema,
  payRecurringBillSchema,
} from "../recurringBill";

describe("updateRecurringBillSchema", () => {
  it("accepts a positive amount", () => {
    expect(() =>
      updateRecurringBillSchema.parse({ amount: 99.99 })
    ).not.toThrow();
  });

  it("rejects zero amount", () => {
    const result = updateRecurringBillSchema.safeParse({ amount: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects negative amount", () => {
    const result = updateRecurringBillSchema.safeParse({ amount: -50 });
    expect(result.success).toBe(false);
  });

  it("rejects missing amount", () => {
    const result = updateRecurringBillSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("payRecurringBillSchema", () => {
  it("accepts an optional paymentDate", () => {
    expect(() =>
      payRecurringBillSchema.parse({ paymentDate: "2024-06-01" })
    ).not.toThrow();
  });

  it("accepts an empty object (paymentDate is optional)", () => {
    expect(() => payRecurringBillSchema.parse({})).not.toThrow();
  });
});
