import { describe, it, expect } from "vitest";
import { formatToDollar } from "../formatToDollar";

describe("formatToDollar", () => {
  it("formats a positive integer", () => {
    expect(formatToDollar(1000)).toBe("$1,000.00");
  });

  it("formats a decimal amount", () => {
    expect(formatToDollar(9.99)).toBe("$9.99");
  });

  it("formats zero", () => {
    expect(formatToDollar(0)).toBe("$0.00");
  });

  it("formats a negative amount", () => {
    expect(formatToDollar(-250.5)).toBe("-$250.50");
  });

  it("formats large amounts with thousands separator", () => {
    expect(formatToDollar(1234567.89)).toBe("$1,234,567.89");
  });
});
