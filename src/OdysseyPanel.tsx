import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowCounterClockwise,
  ArrowRight,
  BookOpenText,
  Check,
  Circle,
  LinkSimple,
  Lightning,
  Minus,
  Plus,
  Sparkle,
  Trophy,
  UsersThree,
  Question,
  X,
  XCircle,
} from "@phosphor-icons/react";
import { topics } from "./data";
import { canSubmit, isValidAnswerFormat, isValidCitation } from "./journey";
import { AnimatedCount, Badge, Button, PanelTransition, ScoreTicker } from "./OdysseyUi";
import { KnowledgeSpark } from "./DelightAnimation";
import type { JourneyState, OdysseyTask, TaskResponse, StepStatus } from "./types";

interface OdysseyPanelProps {
  isActive: boolean;
  state: JourneyState;
  task: OdysseyTask;
  response: TaskResponse;
  onResponse: (response: TaskResponse) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onSkipLearnMore: () => void;
  onSkipContinue: () => void;
  onNext: () => void;
  onLearnMore: () => void;
  onTopic: (topic: string) => void;
  onReset: () => void;
  onExit: () => void;
}

function StepIcon({ status, number }: { status: StepStatus; number: number }) {
  if (status === "correct") return <Check size={14} weight="bold" />;
  if (status === "wrong") return <X size={14} weight="bold" />;
  if (status === "skipped") return <Minus size={14} weight="bold" />;
  return <span>{number}</span>;
}

export function IntroBenefits({ className = "" }: { className?: string }) {
  return (
    <div className={`intro-benefits ${className}`.trim()}>
      <div><Lightning size={30} weight="duotone" aria-hidden="true" /><span><strong>The World Is Still Writing.</strong><small>50 million pages with citations, and counting. None of them are finished.</small></span></div>
      <div><Sparkle size={30} weight="duotone" aria-hidden="true" /><span><strong>Small Edits. Real Weight.</strong><small>A few minutes of your contribution moves knowledge forward, for everyone.</small></span></div>
      <div><UsersThree size={30} weight="duotone" aria-hidden="true" /><span><strong>Nobody Owns the Truth.</strong><small>That's the whole idea. Help keep it that way. Your opinion matters now more than ever.</small></span></div>
    </div>
  );
}

export function ExperienceCredit({ className = "" }: { className?: string }) {
  return (
    <p className={`experience-credit ${className}`.trim()}>
      Designed by <a href="https://www.ruchit.me" target="_blank" rel="noreferrer">ruchit.me</a> with Codex.
    </p>
  );
}

function IntroCard({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="intro-card" aria-labelledby="intro-title">
      <h1 id="intro-title" className="intro-piece">Introducing Micro Contributions on Wikipedia.</h1>
      <p className="intro-summary intro-piece">A new way designed to help you learn and contribute your dense, rich information on the topics you love.</p>
      <IntroBenefits className="intro-piece" />
      <div className="intro-bottom-actions intro-piece">
        <Button onClick={onBegin}>Start Playing <ArrowRight className="button-arrow" size={16} /></Button>
        <ExperienceCredit />
      </div>
    </div>
  );
}

function ProgressRail({ statuses }: { statuses: StepStatus[] }) {
  const resolved = statuses.filter((status) => status === "correct" || status === "wrong" || status === "skipped").length;
  const progress = Math.min(resolved / (statuses.length - 1), 1);

  return (
    <div className="progress-shell">
      <div className="progress-track" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
      <ol className="progress-rail" aria-label="Odyssey progress">
        {statuses.map((status, index) => (
          <li key={`${index}-${status}`} className={`step-dot ${status}`} aria-label={`Step ${index + 1}: ${status}`} aria-current={status === "current" ? "step" : undefined}>
            <span className="step-dot-status"><StepIcon status={status} number={index + 1} /></span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SelectionIcon({ checked }: { checked: boolean }) {
  return checked
    ? <Check size={20} weight="bold" />
    : <Circle size={20} weight="regular" />;
}

function displayTopic(topic: string) {
  return topic.replace(/\b\w/g, (character) => character.toUpperCase());
}

function ChoiceList({ task, response, onResponse }: Pick<OdysseyPanelProps, "task" | "response" | "onResponse">) {
  const multiple = task.type === "multiple-choice";
  return (
    <fieldset className="choice-list">
      <legend className="sr-only">Choose {multiple ? "one or more answers" : "one answer"}</legend>
      {task.options?.map((option) => {
        const checked = response.selectedIds.includes(option.id);
        return (
          <label className={`choice-row${checked ? " selected" : ""}`} key={option.id}>
            <input
              type={multiple ? "checkbox" : "radio"}
              name={task.id}
              checked={checked}
              onClick={(event) => {
                if (!multiple && checked) {
                  event.preventDefault();
                  onResponse({ ...response, selectedIds: [] });
                }
              }}
              onChange={() => {
                const selectedIds = multiple
                  ? checked
                    ? response.selectedIds.filter((id) => id !== option.id)
                    : [...response.selectedIds, option.id]
                  : checked ? [] : [option.id];
                onResponse({ ...response, selectedIds });
              }}
            />
            <span className="control-mark" aria-hidden="true"><SelectionIcon checked={checked} /></span>
            <span>{option.label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

function SourceGuidanceDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="source-help-trigger" type="button"><Question size={16} weight="bold" /> What makes a source reliable?</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="source-dialog-overlay" />
        <Dialog.Content className="source-dialog" aria-describedby="source-dialog-description">
          <Dialog.Close className="source-dialog-close" aria-label="Close source guidance"><X size={16} /></Dialog.Close>
          <div className="source-dialog-icon"><BookOpenText size={32} weight="duotone" /></div>
          <Dialog.Title>Choose a source readers can trust</Dialog.Title>
          <Dialog.Description id="source-dialog-description">A reliable source is published, directly supports your update, and has a reputation for editorial review or fact-checking.</Dialog.Description>
          <div className="source-examples">
            <section><h3>Good choices</h3><ul><li>Government data and public records</li><li>Peer-reviewed research and academic books</li><li>Established newsrooms with editorial oversight</li></ul></section>
            <section><h3>Avoid</h3><ul><li>Personal blogs and social posts</li><li>User-generated or promotional pages</li><li>Wikipedia itself as the source</li></ul></section>
          </div>
          <a className="source-policy-link" href="https://en.wikipedia.org/wiki/Wikipedia:Reliable_sources" target="_blank" rel="noreferrer">Read Wikipedia's sourcing guidance <ArrowRight size={15} /></a>
          <Dialog.Close asChild><Button>Got It</Button></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CitationField({ value, onChange, disabled = false }: { value: string; onChange: (value: string) => void; disabled?: boolean }) {
  const invalid = value.length > 0 && !isValidCitation(value);
  const errorId = "citation-error";
  return (
    <div className={`field-group${invalid ? " invalid" : ""}`}>
      <label htmlFor="citation-url">Reliable source URL</label>
      <div className="citation-field">
        <LinkSimple size={18} aria-hidden="true" />
        <input
          id="citation-url"
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com/source"
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId : undefined}
          disabled={disabled}
        />
      </div>
      {invalid && <span id={errorId} className="field-error" role="alert">Enter a complete URL beginning with http:// or https://.</span>}
      <SourceGuidanceDialog />
    </div>
  );
}

function QuestionForm({ task, response, onResponse }: Pick<OdysseyPanelProps, "task" | "response" | "onResponse">) {
  const updateFormattedValue = (value: string, key: "text" | "correction") => {
    if (task.answerFormat === "number" && /[A-Za-z]/.test(value)) return;
    if (task.answerFormat === "text" && /\d/.test(value)) return;
    onResponse({ ...response, [key]: value });
  };
  if (task.type === "single-choice" || task.type === "multiple-choice") {
    return <ChoiceList task={task} response={response} onResponse={onResponse} />;
  }

  if (task.type === "short-answer") {
    return (
      <label className="text-field">
        <span>Your answer</span>
        <input
          autoComplete="off"
          value={response.text}
          onChange={(event) => updateFormattedValue(event.target.value, "text")}
          placeholder="Drag-select from the article or type your answer"
          inputMode={task.answerFormat === "number" ? "numeric" : "text"}
          aria-invalid={response.text.length > 0 && !isValidAnswerFormat(response.text, task.answerFormat)}
        />
      </label>
    );
  }

  if (task.type === "fact-check") {
    return (
      <div className="fact-check-form">
        <fieldset className="choice-list compact">
          <legend className="sr-only">Is this information correct?</legend>
          {task.options?.map((option) => {
            const checked = response.verdict === option.id;
            return (
              <label className={`choice-row${checked ? " selected" : ""}`} key={option.id}>
                <input
                  type="radio"
                  name={task.id}
                  checked={checked}
                  onClick={(event) => {
                    if (checked) {
                      event.preventDefault();
                      onResponse({ ...response, verdict: "" });
                    }
                  }}
                  onChange={() => {
                    if (!checked) onResponse({ ...response, verdict: option.id as "yes" | "no" });
                  }}
                />
                <span className="control-mark" aria-hidden="true"><SelectionIcon checked={checked} /></span>
                <span>{option.label}</span>
              </label>
            );
          })}
        </fieldset>
        {response.verdict === "no" && (
          <div className="correction-fields">
            <label className="text-field">
              <span>What is the current information?</span>
              <input
                value={response.correction}
                onChange={(event) => updateFormattedValue(event.target.value, "correction")}
                placeholder={task.answerFormat === "number" ? "Drag-select or enter the current number" : "Drag-select or enter accurate text"}
                inputMode={task.answerFormat === "number" ? "numeric" : "text"}
                aria-invalid={response.correction.length > 0 && !isValidAnswerFormat(response.correction, task.answerFormat)}
              />
            </label>
            <CitationField value={response.citation} onChange={(citation) => onResponse({ ...response, citation })} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="contribution-form">
      {response.selectedText ? (
        <div className="selected-source">
          <span>Your selected article text</span>
          <blockquote>{response.selectedText}</blockquote>
        </div>
      ) : (
        <p className="selection-empty">Drag across any article text on the left to select what you want to update.</p>
      )}
      <label className="text-field">
        <span>Enter updated or more accurate information</span>
        <textarea
          aria-label="Enter updated or more accurate information"
          value={response.text}
          onChange={(event) => onResponse({ ...response, text: event.target.value })}
          placeholder="Write a concise, verifiable update"
          disabled={!response.selectedText}
        />
        <small>{response.text.trim().length} of 25 minimum characters</small>
      </label>
      <CitationField value={response.citation} onChange={(citation) => onResponse({ ...response, citation })} disabled={!response.selectedText} />
    </div>
  );
}

function TopicRecommendations({ selected, onTopic }: { selected?: string; onTopic: (topic: string) => void }) {
  const [open, setOpen] = useState(false);
  const primaryTopics = topics.slice(0, 4);
  const visibleTopics = selected && !primaryTopics.includes(selected) ? [...primaryTopics, selected] : primaryTopics;
  const choose = (topic: string) => {
    onTopic(topic);
    setOpen(false);
  };

  return (
    <div className="recommendation-card">
      <p>Choose a topic for your final Learn, Verify, and Contribute rounds.</p>
      <div className="topic-chips">
        {visibleTopics.map((topic) => (
          <Button key={topic} variant="ghost" className={selected === topic ? "topic-chip selected" : "topic-chip"} aria-pressed={selected === topic} onClick={() => choose(topic)}>
            {displayTopic(topic)}
          </Button>
        ))}
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button variant="ghost" className="topic-chip new-topic"><Plus size={18} /> New Topic</Button>
          </Popover.Trigger>
          <Popover.Portal forceMount>
            <Popover.Content forceMount className="topic-popover" side="top" align="end" sideOffset={8} collisionPadding={12} aria-label="Choose a new topic">
              <span className="popover-label">All Topics</span>
              {topics.map((topic) => (
                <Button key={topic} variant="ghost" className="topic-popover-item" aria-pressed={selected === topic} onClick={() => choose(topic)}>
                  <span>{displayTopic(topic)}</span>
                </Button>
              ))}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}

function FeedbackCard({ state, task, onNext, onLearnMore, onTopic }: Pick<OdysseyPanelProps, "state" | "task" | "onNext" | "onLearnMore" | "onTopic">) {
  const correct = state.statuses[state.currentStep] === "correct";
  const milestone = correct && Boolean(state.lastIdentityPromotion);
  const milestoneTitles = {
    Explorer: "You're an Explorer!",
    "Fact-checker": "You're a Fact-Checker!",
    Contributor: "You're a Contributor!",
    Reader: "Nice Work!",
  } as const;
  const title = correct
    ? milestone
      ? milestoneTitles[state.lastIdentityPromotion ?? state.identity]
      : "Nice Work!"
    : "Almost There. Keep Going!";

  return (
    <div className={`feedback-card ${correct ? "success" : "incorrect"}${milestone ? " milestone" : ""}`} role="status" aria-live="polite">
      <div className="feedback-symbol feedback-piece">
        {correct
          ? <KnowledgeSpark delay={140} fallback={<Check size={58} weight="bold" aria-hidden="true" />} />
          : <XCircle size={46} weight="duotone" aria-hidden="true" />}
      </div>
      {correct && <Badge tone="neutral" className="points-earned feedback-piece"><Lightning size={18} weight="fill" /><ScoreTicker value={state.score} from={Math.max(0, state.score - state.lastPoints)} label={`${state.score} total ${state.score === 1 ? "point" : "points"}`} /></Badge>}
      {!correct && (
        <div className="chance-message feedback-piece">
          <div className="chance-pips" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => <i key={index} className={index < state.chancesRemaining ? "full" : "empty"} />)}
          </div>
          {state.chancesRemaining} chances left. The article section can help with the next one.
        </div>
      )}
      <h2 className="feedback-piece">{title}</h2>
      <p className="feedback-piece">{task.explanation}</p>
      {correct && task.impactMessage && <p className="impact-message feedback-piece">{task.impactMessage}</p>}
      {task.recommendationTopics && <div className="feedback-piece"><TopicRecommendations selected={state.selectedTopic} onTopic={onTopic} /></div>}
      <div className="feedback-actions feedback-piece">
        <Button variant="secondary" onClick={onLearnMore}>Learn More</Button>
        <Button onClick={onNext}>Next Question <ArrowRight className="button-arrow" size={16} /></Button>
      </div>
    </div>
  );
}

function LearnMoreCard({ task, onNext }: { task: OdysseyTask; onNext: () => void }) {
  return (
    <div className="learn-more-card" role="dialog" aria-labelledby="learn-title">
      <div className="learn-icon"><BookOpenText size={48} weight="duotone" aria-hidden="true" /></div>
      <span className="eyebrow">Explore the Source</span>
      <h2 id="learn-title">Look Closer at {displayTopic(task.topic)}</h2>
      <p>The related article passage is highlighted on the left. Read it in context, then continue when you're ready.</p>
      <Button onClick={onNext}>Next Question <ArrowRight className="button-arrow" size={16} /></Button>
    </div>
  );
}

function SkipDecisionCard({ task, onLearnMore, onContinue }: { task: OdysseyTask; onLearnMore: () => void; onContinue: () => void }) {
  return (
    <div className="skip-decision-card" role="dialog" aria-labelledby="skip-title" aria-describedby="skip-description">
      <div className="skip-icon"><BookOpenText size={48} weight="duotone" aria-hidden="true" /></div>
      <span className="eyebrow">Before You Move On</span>
      <h2 id="skip-title">Would You Like to Learn More?</h2>
      <p id="skip-description">Review the related {displayTopic(task.topic)} passage, or continue to the next question.</p>
      <div className="skip-actions">
        <Button autoFocus onClick={onLearnMore}>Learn More</Button>
        <Button variant="secondary" onClick={onContinue}>Continue Playing <ArrowRight className="button-arrow" size={16} /></Button>
      </div>
    </div>
  );
}

function CompletionCard({ state, onReset }: Pick<OdysseyPanelProps, "state" | "onReset">) {
  const correct = state.statuses.filter((status) => status === "correct").length;
  const skipped = state.statuses.filter((status) => status === "skipped").length;
  const contributions = state.statuses.filter((status, index) => status === "correct" && (index === 4 || index === 7)).length;
  return (
    <div className="completion-card" role="status" aria-live="polite">
      <div className="trophy-wrap completion-piece">
        <KnowledgeSpark className="completion-spark" delay={180} fallback={<Trophy size={58} weight="duotone" aria-hidden="true" />} />
      </div>
      <h1 className="completion-piece">This page is viewed by ~5,800 readers daily.</h1>
      <div className="completion-impact completion-piece">
        <p>Small improvements create lasting impact by helping readers access more accurate information every day.</p>
      </div>
      <div className="summary-grid">
        <div><strong><AnimatedCount value={state.score} delay={720} label={`${state.score} ${state.score === 1 ? "point" : "points"}`} /></strong><span>Points</span></div>
        <div><strong><AnimatedCount value={correct} delay={820} label={`${correct} correct ${correct === 1 ? "answer" : "answers"}`} /></strong><span>Correct</span></div>
        <div><strong><AnimatedCount value={contributions} delay={920} label={`${contributions} ${contributions === 1 ? "contribution" : "contributions"}`} /></strong><span>Contributions</span></div>
        <div><strong><AnimatedCount value={skipped} delay={1020} label={`${skipped} skipped ${skipped === 1 ? "question" : "questions"}`} /></strong><span>Skipped</span></div>
      </div>
      <Button className="completion-piece" onClick={onReset}><ArrowCounterClockwise size={16} /> Play Again</Button>
    </div>
  );
}

export function OdysseyPanel(props: OdysseyPanelProps) {
  const { isActive, state, task, response, onResponse, onSubmit, onSkip, onSkipLearnMore, onSkipContinue, onNext, onLearnMore, onTopic, onReset, onExit } = props;
  const [showIntro, setShowIntro] = useState(true);
  const questionPhase = state.phase === "question";
  const atmosphericGlow = state.phase === "complete"
    || state.phase === "learn-more"
    || ((state.phase === "feedback" || state.phase === "celebration") && state.statuses[state.currentStep] === "correct");

  return (
    <aside className={`odyssey-panel${isActive ? " is-active" : ""}${showIntro ? " is-intro" : ""}`} aria-label="WikiPlay" aria-hidden={!isActive} inert={!isActive}>
      <div className="panel-top">
        {showIntro ? <span className="intro-top-title"><img src="/wikiplay-blue.png" alt="" aria-hidden="true" />WikiPlay</span> : <ProgressRail statuses={state.statuses} />}
        <button className="panel-close" type="button" aria-label="Close WikiPlay" onClick={onExit}><X size={16} weight="regular" aria-hidden="true" /></button>
      </div>
      <div className="panel-scroll">
        <PanelTransition phase={showIntro ? "intro" : state.phase} contentKey={showIntro ? "intro" : `${state.currentStep}-${state.phase}-${task.id}-${task.topic}`}>
          {showIntro ? (
            <IntroCard onBegin={() => setShowIntro(false)} />
          ) : state.phase === "complete" ? (
            <CompletionCard state={state} onReset={onReset} />
          ) : state.phase === "feedback" || state.phase === "celebration" ? (
            <FeedbackCard state={state} task={task} onNext={onNext} onLearnMore={onLearnMore} onTopic={onTopic} />
          ) : state.phase === "skip-choice" ? (
            <SkipDecisionCard task={task} onLearnMore={onSkipLearnMore} onContinue={onSkipContinue} />
          ) : state.phase === "learn-more" ? (
            <LearnMoreCard task={task} onNext={onNext} />
          ) : (
            <div className="question-card">
              <p className="task-instruction">{task.instruction}</p>
              <h2>{task.question}</h2>
              <QuestionForm task={task} response={response} onResponse={onResponse} />
              <div className="form-actions">
                <Button disabled={!canSubmit(task, response)} onClick={onSubmit}>Submit</Button>
                <Button variant="secondary" onClick={onSkip}>Skip</Button>
              </div>
            </div>
          )}
        </PanelTransition>
      </div>
      {!showIntro && (
        <footer className="panel-footer">
          <div className="odyssey-name"><img src="/wikiplay-blue.png" alt="" aria-hidden="true" /><span>WikiPlay</span></div>
          <Badge tone="neutral" className="score-pill"><Lightning size={18} weight="fill" /><ScoreTicker value={state.score} label={`${state.score} total ${state.score === 1 ? "point" : "points"}`} /></Badge>
        </footer>
      )}
      <span className="sr-only" role="status" aria-live="polite">Score {state.score}. {state.chancesRemaining} chances remaining.</span>
      {!questionPhase && <div className={`panel-state-wash${atmosphericGlow ? " atmospheric" : ""}`} aria-hidden="true" />}
    </aside>
  );
}
