import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { App } from "./App";

function dragSelectArticleText(element: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  fireEvent.mouseUp(element.closest(".wiki-article") ?? element);
}

function startWikiPlay() {
  fireEvent.click(screen.getByRole("button", { name: /start wikiplay/i }));
  fireEvent.click(screen.getByRole("button", { name: /start playing/i }));
}

describe("Wikipedia Odyssey", () => {
  it("introduces WikiPlay's value before showing the first task", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /start wikiplay/i }));

    expect(screen.getByRole("heading", { name: /introducing micro contributions on wikipedia/i })).toBeInTheDocument();
    expect(screen.getByText(/the world is still writing/i)).toBeInTheDocument();
    expect(screen.getByText(/small edits\. real weight/i)).toBeInTheDocument();
    expect(screen.queryByText(/what natural disaster struck/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /start playing/i }));
    expect(screen.getByText(/what natural disaster struck/i)).toBeInTheDocument();
  });

  it("opens from the discovery nudge and enables submit after a choice", () => {
    render(<App />);
    startWikiPlay();
    const submit = screen.getByRole("button", { name: "Submit" });
    expect(submit).toBeDisabled();
    fireEvent.click(screen.getByLabelText("Earthquake and fire"));
    expect(submit).toBeEnabled();
  });

  it("opens WikiPlay by revealing the right rail", () => {
    render(<App />);
    const panel = document.querySelector<HTMLElement>(".odyssey-panel");
    expect(screen.getByRole("button", { name: "WikiPlay", exact: true })).toBeInTheDocument();
    expect(panel).toHaveAttribute("aria-hidden", "true");
    startWikiPlay();

    expect(document.querySelector(".app-shell")).toHaveClass("is-started");
    expect(screen.getByRole("complementary", { name: "WikiPlay" })).toBe(panel);
    expect(panel).toHaveAttribute("aria-hidden", "false");
    expect(panel).toHaveClass("is-active");
  });

  it("clears a selected single-choice answer when it is activated again", () => {
    render(<App />);
    startWikiPlay();
    const answer = screen.getByLabelText("Earthquake and fire");
    const submit = screen.getByRole("button", { name: "Submit" });

    fireEvent.click(answer);
    expect(answer).toBeChecked();
    expect(submit).toBeEnabled();
    fireEvent.click(answer);
    expect(answer).not.toBeChecked();
    expect(submit).toBeDisabled();
  });

  it("keeps multiple-choice answers independently toggleable", () => {
    render(<App />);
    startWikiPlay();
    fireEvent.click(screen.getByRole("button", { name: "Skip" }));
    fireEvent.click(screen.getByRole("button", { name: /continue playing/i }));
    const muni = screen.getByLabelText("Muni");
    const bart = screen.getByLabelText("BART");

    fireEvent.click(muni);
    fireEvent.click(bart);
    expect(muni).toBeChecked();
    expect(bart).toBeChecked();
    fireEvent.click(muni);
    expect(muni).not.toBeChecked();
    expect(bart).toBeChecked();
  });

  it("shows learning feedback and reduces chances after a wrong answer", () => {
    render(<App />);
    startWikiPlay();
    fireEvent.click(screen.getByLabelText("Hurricane"));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByText(/almost there\. keep going/i)).toBeInTheDocument();
    expect(screen.getByText(/4 chances left\. the article section can help/i)).toBeInTheDocument();
  });

  it("shows earned points in feedback and cumulative points in the footer", () => {
    render(<App />);
    startWikiPlay();
    fireEvent.click(screen.getByLabelText("Earthquake and fire"));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(within(document.querySelector(".points-earned") as HTMLElement).getByText("1 total point")).toBeInTheDocument();
    expect(document.querySelector(".points-earned")).toHaveTextContent("1");
    expect(document.querySelector(".points-earned")).not.toHaveTextContent("+");
    expect(within(document.querySelector(".score-pill") as HTMLElement).getByText("1 total point")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next Question" }));
    fireEvent.click(screen.getByLabelText("Caltrain"));
    fireEvent.click(screen.getByLabelText("Muni"));
    fireEvent.click(screen.getByLabelText("BART"));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(within(document.querySelector(".points-earned") as HTMLElement).getByText("3 total points")).toBeInTheDocument();
    expect(within(document.querySelector(".score-pill") as HTMLElement).getByText("3 total points")).toBeInTheDocument();
  });

  it("can skip and move to the multiple-choice step", () => {
    render(<App />);
    startWikiPlay();
    fireEvent.click(screen.getByRole("button", { name: "Skip" }));
    expect(screen.getByRole("dialog", { name: /would you like to learn more/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /continue playing/i }));
    expect(screen.getByText(/choose every answer supported/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Step 1: skipped")).toBeInTheDocument();
  });

  it("can learn from a skipped question before continuing", () => {
    render(<App />);
    startWikiPlay();
    fireEvent.click(screen.getByRole("button", { name: "Skip" }));
    fireEvent.click(screen.getByRole("button", { name: "Learn More" }));
    expect(screen.getByRole("dialog", { name: /look closer at history/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Step 1: skipped")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next Question" }));
    expect(screen.getByText(/choose every answer supported/i)).toBeInTheDocument();
  });

  it("only highlights an article passage after Learn More is chosen", () => {
    render(<App />);
    startWikiPlay();
    const passage = document.getElementById("history-earthquake");
    expect(passage).not.toHaveClass("is-highlighted");

    fireEvent.click(screen.getByRole("button", { name: "Skip" }));
    expect(passage).not.toHaveClass("is-highlighted");
    fireEvent.click(screen.getByRole("button", { name: "Learn More" }));
    expect(passage).toHaveClass("is-highlighted");
  });

  it("prefills any dragged article text before accepting a sourced replacement", () => {
    render(<App />);
    startWikiPlay();
    for (let step = 0; step < 4; step += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Skip" }));
      fireEvent.click(screen.getByRole("button", { name: /continue playing/i }));
    }

    const replacement = screen.getByLabelText("Enter updated or more accurate information");
    const citation = screen.getByLabelText("Reliable source URL");
    const submit = screen.getByRole("button", { name: "Submit" });
    expect(replacement).toBeDisabled();
    expect(citation).toBeDisabled();
    expect(submit).toBeDisabled();

    const selectedLine = screen.getByText("More recent estimates indicate that the city's population has since changed.");
    expect(selectedLine).not.toHaveClass("is-highlighted");
    dragSelectArticleText(selectedLine);
    expect(document.querySelector(".selected-source blockquote")).toHaveTextContent("More recent estimates indicate that the city's population has since changed.");
    expect(replacement).toBeEnabled();
    expect(citation).toBeEnabled();

    fireEvent.change(replacement, { target: { value: "A newer official estimate lists the population as 808,988 residents." } });
    fireEvent.change(citation, { target: { value: "https://www.census.gov/quickfacts/" } });
    expect(submit).toBeEnabled();
    fireEvent.click(submit);
    expect(screen.getByRole("heading", { name: /contributor/i })).toBeInTheDocument();
  });

  it("resets an unfinished replacement when a different article selection is dragged", () => {
    render(<App />);
    startWikiPlay();
    for (let step = 0; step < 4; step += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Skip" }));
      fireEvent.click(screen.getByRole("button", { name: /continue playing/i }));
    }

    const firstLine = screen.getByText("More recent estimates indicate that the city's population has since changed.");
    dragSelectArticleText(firstLine);
    fireEvent.change(screen.getByLabelText("Enter updated or more accurate information"), { target: { value: "A detailed replacement that is long enough to submit." } });
    fireEvent.change(screen.getByLabelText("Reliable source URL"), { target: { value: "https://example.com/source" } });

    const secondLine = document.getElementById("race-statement");
    expect(secondLine).not.toBeNull();
    dragSelectArticleText(secondLine as HTMLElement);
    expect(screen.getByLabelText("Enter updated or more accurate information")).toHaveValue("");
    expect(screen.getByLabelText("Reliable source URL")).toHaveValue("");
    expect(document.querySelector(".selected-source blockquote")).toHaveTextContent("As of the 2020 census");
  });

  it("keeps semantic inputs behind the round selection controls", () => {
    render(<App />);
    startWikiPlay();
    expect(screen.getAllByRole("radio")).toHaveLength(4);

    fireEvent.click(screen.getByRole("button", { name: "Skip" }));
    fireEvent.click(screen.getByRole("button", { name: /continue playing/i }));
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
  });

  it("fills a short-answer input from dragged article text", () => {
    render(<App />);
    startWikiPlay();
    for (let step = 0; step < 2; step += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Skip" }));
      fireEvent.click(screen.getByRole("button", { name: /continue playing/i }));
    }

    dragSelectArticleText(screen.getByText("Mount Davidson"));
    expect(screen.getByLabelText("Your answer")).toHaveValue("Mount Davidson");
    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled();
  });

  it("fills a visible fact-check correction from dragged article text", () => {
    render(<App />);
    startWikiPlay();
    for (let step = 0; step < 3; step += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Skip" }));
      fireEvent.click(screen.getByRole("button", { name: /continue playing/i }));
    }

    fireEvent.click(screen.getByLabelText("No"));
    const currentEstimate = document.querySelector(".population-table div:last-child span:last-child");
    expect(currentEstimate).not.toBeNull();
    dragSelectArticleText(currentEstimate as HTMLElement);
    expect(screen.getByLabelText("What is the current information?")).toHaveValue("808,988");
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Reliable source URL"), { target: { value: "https://www.census.gov/quickfacts/" } });
    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled();
  });

  it("awards fact-check points for a Yes verdict without requiring a source", () => {
    render(<App />);
    startWikiPlay();
    for (let step = 0; step < 3; step += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Skip" }));
      fireEvent.click(screen.getByRole("button", { name: /continue playing/i }));
    }

    fireEvent.click(screen.getByLabelText("Yes"));
    expect(screen.queryByLabelText("Reliable source URL")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(within(document.querySelector(".score-pill") as HTMLElement).getByText("4 total points")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /explorer/i })).toBeInTheDocument();
  });

  it("explains reliable sources in a keyboard-dismissible dialog", async () => {
    render(<App />);
    startWikiPlay();
    for (let step = 0; step < 3; step += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Skip" }));
      fireEvent.click(screen.getByRole("button", { name: /continue playing/i }));
    }

    fireEvent.click(screen.getByLabelText("No"));
    const trigger = screen.getByRole("button", { name: /what makes a source reliable/i });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: /choose a source readers can trust/i })).toBeInTheDocument();
    expect(screen.getByText(/government data and public records/i)).toBeInTheDocument();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("clears a selected fact-check verdict without erasing its draft", () => {
    render(<App />);
    startWikiPlay();
    for (let step = 0; step < 3; step += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Skip" }));
      fireEvent.click(screen.getByRole("button", { name: /continue playing/i }));
    }

    const no = screen.getByLabelText("No");
    fireEvent.click(no);
    fireEvent.change(screen.getByLabelText("What is the current information?"), { target: { value: "808,988" } });
    fireEvent.click(no);
    expect(no).not.toBeChecked();
    expect(screen.queryByLabelText("What is the current information?")).not.toBeInTheDocument();
    fireEvent.click(no);
    expect(screen.getByLabelText("What is the current information?")).toHaveValue("808,988");
  });

  it("presents concise completion copy and accessible final statistics", () => {
    render(<App />);
    startWikiPlay();
    const panel = screen.getByRole("complementary", { name: "WikiPlay" });
    const panelQueries = within(panel);
    for (let step = 0; step < 8; step += 1) {
      fireEvent.click(panelQueries.getByRole("button", { name: "Skip" }));
      fireEvent.click(panelQueries.getByRole("button", { name: /continue playing/i }));
    }

    expect(screen.getByRole("heading", { name: "This page is viewed by ~5,800 readers daily." })).toBeInTheDocument();
    expect(screen.getByText("Small improvements create lasting impact by helping readers access more accurate information every day.")).toBeInTheDocument();
    expect(screen.queryByText("You Made Knowledge Better.")).not.toBeInTheDocument();
    expect(screen.queryByText(/that means more accurate information/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText("8 skipped questions")).toHaveClass("animated-count");
    expect(document.querySelectorAll(".summary-grid .animated-count > span[aria-hidden='true']")).toHaveLength(4);
  });

  it("opens the Radix topic picker and closes it on Escape", () => {
    render(<App />);
    startWikiPlay();
    fireEvent.click(screen.getByLabelText("Hurricane"));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    const trigger = screen.getByRole("button", { name: /new topic/i });
    fireEvent.click(trigger);
    const picker = screen.getByRole("dialog", { name: /choose a new topic/i });
    expect(picker).toBeVisible();

    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(picker).toHaveAttribute("data-state", "closed");
  });

  it("selects a topic from the Radix popover and closes it", () => {
    render(<App />);
    startWikiPlay();
    fireEvent.click(screen.getByLabelText("Hurricane"));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    fireEvent.click(screen.getByRole("button", { name: /new topic/i }));

    const picker = screen.getByRole("dialog", { name: /choose a new topic/i });
    fireEvent.click(within(picker).getByRole("button", { name: "Economy" }));
    const selectedTopic = document.querySelector(".topic-chip.selected");
    expect(selectedTopic).toHaveTextContent("Economy");
    expect(selectedTopic).toHaveAttribute("aria-pressed", "true");
    expect(picker).toHaveAttribute("data-state", "closed");
  });

  it("makes each visible topic option interactive and confirms the selected module", () => {
    render(<App />);
    startWikiPlay();
    fireEvent.click(screen.getByLabelText("Earthquake and fire"));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    const recommendation = screen.getByText(/choose a topic for your final learn/i).closest(".recommendation-card") as HTMLElement;
    const geography = within(recommendation).getByRole("button", { name: "Geography" });
    fireEvent.click(geography);

    expect(geography).toHaveAttribute("aria-pressed", "true");
  });

  it("shows topic recommendations only after an answer is submitted", () => {
    render(<App />);
    startWikiPlay();
    expect(screen.queryByText(/choose a topic for your final/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Hurricane"));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByText(/choose a topic for your final learn, verify, and contribute rounds/i)).toBeInTheDocument();
  });

  it("dismisses the invitation and returns focus to the Wikipedia header launcher", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /dismiss wikiplay invitation/i }));
    expect(screen.queryByText(/turn what you know/i)).not.toBeInTheDocument();
    const launcher = screen.getByRole("button", { name: "WikiPlay", exact: true });
    await waitFor(() => expect(launcher).toHaveFocus());
    fireEvent.click(launcher);
    expect(screen.getByRole("complementary", { name: "WikiPlay" })).toBeInTheDocument();
  });

  it("closes and resumes WikiPlay without resetting progress", async () => {
    render(<App />);
    startWikiPlay();
    fireEvent.click(screen.getByLabelText("Earthquake and fire"));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    fireEvent.click(screen.getByRole("button", { name: /close wikiplay/i }));
    const launcher = screen.getByRole("button", { name: "WikiPlay", exact: true });
    await waitFor(() => expect(launcher).toHaveFocus());
    fireEvent.click(launcher);
    expect(screen.getByText(/score 1\. 5 chances remaining/i)).toBeInTheDocument();
  });

  it("shows the shared value story and an autoplaying ambient video on phones", () => {
    const matchMedia = vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(max-width: 767px)",
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => true,
    }));
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /start wikiplay/i }));

    expect(screen.queryByRole("complementary", { name: "WikiPlay" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /introducing micro contributions on wikipedia/i })).toBeInTheDocument();
    expect(screen.getByLabelText("WikiPlay")).toBeInTheDocument();
    expect(screen.queryByText(/wikiplay for the web/i)).not.toBeInTheDocument();
    expect(screen.getByText("The World Is Still Writing.")).toBeInTheDocument();
    expect(screen.getByText("Small Edits. Real Weight.")).toBeInTheDocument();
    expect(screen.getByText("Nobody Owns the Truth.")).toBeInTheDocument();
    expect(screen.getByText(/50 million pages with citations/i)).toBeInTheDocument();
    expect(screen.getByText(/Designed by/i)).toBeInTheDocument();
    expect(screen.queryByText(/contact for more information/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ruchit.me" })).toHaveAttribute("href", "https://www.ruchit.me");
    const video = screen.getByLabelText("WikiPlay experience overview");
    expect(video).toHaveAttribute("autoplay");
    expect(video).toHaveProperty("muted", true);
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
    expect(video).not.toHaveAttribute("controls");
    expect(video).toHaveAttribute("controlslist", "nodownload nofullscreen noremoteplayback");
    expect(screen.getByRole("button", { name: /available on tablet and desktop/i })).toBeDisabled();
    expect(screen.getByText("Web-Only Experience")).toBeInTheDocument();
    matchMedia.mockRestore();
  });
});
