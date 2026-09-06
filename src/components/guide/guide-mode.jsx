"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";

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

export function guideMediaAspectRatio(media) {
  const width = Number(media?.width);
  const height = Number(media?.height);
  return width > 0 && height > 0 ? `${width} / ${height}` : "16 / 9";
}

export function focusGuideTarget(target, schedule = requestAnimationFrame) {
  if (!target) return;
  schedule(() => target.focus({ preventScroll: false }));
}

export function guideShortcutAction(event, state) {
  if (event.key === "Escape" && state.focusMode) return "EXIT_FOCUS";
  if (event.altKey || event.ctrlKey || event.metaKey || event.repeat || event.interactive) {
    return null;
  }
  if (event.key === "ArrowLeft" && state.stepIndex > 0) return "PREVIOUS";
  if (event.key === "ArrowRight" && state.stepIndex < state.stepCount - 1) return "NEXT";
  if (event.code === "Space") return "COMPLETE";
  return null;
}

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
    <figure className="guide-visual guide-visual--available">
      <div
        className="guide-visual__canvas"
        style={{ aspectRatio: guideMediaAspectRatio(visual.media) }}
      >
        <Image
          src={visual.media.url}
          alt={visual.media.alt || visual.title || "Cockpit view for the current step"}
          fill
          sizes="(max-width: 900px) calc(100vw - 2rem), 60vw"
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
      </div>
      <figcaption className="guide-visual__caption">
        {visual.title || "Current cockpit view"}
        {visual.hotspot ? ` · Target: ${visual.hotspot.label}` : ""}
      </figcaption>
    </figure>
  );
}

export default function GuideMode({ guide, progress }) {
  const router = useRouter();
  const actionHeadingRef = useRef(null);
  const focusButtonRef = useRef(null);
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
  const skippedCount = useMemo(
    () => Object.values(statuses).filter((status) => status === "SKIPPED").length,
    [statuses],
  );

  const focusCurrentAction = useCallback(() => {
    focusGuideTarget(actionHeadingRef.current);
  }, []);

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
        if (targetIndex !== stepIndex) focusCurrentAction();
        if (result.nextPath && result.nextPath !== window.location.pathname) {
          router.push(result.nextPath);
        } else {
          router.refresh();
        }
      });
    },
    [focusCurrentAction, guide.journey.id, guide.steps, isPending, router, stepIndex],
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
        if (nextIndex !== stepIndex) focusCurrentAction();
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
    [focusCurrentAction, guide.journey.id, guide.steps, isPending, router, step, stepIndex],
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
      const action = guideShortcutAction(
        {
          key: event.key,
          code: event.code,
          altKey: event.altKey,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          repeat: event.repeat,
          interactive:
            event.target instanceof HTMLElement &&
            Boolean(event.target.closest("button, a, input, textarea, select, summary, [contenteditable='true']")),
        },
        { focusMode, stepIndex, stepCount: guide.steps.length },
      );
      if (!action) return;

      event.preventDefault();
      if (action === "EXIT_FOCUS") {
        setFocusMode(false);
        focusGuideTarget(focusButtonRef.current);
      } else if (action === "PREVIOUS") {
        persistPosition(stepIndex - 1);
      } else if (action === "NEXT") {
        persistPosition(stepIndex + 1);
      } else if (action === "COMPLETE") {
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
            ref={focusButtonRef}
            aria-pressed={focusMode}
            aria-controls="guide-stage"
            onClick={() => setFocusMode((value) => !value)}
          >
            {focusMode ? "Exit Focus" : "Focus"}
          </button>
          <Link href="/account" className="guide-exit">Exit</Link>
        </div>
      </header>

      <div
        className="guide-progress"
        role="progressbar"
        aria-label="Procedure progress"
        aria-valuemin={0}
        aria-valuemax={guide.steps.length}
        aria-valuenow={completedCount}
        aria-valuetext={`${completedCount} of ${guide.steps.length} steps complete, ${skippedCount} skipped. Step ${stepIndex + 1} is current.`}
      >
        {guide.steps.map((candidate, index) => {
          const status = statuses[candidate.id];
          return (
            <span
              key={candidate.id}
              className={[
                "guide-progress__tick",
                index === stepIndex ? "is-current" : "",
                status === "COMPLETED" ? "is-completed" : "",
                status === "SKIPPED" ? "is-skipped" : "",
              ].filter(Boolean).join(" ")}
              title={`Step ${index + 1}: ${index === stepIndex ? "current, " : ""}${status?.toLowerCase() || "not complete"}`}
              aria-hidden="true"
            />
          );
        })}
      </div>

      <section id="guide-stage" className="guide-stage" aria-labelledby="guide-action-title">
        <div className="guide-copy">
          <div className="guide-step-meta">
            <span>Step {stepIndex + 1} / {guide.steps.length}</span>
            <span>{step.type.replace("_", " ")}</span>
            {step.optional ? <span>Optional</span> : null}
          </div>
          <p className="guide-kicker">Do</p>
          <h1 id="guide-action-title" ref={actionHeadingRef} tabIndex={-1}>{step.action || step.title}</h1>
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

      <footer className="guide-navigation" aria-label="Step navigation">
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
          aria-label={step.optional ? "Skip this optional step" : "Skip unavailable: this step is required"}
        >
          Skip
        </button>
        <p className={message.includes("not") || message.includes("cannot") ? "guide-save guide-save--error" : "guide-save"} aria-live="polite" aria-atomic="true">
          {message || "Progress saves automatically."}
        </p>
      </footer>
    </main>
  );
}
