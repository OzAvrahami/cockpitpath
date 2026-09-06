"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import {
  areaTrail,
  explorerContextPath,
  findAreaForControl,
  findViewForControl,
  guideContextPath,
  hotspotPosition,
  searchControls,
} from "../../lib/cockpit/explorer";

function chooseInitialArea(explorer, areaSlug, controlSlug) {
  const control = explorer.controls.find(({ slug }) => slug === controlSlug);
  if (control) return findAreaForControl(explorer, control);
  return (
    explorer.areas.find(({ slug }) => slug === areaSlug) ||
    explorer.areas.find(({ parentId }) => !parentId) ||
    explorer.areas[0] ||
    null
  );
}

function DeferredMedia({ title }) {
  return (
    <div className="cockpit-media__deferred" data-media-status="deferred" role="status">
      <span className="cockpit-media__reticle" aria-hidden="true" />
      <div>
        <p className="app-eyebrow">Verified cockpit media deferred</p>
        <p>{title || "Cockpit view"}</p>
        <small>The Explorer remains usable while verified implementation captures are prepared.</small>
      </div>
    </div>
  );
}

function ControlDetails({ control, explorer, onGuide, trail }) {
  if (!control) {
    return (
      <div className="cockpit-detail__empty" role="status">
        <p className="app-eyebrow">Control details</p>
        <h2>Select a cockpit control</h2>
        <p>Choose a hotspot or search result to learn what the control does and where it is used.</p>
      </div>
    );
  }

  const explorerPath = explorerContextPath(
    explorer.implementation.slug,
    trail.at(-1)?.slug,
    control.slug,
  );

  return (
    <div className="cockpit-detail__content">
      <p className="app-eyebrow">{control.type.replaceAll("_", " ")}</p>
      <h2 id="cockpit-control-title" tabIndex={-1}>{control.name}</h2>
      <p className="cockpit-detail__location">
        <span>Location</span>
        {trail.map(({ title }) => title).join(" → ")}
      </p>

      <button className="public-button public-button--secondary cockpit-detail__guide" onClick={onGuide} type="button">
        Guide me there
      </button>

      <section aria-labelledby="control-purpose-title">
        <h3 id="control-purpose-title">What it does</h3>
        <p>{control.whatItDoes || "A verified control explanation has not been published yet."}</p>
      </section>
      <section aria-labelledby="control-use-title">
        <h3 id="control-use-title">When you use it</h3>
        <p>{control.whenUsed || "Verified usage guidance has not been published yet."}</p>
      </section>

      {control.aliases?.length ? (
        <section aria-labelledby="control-aliases-title">
          <h3 id="control-aliases-title">Also known as</h3>
          <p>{control.aliases.join(", ")}</p>
        </section>
      ) : null}

      {control.system ? (
        <section aria-labelledby="control-system-title">
          <h3 id="control-system-title">Related system</h3>
          <p>{control.system.title}</p>
          <span className="app-coming-soon">Systems detail coming soon</span>
        </section>
      ) : null}

      {control.concepts.length ? (
        <section aria-labelledby="control-concepts-title">
          <h3 id="control-concepts-title">Related concepts</h3>
          <ul className="cockpit-detail__list">
            {control.concepts.map((concept) => <li key={concept.id}>{concept.title}</li>)}
          </ul>
        </section>
      ) : null}

      {control.procedures.length ? (
        <section aria-labelledby="control-procedures-title">
          <h3 id="control-procedures-title">Used in procedures</h3>
          <ul className="cockpit-detail__links">
            {control.procedures.map((procedure) => (
              <li key={`${procedure.journeySlug}:${procedure.procedureSlug}:${procedure.stepId}`}>
                <Link href={guideContextPath(procedure, explorerPath, control.slug)}>
                  {procedure.procedureTitle} · step {procedure.stepSequence}
                  <span aria-hidden="true"> →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="cockpit-detail__quiet">No related published procedures are available.</p>
      )}
    </div>
  );
}

export default function CockpitExplorer({ explorer, initialAreaSlug, initialControlSlug, returnPath }) {
  const initialArea = chooseInitialArea(explorer, initialAreaSlug, initialControlSlug);
  const initialControl = explorer.controls.find(({ slug }) => slug === initialControlSlug) || null;
  const [areaId, setAreaId] = useState(initialArea?.id || null);
  const [viewId, setViewId] = useState(() => findViewForControl(explorer, initialControl)?.id || initialArea?.views[0]?.id || null);
  const [controlId, setControlId] = useState(initialControl?.id || null);
  const [query, setQuery] = useState("");
  const [orientation, setOrientation] = useState("");
  const detailHeadingRef = useRef(null);
  const mediaHeadingRef = useRef(null);

  const area = explorer.areas.find(({ id }) => id === areaId) || initialArea;
  const control = explorer.controls.find(({ id }) => id === controlId) || null;
  const view = area?.views.find(({ id }) => id === viewId) || area?.views.find(({ primary }) => primary) || area?.views[0] || null;
  const trail = areaTrail(explorer.areas, area?.id);
  const children = explorer.areas.filter(({ parentId }) => parentId === area?.id);
  const results = useMemo(() => searchControls(explorer, query), [explorer, query]);

  function updateLocation(nextArea, nextControl = null) {
    const path = explorerContextPath(explorer.implementation.slug, nextArea?.slug, nextControl?.slug);
    window.history.replaceState(window.history.state, "", path);
  }

  function selectArea(nextArea) {
    if (!nextArea) return;
    setAreaId(nextArea.id);
    setViewId(nextArea.views.find(({ primary }) => primary)?.id || nextArea.views[0]?.id || null);
    setControlId(null);
    setOrientation("");
    updateLocation(nextArea);
    requestAnimationFrame(() => mediaHeadingRef.current?.focus());
  }

  function selectControl(nextControl, announce = false) {
    if (!nextControl) return;
    const nextArea = findAreaForControl(explorer, nextControl);
    const nextView = findViewForControl(explorer, nextControl);
    setAreaId(nextArea?.id || areaId);
    setViewId(nextView?.id || null);
    setControlId(nextControl.id);
    setQuery("");
    setOrientation(
      announce
        ? `${areaTrail(explorer.areas, nextArea?.id).map(({ title }) => title).join(" → ")} → ${nextControl.name}`
        : "",
    );
    updateLocation(nextArea, nextControl);
    requestAnimationFrame(() => detailHeadingRef.current?.focus());
  }

  function activateHotspot(hotspot) {
    if (hotspot.targetAreaId) {
      selectArea(explorer.areas.find(({ id }) => id === hotspot.targetAreaId));
    } else {
      selectControl(explorer.controls.find(({ id }) => id === hotspot.targetControlId));
    }
  }

  return (
    <div className="cockpit-explorer">
      <header className="cockpit-explorer__intro">
        <div>
          <p className="app-eyebrow">Find · Cockpit Explorer</p>
          <h1>Cockpit Explorer</h1>
          <p>Locate cockpit areas and learn what each published control does without leaving the aircraft context.</p>
        </div>
        <dl className="cockpit-explorer__context">
          <div><dt>Aircraft</dt><dd>{explorer.implementation.aircraftName}</dd></div>
          <div><dt>Implementation</dt><dd>{explorer.implementation.addonDeveloper}</dd></div>
          <div><dt>Simulator</dt><dd>{explorer.implementation.simulatorName}</dd></div>
        </dl>
        {returnPath?.startsWith("/learn/") ? (
          <Link className="cockpit-explorer__return" href={returnPath}>← Back to Guide Mode</Link>
        ) : null}
      </header>

      <section className="cockpit-search" aria-labelledby="cockpit-search-title">
        <div>
          <h2 id="cockpit-search-title">Find a control</h2>
          <label htmlFor="cockpit-control-search">Search by name or cockpit location</label>
        </div>
        <div className="cockpit-search__field">
          <input
            id="cockpit-control-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
            placeholder="Search published controls"
          />
          {query ? (
            <div className="cockpit-search__results" role="region" aria-live="polite" aria-label="Control search results">
              {results.length ? (
                <ul>
                  {results.map((result) => {
                    const resultTrail = areaTrail(explorer.areas, result.areaId);
                    return (
                      <li key={result.id}>
                        <button type="button" onClick={() => selectControl(result, true)}>
                          <strong>{result.name}</strong>
                          <span>{resultTrail.map(({ title }) => title).join(" → ")}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : <p>No published controls match “{query}”.</p>}
            </div>
          ) : null}
        </div>
      </section>

      <nav className="cockpit-breadcrumbs" aria-label="Cockpit location">
        <ol>
          {trail.map((crumb, index) => (
            <li key={crumb.id}>
              {index === trail.length - 1 && !control ? (
                <span aria-current="page">{crumb.title}</span>
              ) : (
                <button type="button" onClick={() => selectArea(crumb)}>{crumb.title}</button>
              )}
            </li>
          ))}
          {control ? <li><span aria-current="page">{control.name}</span></li> : null}
        </ol>
      </nav>

      <nav className="cockpit-area-nav" aria-label="Cockpit area selector">
        {explorer.areas.filter(({ parentId }) => !parentId).map((root) => (
          <button
            key={root.id}
            type="button"
            aria-pressed={trail.some(({ id }) => id === root.id)}
            onClick={() => selectArea(root)}
          >
            {root.title}
          </button>
        ))}
      </nav>

      <div className="cockpit-explorer__workspace">
        <section className="cockpit-stage" aria-labelledby="cockpit-view-title">
          <div className="cockpit-stage__heading">
            <div>
              <p className="app-eyebrow">Current view</p>
              <h2 id="cockpit-view-title" ref={mediaHeadingRef} tabIndex={-1}>{view?.title || area?.title || "Cockpit"}</h2>
            </div>
            {area?.views.length > 1 ? (
              <label>
                View
                <select value={view?.id || ""} onChange={(event) => setViewId(event.target.value)}>
                  {area.views.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.title}</option>)}
                </select>
              </label>
            ) : null}
          </div>

          <div className="cockpit-media" data-hotspot-layer="separate">
            <div className="cockpit-media__visual">
              {view?.media?.url ? (
                <Image
                  src={view.media.url}
                  alt={view.media.alt || view.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 70vw"
                  className="cockpit-media__image"
                  unoptimized
                  priority
                />
              ) : <DeferredMedia title={view?.title || area?.title} />}
            </div>
            {view?.hotspots.length ? (
              <div className="cockpit-media__hotspots" aria-label="Interactive cockpit locations">
                {view.hotspots.map((hotspot) => {
                  const targetArea = explorer.areas.find(({ id }) => id === hotspot.targetAreaId);
                  const targetControl = explorer.controls.find(({ id }) => id === hotspot.targetControlId);
                  const label = hotspot.label || targetArea?.title || targetControl?.name || "Cockpit location";
                  const selected = Boolean(targetControl && targetControl.id === control?.id);
                  return (
                    <button
                      key={hotspot.id}
                      type="button"
                      className={`cockpit-hotspot${selected ? " is-selected" : ""}`}
                      style={hotspotPosition(hotspot)}
                      aria-label={`${selected ? "Selected control" : targetArea ? "Open area" : "Select control"}: ${label}`}
                      aria-pressed={targetControl ? selected : undefined}
                      onClick={() => activateHotspot(hotspot)}
                    >
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {children.length ? (
            <div className="cockpit-stage__areas">
              <h3>Explore within {area.title}</h3>
              <div>
                {children.map((child) => <button key={child.id} type="button" onClick={() => selectArea(child)}>{child.title}</button>)}
              </div>
            </div>
          ) : null}
          <p className="cockpit-stage__status" aria-live="polite">{orientation ? `Guide path: ${orientation}` : "Select a marked area or control to continue."}</p>
        </section>

        <aside className="cockpit-detail" aria-label="Selected control details" ref={detailHeadingRef} tabIndex={-1}>
          <ControlDetails
            control={control}
            explorer={explorer}
            trail={control ? areaTrail(explorer.areas, control.areaId) : trail}
            onGuide={() => selectControl(control, true)}
          />
        </aside>
      </div>
    </div>
  );
}
