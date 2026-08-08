import { describe, expect, it } from "vitest";
import { resolveTask, tasks } from "./data";
import {
  advanceJourney,
  canSubmit,
  completeCurrentTask,
  emptyResponse,
  evaluateTask,
  initialJourneyState,
  isValidCitation,
  markCurrentTaskSkipped,
  skipCurrentTask,
} from "./journey";
import type { JourneyState } from "./types";

function stateAtStep(step: number, overrides: Partial<JourneyState> = {}): JourneyState {
  const initial = initialJourneyState();
  return {
    ...initial,
    currentStep: step,
    statuses: initial.statuses.map((_, index) => index === step ? "current" : "pending"),
    ...overrides,
  };
}

describe("Odyssey scoring and progression", () => {
  it("awards task points and promotes a reader after a correct knowledge task", () => {
    const state = completeCurrentTask(initialJourneyState(), tasks[0], true);
    expect(state.score).toBe(1);
    expect(state.identity).toBe("Explorer");
    expect(state.statuses[0]).toBe("correct");
  });

  it("removes one chance without removing points after a wrong answer", () => {
    const state = completeCurrentTask({ ...initialJourneyState(), score: 2 }, tasks[1], false);
    expect(state.score).toBe(2);
    expect(state.chancesRemaining).toBe(4);
    expect(state.statuses[0]).toBe("wrong");
  });

  it("marks a skip as neutral and advances without consuming a chance", () => {
    const state = skipCurrentTask({ ...initialJourneyState(), phase: "skip-choice" });
    expect(state.currentStep).toBe(1);
    expect(state.statuses.slice(0, 2)).toEqual(["skipped", "current"]);
    expect(state.chancesRemaining).toBe(5);
    expect(state.score).toBe(0);
  });

  it("marks a skipped task for learning without advancing yet", () => {
    const state = markCurrentTaskSkipped({ ...initialJourneyState(), phase: "skip-choice" });
    expect(state.currentStep).toBe(0);
    expect(state.statuses[0]).toBe("skipped");
    expect(state.phase).toBe("learn-more");
    expect(state.score).toBe(0);
  });

  it("promotes successful source work to fact-checker and contributor", () => {
    const sourcedVerification = { ...emptyResponse(), verdict: "no" as const, correction: "808,988", citation: "https://www.census.gov/" };
    const factChecker = completeCurrentTask(stateAtStep(3), tasks[3], true, sourcedVerification);
    expect(factChecker.identity).toBe("Fact-checker");
    expect(factChecker.lastIdentityPromotion).toBe("Fact-checker");
    const contributor = completeCurrentTask(advanceJourney(factChecker), tasks[4], true);
    expect(contributor.identity).toBe("Contributor");
    expect(contributor.lastIdentityPromotion).toBe("Contributor");
  });

  it("never repeats or downgrades an earned identity", () => {
    const explorer = completeCurrentTask(initialJourneyState(), tasks[0], true);
    const repeatedKnowledge = completeCurrentTask(advanceJourney(explorer), tasks[1], true);
    expect(repeatedKnowledge.identity).toBe("Explorer");
    expect(repeatedKnowledge.lastIdentityPromotion).toBeUndefined();

    const contributor = completeCurrentTask(stateAtStep(6, { identity: "Contributor" }), tasks[6], true);
    expect(contributor.identity).toBe("Contributor");
    expect(contributor.lastIdentityPromotion).toBeUndefined();
  });

  it("finishes after advancing from the final step", () => {
    expect(advanceJourney({ ...initialJourneyState(), currentStep: 7, phase: "celebration" })).toMatchObject({ phase: "complete" });
  });

  it("awards a resolved task only once", () => {
    const firstResolution = completeCurrentTask(initialJourneyState(), tasks[0], true);
    const duplicateResolution = completeCurrentTask(firstResolution, tasks[0], true);
    expect(firstResolution.score).toBe(1);
    expect(duplicateResolution.score).toBe(1);
    expect(duplicateResolution.lastPoints).toBe(1);
  });

  it("preserves an existing score through wrong answers and both skip paths", () => {
    const scored = { ...initialJourneyState(), score: 7 };
    expect(completeCurrentTask(scored, tasks[0], false).score).toBe(7);
    expect(skipCurrentTask({ ...scored, phase: "skip-choice" }).score).toBe(7);
    expect(markCurrentTaskSkipped({ ...scored, phase: "skip-choice" }).score).toBe(7);
  });

  it("does not double-advance when an action is repeated", () => {
    const feedback = completeCurrentTask(initialJourneyState(), tasks[0], true);
    const advanced = advanceJourney(feedback);
    expect(advanced.currentStep).toBe(1);
    expect(advanceJourney(advanced).currentStep).toBe(1);

    const skipChoice = { ...initialJourneyState(), phase: "skip-choice" as const };
    const skipped = skipCurrentTask(skipChoice);
    expect(skipped.currentStep).toBe(1);
    expect(skipCurrentTask(skipped).currentStep).toBe(1);
  });
});

describe("task validation", () => {
  it("validates single and multiple choice exactly", () => {
    expect(evaluateTask(tasks[0], { ...emptyResponse(), selectedIds: ["earthquake"] })).toBe(true);
    expect(evaluateTask(tasks[1], { ...emptyResponse(), selectedIds: ["bart", "muni", "caltrain"] })).toBe(true);
    expect(evaluateTask(tasks[1], { ...emptyResponse(), selectedIds: ["muni"] })).toBe(false);
  });

  it("normalizes short answers", () => {
    expect(evaluateTask(tasks[2], { ...emptyResponse(), text: "Mt. Davidson" })).toBe(true);
  });

  it("requires a correction and valid citation for a no verdict", () => {
    const incomplete = { ...emptyResponse(), verdict: "no" as const, correction: "808,988" };
    expect(canSubmit(tasks[3], incomplete)).toBe(false);
    const complete = { ...incomplete, citation: "https://www.census.gov/" };
    expect(canSubmit(tasks[3], complete)).toBe(true);
    expect(evaluateTask(tasks[3], complete)).toBe(true);
    expect(evaluateTask(tasks[3], { ...complete, correction: "123,456" })).toBe(true);
  });

  it("accepts either complete verification branch without mis-scoring", () => {
    const yes = { ...emptyResponse(), verdict: "yes" as const };
    expect(canSubmit(tasks[3], yes)).toBe(true);
    expect(evaluateTask(tasks[3], yes)).toBe(true);
    expect(completeCurrentTask(stateAtStep(3), tasks[3], true, yes)).toMatchObject({ score: 4, identity: "Explorer" });

    const no = { ...emptyResponse(), verdict: "no" as const, correction: "808,988", citation: "https://www.census.gov/" };
    expect(completeCurrentTask(stateAtStep(3), tasks[3], true, no)).toMatchObject({ score: 4, identity: "Fact-checker" });
  });

  it("enforces numeric and text response formats", () => {
    expect(canSubmit(tasks[3], { ...emptyResponse(), verdict: "no", correction: "about eight hundred thousand", citation: "https://example.com" })).toBe(false);
    expect(canSubmit(tasks[3], { ...emptyResponse(), verdict: "no", correction: "808,988", citation: "https://example.com" })).toBe(true);
    expect(canSubmit(tasks[2], { ...emptyResponse(), text: "928" })).toBe(false);
  });

  it("requires meaningful contribution copy and an http citation", () => {
    expect(isValidCitation("example.com")).toBe(false);
    const draft = {
      ...emptyResponse(),
      text: "A sufficiently detailed sourced population update.",
      citation: "https://example.com/source",
    };
    expect(canSubmit(tasks[4], draft)).toBe(false);
    expect(canSubmit(tasks[4], {
      ...draft,
      selectedPassageId: "population-statement",
      selectedText: "The 2020 United States census showed San Francisco's population to be 873,965.",
    })).toBe(true);
  });

  it("resolves flexible rounds to a selected topic", () => {
    const moduleTasks = [5, 6, 7].map((step) => resolveTask(step, "Indigenous history"));
    expect(moduleTasks.map((task) => task.type)).toEqual(["single-choice", "fact-check", "contribution"]);
    expect(moduleTasks.every((task) => task.topic === "Indigenous history")).toBe(true);
    expect(moduleTasks.every((task) => task.articlePassageId === "indigenous-history")).toBe(true);
  });

  it("prepares flexible questions for expanded article sections", () => {
    const climate = resolveTask(5, "Climate");
    expect(climate.articlePassageId).toBe("climate-statement");
    expect(climate.correctOptionIds).toEqual(["mediterranean"]);

    const educationContribution = resolveTask(7, "Education");
    expect(educationContribution.articlePassageId).toBe("education-statement");
    expect(educationContribution.question).toMatch(/education/i);
  });
});
