import axe from "axe-core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";

afterEach(cleanup);

async function expectNoAccessibilityViolations() {
  const result = await axe.run(document.body, {
    rules: { "color-contrast": { enabled: false } },
  });
  expect(result.violations.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
}

function skipAndContinue() {
  fireEvent.click(screen.getByRole("button", { name: "Skip" }));
  fireEvent.click(screen.getByRole("button", { name: /continue playing/i }));
}

function startGuidedRounds() {
  fireEvent.click(screen.getByRole("button", { name: /start wikiplay/i }));
  fireEvent.click(screen.getByRole("button", { name: /start playing/i }));
}

describe("WikiPlay accessibility", () => {
  it("has no automated semantic violations in the invitation", async () => {
    render(<App />);
    await expectNoAccessibilityViolations();
  });

  it("has no automated semantic violations in the question rail", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /start wikiplay/i }));
    await expectNoAccessibilityViolations();
  });

  it("keeps sourced form fields programmatically labeled", async () => {
    render(<App />);
    startGuidedRounds();
    skipAndContinue();
    skipAndContinue();
    skipAndContinue();
    fireEvent.click(screen.getByLabelText("No"));

    expect(screen.getByLabelText("What is the current information?")).toBeInTheDocument();
    expect(screen.getByLabelText("Reliable source URL")).toBeInTheDocument();
    await expectNoAccessibilityViolations();
  });
});
