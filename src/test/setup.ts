import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock speechSynthesis
Object.defineProperty(window, "speechSynthesis", {
  writable: true,
  value: {
    cancel: () => {},
    speak: () => {},
    getVoices: () => [],
  },
});
