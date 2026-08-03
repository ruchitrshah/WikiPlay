import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AnimatedCount, Badge, Button, ScoreTicker } from "./OdysseyUi";

describe("Odyssey UI primitives", () => {
  it("renders button variants and preserves disabled behavior", () => {
    const onClick = vi.fn();
    render(
      <>
        <Button onClick={onClick}>Continue</Button>
        <Button variant="secondary" disabled onClick={onClick}>Unavailable</Button>
        <Button variant="ghost">Topic</Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Continue" })).toHaveClass("primary");
    expect(screen.getByRole("button", { name: "Unavailable" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Topic" })).toHaveClass("ghost");
    fireEvent.click(screen.getByRole("button", { name: "Unavailable" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders semantic badge tones and tabular score content", () => {
    render(<><Badge tone="success">Verified</Badge><ScoreTicker value={8} /></>);
    expect(screen.getByText("Verified")).toHaveClass("success");
    expect(screen.getByText("8").closest(".score-tick")).toHaveClass("score-tick");
    expect(screen.getByText("8 points")).toHaveClass("sr-only");
  });

  it("starts count-up values at zero while exposing the final value accessibly", () => {
    render(<AnimatedCount value={7} delay={45} label="7 skipped questions" />);
    expect(screen.getByText("0")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByLabelText("7 skipped questions")).toHaveClass("animated-count");
  });

  it("shows the final count immediately under reduced motion", () => {
    const matchMedia = vi.spyOn(window, "matchMedia").mockImplementation(() => ({
      matches: true,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }) as unknown as MediaQueryList);

    render(<AnimatedCount value={4} label="4 correct answers" />);
    expect(screen.getByText("4", { selector: "span[aria-hidden='true']" })).toBeInTheDocument();
    matchMedia.mockRestore();
  });
});
