import { describe, it, expect } from "vitest";
import { calculateTotalPages } from "../calculateTotalPages";

describe("calculateTotalPages", () => {
  it("returns 1 when total records equals the limit", () => {
    expect(calculateTotalPages(10, 10)).toBe(1);
  });

  it("rounds up when records do not divide evenly", () => {
    expect(calculateTotalPages(11, 10)).toBe(2);
    expect(calculateTotalPages(1, 10)).toBe(1);
    expect(calculateTotalPages(21, 10)).toBe(3);
  });

  it("returns 0 when there are no records", () => {
    expect(calculateTotalPages(0, 10)).toBe(0);
  });

  it("handles page size of 1", () => {
    expect(calculateTotalPages(5, 1)).toBe(5);
  });
});
