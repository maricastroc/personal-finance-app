import { describe, it, expect } from "vitest";
import { capitalizeFirstLetter } from "../capitalizeFirstLetter";

describe("capitalizeFirstLetter", () => {
  it("capitalizes the first letter and lowercases the rest", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
    expect(capitalizeFirstLetter("HELLO")).toBe("Hello");
    expect(capitalizeFirstLetter("hELLO")).toBe("Hello");
  });

  it("returns the same string if already correctly capitalized", () => {
    expect(capitalizeFirstLetter("Hello")).toBe("Hello");
  });

  it("returns undefined for undefined input", () => {
    expect(capitalizeFirstLetter(undefined)).toBeUndefined();
  });

  it("handles a single character", () => {
    expect(capitalizeFirstLetter("a")).toBe("A");
  });

  it("handles an empty string", () => {
    expect(capitalizeFirstLetter("")).toBe("");
  });
});
