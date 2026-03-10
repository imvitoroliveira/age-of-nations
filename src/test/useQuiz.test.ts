import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQuiz } from "@/hooks/useQuiz";

// Mock useAppStore
vi.mock("@/store/appStore", () => ({
  useAppStore: () => ({
    recordActivity: vi.fn(),
    activeChildId: "test-child",
  }),
}));

const ITEMS = [
  { name: "Item A" },
  { name: "Item B" },
  { name: "Item C" },
  { name: "Item D" },
  { name: "Item E" },
];

describe("useQuiz", () => {
  it("initializes with a target and options", () => {
    const { result } = renderHook(() =>
      useQuiz({ items: ITEMS, category: "colors" })
    );
    expect(result.current.target).toBeDefined();
    expect(result.current.options.length).toBe(4);
    expect(result.current.feedback).toBeNull();
  });

  it("sets correct feedback on right answer", () => {
    const { result } = renderHook(() =>
      useQuiz({ items: ITEMS, category: "colors" })
    );
    act(() => {
      result.current.handleAnswer(result.current.targetIdx);
    });
    expect(result.current.feedback).toBe("correct");
  });

  it("sets wrong feedback on wrong answer", () => {
    const { result } = renderHook(() =>
      useQuiz({ items: ITEMS, category: "colors" })
    );
    const wrongIdx = result.current.options.find(
      (i) => i !== result.current.targetIdx
    )!;
    act(() => {
      result.current.handleAnswer(wrongIdx);
    });
    expect(result.current.feedback).toBe("wrong");
  });

  it("resets feedback on next", () => {
    const { result } = renderHook(() =>
      useQuiz({ items: ITEMS, category: "colors" })
    );
    act(() => {
      result.current.handleAnswer(result.current.targetIdx);
    });
    expect(result.current.feedback).toBe("correct");
    act(() => {
      result.current.next();
    });
    expect(result.current.feedback).toBeNull();
  });
});
