import { describe, it, expect } from "vitest";
import { generateMathProblem } from "@/data/educationData";

describe("generateMathProblem", () => {
  it("generates easy problems with addition only and small numbers", () => {
    for (let i = 0; i < 20; i++) {
      const p = generateMathProblem("easy");
      expect(p.operator).toBe("+");
      expect(p.a).toBeGreaterThanOrEqual(1);
      expect(p.a).toBeLessThanOrEqual(5);
      expect(p.b).toBeGreaterThanOrEqual(1);
      expect(p.b).toBeLessThanOrEqual(5);
      expect(p.answer).toBe(p.a + p.b);
      expect(p.options).toContain(p.answer);
      expect(p.options.length).toBe(4);
    }
  });

  it("generates medium problems with valid answers", () => {
    for (let i = 0; i < 20; i++) {
      const p = generateMathProblem("medium");
      expect(["+", "-"]).toContain(p.operator);
      const expected = p.operator === "+" ? p.a + p.b : p.a - p.b;
      expect(p.answer).toBe(expected);
      expect(p.answer).toBeGreaterThanOrEqual(0);
      expect(p.options).toContain(p.answer);
    }
  });

  it("generates hard problems with valid answers", () => {
    for (let i = 0; i < 20; i++) {
      const p = generateMathProblem("hard");
      const expected = p.operator === "+" ? p.a + p.b : p.a - p.b;
      expect(p.answer).toBe(expected);
      expect(p.answer).toBeGreaterThanOrEqual(0);
    }
  });

  it("always has 4 unique options", () => {
    for (let i = 0; i < 50; i++) {
      const p = generateMathProblem("easy");
      const unique = new Set(p.options);
      expect(unique.size).toBe(4);
    }
  });
});
