"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import {
  recordStepProgressAction,
  setGuidePositionAction,
} from "../../app/learn/actions";
import {
  hotspotStyle,
  initialStepIndex,
  resolvedStepStatuses,
  stepIndexById,
} from "../../lib/guide/model";

function Visual({ step }) {
  const { visual } = step;
  if (!visual?.media?.url) {
    return (
      <div className="guide-visual guide-visual--missing" role="status">
        <div>
          <p className="guide-kicker">Cockpit visual</p>
          <p>Verified media is not available for this step yet.</p>
          {visual?.hotspot ? <p>Target: {visual.hotspot.label}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <figure className="guide-visual">
      <Image
        src={visual.media.url}
        alt={visual.media.alt || visual.title || "Cockpit view for the current step"}
        fill
        sizes="(max-width: 550px) 100vw, 60vw"
        className="guide-visual__image"
        unoptimized
        priority
      />
      {visual.hotspot ? (
        <span
          className="guide-hotspot"
          style={hotspotStyle(visual.hotspot)}
          role="note"
          aria-label={`Current target: ${visual.hotspot.label}`}
        />
      ) : null}
      <figcaption className="guide-visual__caption">
        {visual.title || "Current cockpit view"}
        {visual.hotspot ? ` · Target: ${visual.hotspot.label}` : ""}
      </figcaption>
    </figure>
  );
}

export default function GuideMode({ guide, progress }) {
  const router = useRouter();
  const [mode, setMode] = useState(progress.mode || "LEARN");
  const [focusMode, setFocusMode] = useState(false);
  const [stepIndex, setStepIndex] = useState(() =>
    initialStepIndex(guide.steps, progress.currentStepId),
  );
  const [statuses, setStatuses] = useState(progress.stepStatuses);
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(progress.status === "COMPLETED");
  const [isPending, startTransition] = useTransition();
  const step = guide.steps[stepIndex];

  const completedCount = useMemo(
    () => Object.values(statuses).filter((status) => status === "COMPLETED").length,
    [statuses],
  );

  const persistPosition = useCallback(
    (targetIndex, nextMode = null) => {
      const target = guide.steps[targetIndex];
      if (!target || isPending) return;
      setMessage("");
      startTransition(async () => {
        const result = await setGuidePositionAction({
          journeyId: guide.journey.id,
          stepId: target.id,
          mode: nextMode,
        });
        if (!result.ok) {
          setMessage("Progress was not saved. Please try that action again.");
          return;
        }
        setStepIndex(targetIndex);
        setComplete(result.progress.status === "COMPLETED");
        if (result.nextPath && result.nextPath !== window.location.pathname) {
          router.push(result.nextPath);
        } else {
          router.refresh();
        }
      });
    },
    [guide.journey.id, guide.steps, isPending, router],
  );

  const recordOutcome = useCallback(
    (outcome) => {
      if (!step || isPending) return;
      setMessage("");
      startTransition(async () => {
        const result = await recordStepProgressAction({
          journeyId: guide.journey.id,
          stepId: step.id,
          outcome,
        });
        if (!result.ok) {
          setMessage(
            result.code === "INVALID_REQUEST"
              ? "This step cannot be skipped. Complete it before continuing."
              : "Progress was not saved. Please try that action again.",
          );
          return;
        }

        setStatuses((current) => resolvedStepStatuses(current, step.id, outcome));
        setComplete(result.progress.journeyStatus === "COMPLETED");
        const nextIndex = stepIndexById(
          guide.steps,
          result.progress.currentStepId,
          stepIndex,
        );
        setStepIndex(nextIndex);
        setMessage(
          result.progress.stalePosition
            ? "Your position changed in another session. The latest saved position is shown."
            : "Progress saved.",
        );

        if (result.nextPath && result.nextPath !== window.location.pathname) {
          router.push(result.nextPath);
        } else {
          router.refresh();
        }
      });
    },
    [guide.journey.id, guide.steps, isPending, router, step, stepIndex],
  );

  const changeMode = (nextMode) => {
    if (nextMode === mode || isPending) return;
    const previousMode = mode;
    setMode(nextMode);
    setMessage("");
    startTransition(async () => {
      const result = await setGuidePositionAction({
        journeyId: guide.journey.id,
        stepId: step.id,
        mode: nextMode,
      });
      if (!result.ok) {
        setMode(previousMode);
        setMessage("Your display mode was not saved. Please try again.");
      } else {
        setMessage("Display mode saved.");
      }
    });
  };

  useEffect(() => {
    function onKeyDown(event) {
      if (event.target instanceof HTMLElement && event.target.closest("button, a, input, textarea, select")) {
        return;
      }
      if (event.key === "Escape" && focusMode) {
        setFocusMode(false);
      } else if (event.key === "ArrowLeft" && stepIndex > 0) {
        event.preventDefault();
        persistPosition(stepIndex - 1);
      } else if (event.key === "ArrowRight" && stepIndex < guide.steps.length - 1) {
        event.preventDefault();
        persistPosition(stepIndex + 1);
      } else if (event.code === "Space") {
        event.preventDefault();
        recordOutcome("COMPLETED");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusMode, guide.steps.length, persistPosition, recordOutcome, stepIndex]);

  return (
    <main className={`guide-shell${focusMode ? " guide-shell--focus" : ""}`}>
      <header className="guide-header">
        <div className="guide-header__context">
          <p className="guide-kicker">{guide.journey.implementationName}</p>
          <p>{guide.journey.title} · {guide.section.title}</p>
        </div>
        <div className="guide-header__tools">
          <div className="guide-mode-switch" role="group" aria-label="Learning detail">
            {[
              ["QUICK", "Quick"],
              ["LEARN", "Learn"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={mode === value ? "is-active" : ""}
                aria-pressed={mode === value}
                onClick={() => changeMode(value)}
                disabled={isPending}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="guide-focus-button"
            aria-pressed={focusMode}
            onClick={() => setFocusMode((value) => !value)}
          >
            {focusMode ? "Exit Focus" : "Focus"}
          </button>
          <Link href="/account" className="guide-exit">Exit</Link>
        </div>
      </header>

      <div className="guide-progress" aria-label={`${completedCount} of ${guide.steps.length} steps complete`}>
        {guide.steps.map((candidate, index) => (
          <span
            key={candidate.id}
            className={[
              "guide-progress__tick",
              index === stepIndex ? "is-current" : "",
              statuses[candidate.id] ? "is-resolved" : "",
            ].filter(Boolean).join(" ")}
            title={`Step ${index + 1}: ${statuses[candidate.id] || "not complete"}`}
          />
        ))}
      </div>

      <section className="guide-stage" aria-labelledby="guide-action-title">
        <div className="guide-copy">
          <div className="guide-step-meta">
            <span>Step {stepIndex + 1} / {guide.steps.length}</span>
            <span>{step.type.replace("_", " ")}</span>
            {step.optional ? <span>Optional</span> : null}
          </div>
          <p className="guide-kicker">Do</p>
          <h1 id="guide-action-title">{step.action || step.title}</h1>
          {step.location ? (
            <p className="guide-location"><span>Location</span>{step.location}</p>
          ) : null}
          {step.warning ? <p className="guide-warning">Caution: {step.warning}</p> : null}
          {step.waitHint ? <p className="guide-wait">Wait: {step.waitHint}</p> : null}
        </div>

        <Visual step={step} />

        <div className="guide-expect">
          <p className="guide-kicker">Expected result</p>
          <h2>{step.expectedResult || "No verified expected result is available for this step."}</h2>
          <p>Confirm this result in the simulator, then choose Done. CockpitPath does not detect simulator state.</p>
        </div>

        {mode === "LEARN" ? (
          <aside className="guide-learning" aria-label="Learn more">
            <p className="guide-kicker">Why</p>
            <p className="guide-learning__explanation">
              {step.explanation || "A verified explanation has not been published for this step."}
            </p>
            {step.tip ? <p><strong>Tip:</strong> {step.tip}</p> : null}
            {step.controls.length ? (
              <details>
                <summary>Controls in this step</summary>
                <ul>{step.controls.map((control) => <li key={control.id}>{control.name} · {control.area}</li>)}</ul>
              </details>
            ) : null}
            {step.concepts.length ? (
              <details>
                <summary>Concepts</summary>
                {step.concepts.map((concept) => (
                  <div key={concept.id} className="guide-concept">
                    <h3>{concept.title}</h3>
                    <p>{concept.definition}</p>
                    {concept.whyItMatters ? <p>{concept.whyItMatters}</p> : null}
                  </div>
                ))}
              </details>
            ) : null}
          </aside>
        ) : null}
      </section>

      <footer className="guide-navigation">
        <button
          type="button"
          className="guide-navigation__previous"
          onClick={() => persistPosition(stepIndex - 1)}
          disabled={stepIndex === 0 || isPending}
        >
          ← Previous
        </button>
        <button
          type="button"
          className="guide-navigation__done"
          onClick={() => recordOutcome("COMPLETED")}
          disabled={isPending}
        >
          {isPending ? "Saving…" : complete && stepIndex === guide.steps.length - 1 ? "Done" : "Done — Next →"}
        </button>
        <button
          type="button"
          className="guide-navigation__skip"
          onClick={() => recordOutcome("SKIPPED")}
          disabled={!step.optional || isPending}
          title={step.optional ? "Skip this optional step" : "Required steps cannot be skipped"}
        >
          Skip
        </button>
        <p className={message.includes("not") || message.includes("cannot") ? "guide-save guide-save--error" : "guide-save"} aria-live="polite">
          {message || "Progress saves automatically."}
        </p>
      </footer>
    </main>
  );
}
