import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Lightning, LockKey, Sparkle, UsersThree, X } from "@phosphor-icons/react";
import { ArticleSurface } from "./ArticleSurface";
import { resolveTask, topicModules } from "./data";
import {
  advanceJourney,
  completeCurrentTask,
  emptyResponse,
  evaluateTask,
  initialJourneyState,
  markCurrentTaskSkipped,
  skipCurrentTask,
} from "./journey";
import { ExperienceCredit, OdysseyPanel } from "./OdysseyPanel";
import { Button } from "./OdysseyUi";
import { KnowledgeSpark } from "./DelightAnimation";
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
    if (state.phase !== "question" && state.phase !== "learn-more") return;
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
    const selectedModule = topicModules[selectedTopic];
    if (selectedModule) {
      navigateArticle(selectedModule.articleSectionId, selectedModule.tasks[0].articlePassageId);
    }
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
          <div className="panel-state-wash atmospheric mobile-state-wash" aria-hidden="true" />
          <header className="mobile-wikiplay-header">
            <div className="mobile-wikiplay-brand" aria-label="WikiPlay">
              <KnowledgeSpark
                className="mobile-brand-spark"
                delay={180}
                fallback={<img className="mobile-wikiplay-mark" src="/wikiplay-blue.png" alt="" aria-hidden="true" />}
              />
              <span>WikiPlay</span>
            </div>
            <button className="mobile-wikiplay-close" type="button" aria-label="Close WikiPlay" onClick={exit}><X size={18} /></button>
          </header>
          <div className="mobile-video-shell">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              controlsList="nodownload nofullscreen noremoteplayback"
              onContextMenu={(event) => event.preventDefault()}
              poster="/WikiPlay.png"
              aria-label="WikiPlay experience overview"
            >
              <source src="/media/WikiPlay.mp4" type="video/mp4" />
              Your browser does not support embedded video.
            </video>
          </div>
          <div className="mobile-wikiplay-content">
            <h1 id="mobile-wikiplay-title">Introducing Micro Contributions on Wikipedia.</h1>
            <p>A new way designed to help you learn and contribute your dense, rich information on the topics you love.</p>
            <div className="mobile-benefits" aria-label="WikiPlay benefits">
              <div>
                <Lightning size={28} weight="duotone" aria-hidden="true" />
                <span><strong>The World Is Still Writing.</strong>50 million pages with citations, and counting. None of them are finished.</span>
              </div>
              <div>
                <Sparkle size={28} weight="duotone" aria-hidden="true" />
                <span><strong>Small Edits. Real Weight.</strong>A few minutes of your contribution moves knowledge forward, for everyone.</span>
              </div>
              <div>
                <UsersThree size={28} weight="duotone" aria-hidden="true" />
                <span><strong>Nobody Owns the Truth.</strong>That's the whole idea. Help keep it that way. Your opinion matters now more than ever.</span>
              </div>
            </div>
            <div className="mobile-bottom-actions">
              <button className="mobile-web-only" type="button" disabled aria-label="WikiPlay is available on tablet and desktop">
                <LockKey size={18} weight="bold" aria-hidden="true" />
                Web-Only Experience
              </button>
              <ExperienceCredit className="mobile-experience-credit" />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
