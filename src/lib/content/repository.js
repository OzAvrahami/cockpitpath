import "server-only";

import { queryPublished } from "./database";

function groupBy(rows, key) {
  const grouped = new Map();
  for (const row of rows) {
    const value = row[key];
    if (!grouped.has(value)) grouped.set(value, []);
    grouped.get(value).push(row);
  }
  return grouped;
}

export async function getGuideProcedure(journeySlug, procedureSlug) {
  const contextResult = await queryPublished(
    `select journey.id as journey_id,
            journey.slug as journey_slug,
            journey.title as journey_title,
            journey.description as journey_description,
            implementation.display_name as implementation_name,
            section.id as section_id,
            section.sequence as section_sequence,
            coalesce(section.title_override, procedure.title) as section_title,
            section.is_required as section_required,
            procedure.id as procedure_id,
            procedure.slug as procedure_slug,
            procedure.title as procedure_title,
            procedure.short_description as procedure_description
     from cockpitpath_published.journeys journey
     join cockpitpath_published.aircraft_implementations implementation
       on implementation.id = journey.aircraft_implementation_id
     join cockpitpath_published.journey_sections section
       on section.journey_id = journey.id
     join cockpitpath_published.procedures procedure
       on procedure.id = section.procedure_id
     where journey.slug = $1 and procedure.slug = $2
     limit 1`,
    [journeySlug, procedureSlug],
  );

  if (!contextResult.rowCount) return null;
  const context = contextResult.rows[0];

  const stepsResult = await queryPublished(
    `select step.id,
            step.sequence,
            step.step_type,
            step.title,
            step.action_text,
            step.location_hint,
            step.expected_result,
            step.explanation,
            step.tip,
            step.warning,
            step.is_optional,
            step.wait_hint
     from cockpitpath_published.procedure_steps step
     where step.procedure_id = $1
     order by step.sequence`,
    [context.procedure_id],
  );

  if (!stepsResult.rowCount) return null;
  const stepIds = stepsResult.rows.map(({ id }) => id);

  const [controlsResult, visualsResult, conceptsResult] = await Promise.all([
    queryPublished(
      `select relation.procedure_step_id,
              relation.role,
              relation.sequence,
              control.id,
              control.canonical_name,
              control.control_type,
              control.what_it_does,
              area.title as area_title,
              hotspot.id as hotspot_id,
              hotspot.label as hotspot_label,
              hotspot.x,
              hotspot.y,
              hotspot.width,
              hotspot.height
       from cockpitpath_published.procedure_step_controls relation
       join cockpitpath_published.controls control on control.id = relation.control_id
       join cockpitpath_published.cockpit_areas area on area.id = control.cockpit_area_id
       left join cockpitpath_published.hotspots hotspot on hotspot.id = relation.preferred_hotspot_id
       where relation.procedure_step_id = any($1::uuid[])
       order by relation.procedure_step_id, relation.sequence`,
      [stepIds],
    ),
    queryPublished(
      `select relation.procedure_step_id,
              relation.role,
              relation.sort_order,
              view_entity.id as cockpit_view_id,
              view_entity.title as cockpit_view_title,
              media.id as media_id,
              media.storage_key,
              media.mime_type,
              media.width as media_width,
              media.height as media_height,
              media.accessible_description,
              hotspot.id as hotspot_id,
              hotspot.label as hotspot_label,
              hotspot.x,
              hotspot.y,
              hotspot.width,
              hotspot.height
       from cockpitpath_published.procedure_step_visuals relation
       left join cockpitpath_published.cockpit_views view_entity on view_entity.id = relation.cockpit_view_id
       left join cockpitpath_published.media_assets media
         on media.id = coalesce(relation.media_asset_id, view_entity.media_asset_id)
       left join cockpitpath_published.hotspots hotspot on hotspot.id = relation.hotspot_id
       where relation.procedure_step_id = any($1::uuid[])
       order by relation.procedure_step_id,
                case relation.role when 'PRIMARY' then 0 when 'ORIENTATION' then 1 else 2 end,
                relation.sort_order`,
      [stepIds],
    ),
    queryPublished(
      `select step_control.procedure_step_id,
              system.title as system_title,
              component.title as component_title,
              concept.id,
              concept.title,
              concept.short_definition,
              concept.why_it_matters
       from cockpitpath_published.procedure_step_controls step_control
       join cockpitpath_published.system_component_controls component_control
         on component_control.control_id = step_control.control_id
       join cockpitpath_published.system_components component
         on component.id = component_control.system_component_id
       join cockpitpath_published.aircraft_systems system
         on system.id = component.aircraft_system_id
       join cockpitpath_published.system_component_concepts component_concept
         on component_concept.system_component_id = component.id
       join cockpitpath_published.concepts concept
         on concept.id = component_concept.concept_id
       where step_control.procedure_step_id = any($1::uuid[])
       order by step_control.procedure_step_id, component_concept.sort_order, concept.title`,
      [stepIds],
    ),
  ]);

  const controls = groupBy(controlsResult.rows, "procedure_step_id");
  const visuals = groupBy(visualsResult.rows, "procedure_step_id");
  const concepts = groupBy(conceptsResult.rows, "procedure_step_id");

  return {
    journey: {
      id: context.journey_id,
      slug: context.journey_slug,
      title: context.journey_title,
      description: context.journey_description,
      implementationName: context.implementation_name,
    },
    section: {
      id: context.section_id,
      sequence: context.section_sequence,
      title: context.section_title,
      required: context.section_required,
    },
    procedure: {
      id: context.procedure_id,
      slug: context.procedure_slug,
      title: context.procedure_title,
      description: context.procedure_description,
    },
    steps: stepsResult.rows.map((step) => {
      const stepControls = controls.get(step.id) || [];
      const stepVisuals = visuals.get(step.id) || [];
      const primaryVisual = stepVisuals[0] || null;
      const fallbackHotspot = stepControls.find(({ hotspot_id: hotspotId }) => hotspotId);
      const hotspot = primaryVisual?.hotspot_id ? primaryVisual : fallbackHotspot;

      return {
        id: step.id,
        sequence: step.sequence,
        type: step.step_type,
        title: step.title,
        action: step.action_text,
        location: step.location_hint || stepControls[0]?.area_title || null,
        expectedResult: step.expected_result,
        explanation: step.explanation,
        tip: step.tip,
        warning: step.warning,
        optional: step.is_optional,
        waitHint: step.wait_hint,
        controls: stepControls.map((control) => ({
          id: control.id,
          name: control.canonical_name,
          type: control.control_type,
          role: control.role,
          area: control.area_title,
          description: control.what_it_does,
        })),
        concepts: (concepts.get(step.id) || []).map((concept) => ({
          id: concept.id,
          title: concept.title,
          definition: concept.short_definition,
          whyItMatters: concept.why_it_matters,
          systemTitle: concept.system_title,
          componentTitle: concept.component_title,
        })),
        visual: primaryVisual
          ? {
              title: primaryVisual.cockpit_view_title,
              media: primaryVisual.media_id
                ? {
                    id: primaryVisual.media_id,
                    storageKey: primaryVisual.storage_key,
                    mimeType: primaryVisual.mime_type,
                    width: primaryVisual.media_width,
                    height: primaryVisual.media_height,
                    alt: primaryVisual.accessible_description,
                    url: null,
                  }
                : null,
              hotspot: hotspot?.hotspot_id
                ? {
                    id: hotspot.hotspot_id,
                    label: hotspot.hotspot_label || stepControls[0]?.canonical_name || "Current control",
                    x: Number(hotspot.x),
                    y: Number(hotspot.y),
                    width: Number(hotspot.width),
                    height: Number(hotspot.height),
                  }
                : null,
            }
          : null,
      };
    }),
  };
}

export async function getJourneyOutline(journeySlug) {
  const result = await queryPublished(
    `select journey.id as journey_id,
            journey.slug as journey_slug,
            journey.title as journey_title,
            section.id as section_id,
            section.sequence as section_sequence,
            procedure.id as procedure_id,
            procedure.slug as procedure_slug,
            procedure.title as procedure_title,
            step.id as first_step_id
     from cockpitpath_published.journeys journey
     join cockpitpath_published.journey_sections section on section.journey_id = journey.id
     join cockpitpath_published.procedures procedure on procedure.id = section.procedure_id
     left join lateral (
       select procedure_step.id
       from cockpitpath_published.procedure_steps procedure_step
       where procedure_step.procedure_id = procedure.id
       order by procedure_step.sequence
       limit 1
     ) step on true
     where journey.slug = $1
     order by section.sequence`,
    [journeySlug],
  );
  if (!result.rowCount) return null;
  return {
    id: result.rows[0].journey_id,
    slug: result.rows[0].journey_slug,
    title: result.rows[0].journey_title,
    sections: result.rows.map((row) => ({
      id: row.section_id,
      sequence: row.section_sequence,
      procedureId: row.procedure_id,
      procedureSlug: row.procedure_slug,
      procedureTitle: row.procedure_title,
      firstStepId: row.first_step_id,
    })),
  };
}

export async function getGuideRouteForStep(journeyId, stepId) {
  if (!stepId) return null;
  const result = await queryPublished(
    `select journey.slug as journey_slug, procedure.slug as procedure_slug
     from cockpitpath_published.journeys journey
     join cockpitpath_published.journey_sections section on section.journey_id = journey.id
     join cockpitpath_published.procedures procedure on procedure.id = section.procedure_id
     join cockpitpath_published.procedure_steps step on step.procedure_id = procedure.id
     where journey.id = $1 and step.id = $2
     limit 1`,
    [journeyId, stepId],
  );
  if (!result.rowCount) return null;
  const row = result.rows[0];
  return `/learn/${encodeURIComponent(row.journey_slug)}/${encodeURIComponent(row.procedure_slug)}`;
}
