export type TaskType =
  | "single-choice"
  | "multiple-choice"
  | "short-answer"
  | "fact-check"
  | "contribution";

export type AnswerFormat = "text" | "number" | "mixed";

export type StepStatus = "pending" | "current" | "correct" | "wrong" | "skipped";

export type JourneyPhase =
  | "question"
  | "feedback"
  | "recommendation"
  | "skip-choice"
  | "learn-more"
  | "celebration"
  | "complete";

export interface TaskOption {
  id: string;
  label: string;
}

export interface OdysseyTask {
  id: string;
  type: TaskType;
  topic: string;
  articleSectionId: string;
  articlePassageId?: string;
  instruction: string;
  question: string;
  points: number;
  options?: TaskOption[];
  correctOptionIds?: string[];
  acceptedAnswers?: string[];
  explanation: string;
  impactMessage?: string;
  existingText?: string;
  requiresCitation?: boolean;
  recommendationTopics?: string[];
  answerFormat?: AnswerFormat;
  allowsArticleSelection?: boolean;
  verificationBranches?: Array<"yes" | "no">;
}

export interface TopicModule {
  topic: string;
  articleSectionId: string;
  tasks: [OdysseyTask, OdysseyTask, OdysseyTask];
}

export interface TaskResponse {
  selectedIds: string[];
  selectedPassageId: string;
  selectedText: string;
  text: string;
  verdict: "" | "yes" | "no";
  correction: string;
  citation: string;
}

export interface JourneyState {
  currentStep: number;
  phase: JourneyPhase;
  score: number;
  chancesRemaining: number;
  statuses: StepStatus[];
  responses: Record<string, TaskResponse>;
  selectedTopic?: string;
  started: boolean;
  lastPoints: number;
  identity: "Reader" | "Explorer" | "Fact-checker" | "Contributor";
  lastIdentityPromotion?: "Explorer" | "Fact-checker" | "Contributor";
}
