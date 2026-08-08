import type { AnswerFormat, JourneyState, OdysseyTask, TaskResponse } from "./types";

export const emptyResponse = (): TaskResponse => ({
  selectedIds: [],
  selectedPassageId: "",
  selectedText: "",
  text: "",
  verdict: "",
  correction: "",
  citation: "",
});

export const initialJourneyState = (): JourneyState => ({
  currentStep: 0,
  phase: "question",
  score: 0,
  chancesRemaining: 5,
  statuses: ["current", "pending", "pending", "pending", "pending", "pending", "pending", "pending"],
  responses: {},
  started: false,
  lastPoints: 0,
  identity: "Reader",
  lastIdentityPromotion: undefined,
});

const normalize = (value: string) => value.trim().toLowerCase().replace(/[.,]/g, "").replace(/\s+/g, " ");

export function isValidCitation(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidAnswerFormat(value: string, format: AnswerFormat = "mixed") {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (format === "number") return /^[+-]?(?:\$)?\d[\d,]*(?:\.\d+)?(?:%|\s*(?:million|billion|trillion))?$/i.test(trimmed);
  if (format === "text") return /^[\p{L}\s.'’\-–—]+$/u.test(trimmed);
  return true;
}

export function canSubmit(task: OdysseyTask, response: TaskResponse) {
  if (task.type === "single-choice" || task.type === "multiple-choice") {
    return response.selectedIds.length > 0;
  }
  if (task.type === "short-answer") return isValidAnswerFormat(response.text, task.answerFormat);
  if (task.type === "fact-check") {
    if (!response.verdict) return false;
    if (response.verdict === "yes") return true;
    return isValidAnswerFormat(response.correction, task.answerFormat) && isValidCitation(response.citation);
  }
  return response.selectedPassageId.length > 0
    && response.selectedText.trim().length > 0
    && response.text.trim().length >= 25
    && isValidCitation(response.citation);
}

export function evaluateTask(task: OdysseyTask, response: TaskResponse) {
  if (task.type === "single-choice" || task.type === "multiple-choice") {
    const actual = [...response.selectedIds].sort();
    const expected = [...(task.correctOptionIds ?? [])].sort();
    return actual.length === expected.length && actual.every((value, index) => value === expected[index]);
  }
  if (task.type === "short-answer") {
    const actual = normalize(response.text);
    return (task.acceptedAnswers ?? []).some((answer) => normalize(answer) === actual);
  }
  if (task.type === "fact-check") {
    return canSubmit(task, response);
  }
  return response.selectedPassageId.length > 0
    && response.selectedText.trim().length > 0
    && response.text.trim().length >= 25
    && isValidCitation(response.citation);
}

function milestoneIdentity(state: JourneyState, task: OdysseyTask, correct: boolean, response?: TaskResponse): JourneyState["identity"] {
  if (!correct) return state.identity;
  if (state.identity === "Contributor") return "Contributor";
  if (task.type === "contribution") return "Contributor";
  if (state.identity === "Fact-checker") return "Fact-checker";
  if (task.type === "fact-check" && response?.verdict === "no" && isValidCitation(response.citation)) return "Fact-checker";
  return state.identity === "Reader" ? "Explorer" : state.identity;
}

export function completeCurrentTask(state: JourneyState, task: OdysseyTask, correct: boolean, response?: TaskResponse): JourneyState {
  if (state.phase !== "question" || state.statuses[state.currentStep] !== "current") return state;

  const statuses = [...state.statuses];
  statuses[state.currentStep] = correct ? "correct" : "wrong";
  const identity = milestoneIdentity(state, task, correct, response);
  const lastIdentityPromotion = identity !== state.identity && identity !== "Reader" ? identity : undefined;
  const pointsEarned = correct ? task.points : 0;
  return {
    ...state,
    phase: correct ? "celebration" : "feedback",
    statuses,
    score: pointsEarned > 0 ? state.score + pointsEarned : state.score,
    lastPoints: pointsEarned,
    chancesRemaining: correct ? state.chancesRemaining : Math.max(0, state.chancesRemaining - 1),
    identity,
    lastIdentityPromotion,
  };
}

export function skipCurrentTask(state: JourneyState): JourneyState {
  if (state.phase !== "skip-choice" || state.statuses[state.currentStep] !== "current") return state;

  const statuses = [...state.statuses];
  statuses[state.currentStep] = "skipped";
  if (state.currentStep === statuses.length - 1) {
    return { ...state, score: state.score, statuses, phase: "complete", lastPoints: 0, lastIdentityPromotion: undefined };
  }
  statuses[state.currentStep + 1] = "current";
  return { ...state, score: state.score, currentStep: state.currentStep + 1, statuses, phase: "question", lastPoints: 0, lastIdentityPromotion: undefined };
}

export function markCurrentTaskSkipped(state: JourneyState): JourneyState {
  if (state.phase !== "skip-choice" || state.statuses[state.currentStep] !== "current") return state;

  const statuses = [...state.statuses];
  statuses[state.currentStep] = "skipped";
  return { ...state, score: state.score, statuses, phase: "learn-more", lastPoints: 0, lastIdentityPromotion: undefined };
}

export function advanceJourney(state: JourneyState): JourneyState {
  if (state.phase !== "feedback" && state.phase !== "celebration" && state.phase !== "learn-more") return state;
  if (state.currentStep === state.statuses.length - 1) return { ...state, phase: "complete", lastIdentityPromotion: undefined };
  const statuses = [...state.statuses];
  statuses[state.currentStep + 1] = "current";
  return { ...state, currentStep: state.currentStep + 1, statuses, phase: "question", lastPoints: 0, lastIdentityPromotion: undefined };
}
