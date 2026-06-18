import { describe, it, expect } from "vitest";
import { createPotSchema, updatePotSchema } from "../pot";

const validCreate = {
  name: "Vacation",
  themeId: "theme-1",
  targetAmount: 1000,
};

const validUpdate = {
  name: "Vacation",
  themeId: "theme-1",
  targetAmount: 1000,
  currentAmount: 200,
};

describe("createPotSchema", () => {
  it("accepts valid data without initialAmount", () => {
    expect(() => createPotSchema.parse(validCreate)).not.toThrow();
  });

  it("accepts valid data with initialAmount", () => {
    expect(() =>
      createPotSchema.parse({ ...validCreate, initialAmount: 50 })
    ).not.toThrow();
  });

  it("rejects empty name", () => {
    const result = createPotSchema.safeParse({ ...validCreate, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects zero targetAmount", () => {
    const result = createPotSchema.safeParse({
      ...validCreate,
      targetAmount: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative targetAmount", () => {
    const result = createPotSchema.safeParse({
      ...validCreate,
      targetAmount: -100,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative initialAmount", () => {
    const result = createPotSchema.safeParse({
      ...validCreate,
      initialAmount: -10,
    });
    expect(result.success).toBe(false);
  });
});

describe("updatePotSchema", () => {
  it("accepts valid data", () => {
    expect(() => updatePotSchema.parse(validUpdate)).not.toThrow();
  });

  it("accepts zero currentAmount", () => {
    expect(() =>
      updatePotSchema.parse({ ...validUpdate, currentAmount: 0 })
    ).not.toThrow();
  });

  it("rejects negative currentAmount", () => {
    const result = updatePotSchema.safeParse({
      ...validUpdate,
      currentAmount: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing currentAmount", () => {
    const result = updatePotSchema.safeParse({
      name: validUpdate.name,
      themeId: validUpdate.themeId,
      targetAmount: validUpdate.targetAmount,
    });
    expect(result.success).toBe(false);
  });
});
