export const SUPPORTED_IMPLEMENTATION_SLUG = "ifly-737-max-8-msfs-2024";

export function isValidImplementationSlug(value) {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function areaTrail(areas, areaId) {
  const byId = new Map(areas.map((area) => [area.id, area]));
  const trail = [];
  const visited = new Set();
  let area = byId.get(areaId);

  while (area && !visited.has(area.id)) {
    visited.add(area.id);
    trail.unshift(area);
    area = area.parentId ? byId.get(area.parentId) : null;
  }

  return trail;
}

export function findAreaForControl(explorer, control) {
  return explorer.areas.find((area) => area.id === control?.areaId) || null;
}

export function findViewForControl(explorer, control) {
  const area = findAreaForControl(explorer, control);
  if (!area) return null;
  return (
    area.views.find((view) =>
      view.hotspots.some((hotspot) => hotspot.targetControlId === control.id),
    ) || area.views.find((view) => view.primary) || area.views[0] || null
  );
}

export function searchControls(explorer, query) {
  const normalized = query.trim().toLocaleLowerCase("en");
  if (!normalized) return [];
  const areaById = new Map(explorer.areas.map((area) => [area.id, area]));

  return explorer.controls.filter((control) => {
    const area = areaById.get(control.areaId);
    const location = areaTrail(explorer.areas, area?.id)
      .map(({ title }) => title)
      .join(" ");
    return [control.name, control.slug, location, ...(control.aliases || [])]
      .filter(Boolean)
      .some((value) => value.toLocaleLowerCase("en").includes(normalized));
  });
}

export function hotspotPosition(hotspot) {
  return {
    left: `${hotspot.x * 100}%`,
    top: `${hotspot.y * 100}%`,
    width: `${hotspot.width * 100}%`,
    height: `${hotspot.height * 100}%`,
  };
}

export function explorerContextPath(implementationSlug, areaSlug, controlSlug, returnPath) {
  const query = new URLSearchParams();
  if (areaSlug) query.set("area", areaSlug);
  if (controlSlug) query.set("control", controlSlug);
  if (returnPath) query.set("from", returnPath);
  const suffix = query.size ? `?${query}` : "";
  return `/app/cockpit/${encodeURIComponent(implementationSlug)}${suffix}`;
}

export function guideContextPath(procedure, explorerPath, controlSlug) {
  const query = new URLSearchParams({ from: explorerPath });
  if (controlSlug) query.set("control", controlSlug);
  return `/learn/${encodeURIComponent(procedure.journeySlug)}/${encodeURIComponent(procedure.procedureSlug)}?${query}`;
}
