import { describe, it, expect } from "vitest";
import { formatToSnakeCase } from "../formatToSnakeCase";

describe("formatToSnakeCase", () => {
  it("converts a normal phrase to snake_case", () => {
    expect(formatToSnakeCase("Hello World")).toBe("hello_world");
  });

  it("lowercases all characters", () => {
    expect(formatToSnakeCase("UPPER CASE")).toBe("upper_case");
  });

  it("collapses multiple spaces into a single underscore", () => {
    expect(formatToSnakeCase("too  many   spaces")).toBe("too_many_spaces");
  });

  it("returns empty string for null", () => {
    expect(formatToSnakeCase(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(formatToSnakeCase(undefined)).toBe("");
  });

  it("returns empty string for empty string", () => {
    expect(formatToSnakeCase("")).toBe("");
  });

  it("handles a single word with no spaces", () => {
    expect(formatToSnakeCase("Budget")).toBe("budget");
  });
});
