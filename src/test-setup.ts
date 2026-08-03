import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

vi.mock("lottie-web/build/player/lottie_light", () => ({
  default: { loadAnimation: () => ({ destroy: () => undefined }) },
}));

afterEach(cleanup);

Object.defineProperty(Element.prototype, "scrollIntoView", {
  configurable: true,
  value: () => undefined,
});

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: () => ({ matches: false, addEventListener: () => undefined, removeEventListener: () => undefined }),
});
