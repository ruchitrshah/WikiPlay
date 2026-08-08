import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Lightning, Sparkle, X } from "@phosphor-icons/react";
import { ArticleSurface } from "./ArticleSurface";
import { resolveTask } from "./data";
import {
  advanceJourney,
  completeCurrentTask,
  emptyResponse,
  evaluateTask,
  initialJourneyState,
  markCurrentTaskSkipped,
  skipCurrentTask,
} from "./journey";
import { OdysseyPanel } from "./OdysseyPanel";
import { Button } from "./OdysseyUi";
import type { TaskResponse } from "./types";

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function usePhoneLayout() {
  const query = "(max-width: 767px)";
  const [matches, setMatches] = useState(() => window.matchMedia?.(query).matches ?? false);

  useEffect(() => {
    const media = window.matchMedia?.(query);
    if (!media) return;
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  return matches;
}

function focusAfterRender(selector: string) {
  window.setTimeout(() => document.querySelector<HTMLElement>(selector)?.focus(), 0);
}

export function App() {
  const [state, setState] = useState(initialJourneyState);
  const [showInvitation, setShowInvitation] = useState(true);
  const isPhone = usePhoneLayout();
  const wasStarted = useRef(state.started);
  const task = useMemo(() => resolveTask(state.currentStep, state.selectedTopic), [state.currentStep, state.selectedTopic]);
  const response = state.responses[task.id] ?? emptyResponse();
  const acceptsArticleSelection = state.started && state.phase === "question" && (
    task.type === "short-answer"
    || task.type === "contribution"
    || (task.type === "fact-check" && response.verdict === "no")
  );

  const navigateArticle = (sectionId: string, passageId?: string) => {
    const target = document.getElementById(passageId ?? sectionId);
    target?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
  };

  useEffect(() => {
    if (!state.started) {
      wasStarted.current = false;
      return;
    }
    if (!wasStarted.current) {
      wasStarted.current = true;
      return;
    }
    if (state.phase === "complete") return;
    const timeout = window.setTimeout(() => navigateArticle(task.articleSectionId, task.articlePassageId), 80);
    return () => window.clearTimeout(timeout);
  }, [state.started, state.currentStep, state.selectedTopic, state.phase, task.articleSectionId, task.articlePassageId]);

  const updateResponse = (nextResponse: TaskResponse) => {
    setState((current) => ({
      ...current,
      responses: { ...current.responses, [task.id]: nextResponse },
    }));
  };

  const submit = () => {
    const correct = evaluateTask(task, response);
    setState((current) => completeCurrentTask(current, task, correct, response));
  };

  const chooseTopic = (selectedTopic: string) => {
    setState((current) => ({ ...current, selectedTopic }));
    const selectedTask = resolveTask(state.currentStep, selectedTopic);
    navigateArticle(selectedTask.articleSectionId, selectedTask.articlePassageId);
  };

  const start = () => {
    setShowInvitation(false);
    setState((current) => ({ ...current, started: true }));
    focusAfterRender(".panel-close");
  };
  const dismissInvitation = () => {
    setShowInvitation(false);
    focusAfterRender(".wiki-play-launcher");
  };
  const exit = () => {
    setShowInvitation(false);
    setState((current) => ({ ...current, started: false }));
    focusAfterRender(".wiki-play-launcher");
  };
  const reset = () => setState({ ...initialJourneyState(), started: true });

  return (
    <main className={`app-shell${state.started ? " is-started" : ""}`}>
      <ArticleSurface
        activePassage={state.started && state.phase === "learn-more" ? task.articlePassageId : undefined}
        selectionEnabled={acceptsArticleSelection}
        onSelectArticleText={(passageId, selectedText) => {
          if (task.type === "short-answer") {
            updateResponse({ ...response, text: selectedText });
            return;
          }
          if (task.type === "fact-check") {
            updateResponse({ ...response, correction: selectedText });
            return;
          }
          updateResponse({
            ...response,
            selectedPassageId: passageId,
            selectedText,
            text: response.selectedText === selectedText ? response.text : "",
            citation: response.selectedText === selectedText ? response.citation : "",
          });
        }}
        onNavigate={navigateArticle}
        onOpenWikiPlay={start}
        showWikiPlayLauncher={!state.started}
      />

      {!state.started && showInvitation && (
        <aside className="discovery-nudge" aria-labelledby="discovery-title">
          <div className="nudge-header nudge-piece">
            <h2 id="discovery-title">Turn what you know into better knowledge with WikiPlay.</h2>
            <button className="nudge-dismiss" type="button" aria-label="Dismiss WikiPlay invitation" onClick={dismissInvitation}>
              <X size={16} weight="regular" aria-hidden="true" />
            </button>
          </div>
          <p className="nudge-piece">Answer quick questions, verify sources, and make small contributions as you read.</p>
          <div className="nudge-meta nudge-piece"><span><Lightning size={18} weight="fill" /> Earn Points</span><span><Sparkle size={18} weight="fill" /> Help Readers</span></div>
          <Button className="nudge-piece" onClick={start}>Start WikiPlay <ArrowRight className="button-arrow" size={18} /></Button>
        </aside>
      )}

      {!isPhone && <OdysseyPanel
        isActive={state.started}
        state={state}
        task={task}
        response={response}
        onResponse={updateResponse}
        onSubmit={submit}
        onSkip={() => setState((current) => ({ ...current, phase: "skip-choice" }))}
        onSkipLearnMore={() => setState((current) => markCurrentTaskSkipped(current))}
        onSkipContinue={() => setState((current) => skipCurrentTask(current))}
        onNext={() => setState((current) => advanceJourney(current))}
        onLearnMore={() => setState((current) => ({ ...current, phase: "learn-more" }))}
        onTopic={chooseTopic}
        onReset={reset}
        onExit={exit}
      />}

      {state.started && isPhone && (
        <section className="mobile-wikiplay" aria-labelledby="mobile-wikiplay-title">
          <button className="mobile-wikiplay-close" type="button" aria-label="Close WikiPlay" onClick={exit}><X size={18} /></button>
          <img className="mobile-wikiplay-mark" src="/wikiplay-blue.png" alt="" aria-hidden="true" />
          <span className="mobile-eyebrow">WikiPlay for the web</span>
          <h1 id="mobile-wikiplay-title">Turn reading into small, meaningful contributions.</h1>
          <p>WikiPlay helps you learn from an article, verify claims, and draft sourced updates through eight guided rounds.</p>
          <div className="mobile-video-shell">
            <video controls playsInline preload="metadata" poster="/WikiPlay.png" aria-label="WikiPlay experience overview">
              <source src="/media/WikiPlay.mp4" type="video/mp4" />
              Your browser does not support embedded video.
            </video>
          </div>
          <div className="mobile-device-note">
            <strong>Continue on a tablet or computer</strong>
            <span>The contribution experience uses the article and task panel side by side, so it is not available on phones yet.</span>
          </div>
        </section>
      )}
    </main>
  );
}
