import { describe, it, expect } from "vitest";
import { getOrdinalSuffix } from "../getOrdinalSuffix";

describe("getOrdinalSuffix", () => {
  it('returns "st" for 1', () => {
    expect(getOrdinalSuffix("1")).toBe("1st");
  });

  it('returns "nd" for 2', () => {
    expect(getOrdinalSuffix("2")).toBe("2nd");
  });

  it('returns "rd" for 3', () => {
    expect(getOrdinalSuffix("3")).toBe("3rd");
  });

  it('returns "th" for 4 through 10', () => {
    expect(getOrdinalSuffix("4")).toBe("4th");
    expect(getOrdinalSuffix("10")).toBe("10th");
  });

  it('returns "th" for 11, 12, and 13 (exceptions)', () => {
    expect(getOrdinalSuffix("11")).toBe("11th");
    expect(getOrdinalSuffix("12")).toBe("12th");
    expect(getOrdinalSuffix("13")).toBe("13th");
  });

  it('returns "st" for 21', () => {
    expect(getOrdinalSuffix("21")).toBe("21st");
  });

  it('returns "nd" for 22', () => {
    expect(getOrdinalSuffix("22")).toBe("22nd");
  });

  it('returns "rd" for 23', () => {
    expect(getOrdinalSuffix("23")).toBe("23rd");
  });

  it('returns "th" for 31', () => {
    expect(getOrdinalSuffix("31")).toBe("31st");
  });
});
