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

function numberOrZero(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export async function getCockpitExplorer(implementationSlug) {
  const contextResult = await queryPublished(
    `select implementation.id,
            implementation.slug,
            implementation.display_name,
            implementation.support_status,
            aircraft.slug as aircraft_slug,
            aircraft.display_name as aircraft_name,
            simulator.display_name as simulator_name,
            addon.developer_name,
            addon.product_name
     from cockpitpath_published.aircraft_implementations implementation
     join cockpitpath_published.aircraft aircraft on aircraft.id = implementation.aircraft_id
     join cockpitpath_published.simulators simulator on simulator.id = implementation.simulator_id
     join cockpitpath_published.addon_products addon on addon.id = implementation.addon_product_id
     where implementation.slug = $1
     limit 1`,
    [implementationSlug],
  );

  if (!contextResult.rowCount) return null;
  const context = contextResult.rows[0];

  const [areasResult, viewsResult, controlsResult, hotspotsResult, conceptsResult, proceduresResult] =
    await Promise.all([
      queryPublished(
        `select id, parent_area_id, area_type, slug, title, sort_order
         from cockpitpath_published.cockpit_areas
         where aircraft_implementation_id = $1
         order by sort_order, title`,
        [context.id],
      ),
      queryPublished(
        `select view_entity.id,
                view_entity.cockpit_area_id,
                view_entity.view_role,
                view_entity.title,
                view_entity.sort_order,
                view_entity.is_primary,
                media.id as media_id,
                media.storage_key,
                media.mime_type,
                media.width,
                media.height,
                media.accessible_description,
                media.rights_status,
                media.verification_status
         from cockpitpath_published.cockpit_views view_entity
         join cockpitpath_published.media_assets media on media.id = view_entity.media_asset_id
         where view_entity.aircraft_implementation_id = $1
         order by view_entity.is_primary desc, view_entity.sort_order, view_entity.title`,
        [context.id],
      ),
      queryPublished(
        `select control.id,
                control.cockpit_area_id,
                control.slug,
                control.canonical_name,
                control.control_type,
                control.what_it_does,
                control.when_used,
                coalesce(to_jsonb(control)->'search_aliases', '[]'::jsonb) as search_aliases,
                system.id as system_id,
                system.slug as system_slug,
                system.title as system_title
         from cockpitpath_published.controls control
         left join cockpitpath_published.aircraft_systems system on system.id = control.aircraft_system_id
         where control.aircraft_implementation_id = $1
         order by control.canonical_name`,
        [context.id],
      ),
      queryPublished(
        `select id,
                cockpit_view_id,
                target_cockpit_area_id,
                target_control_id,
                x,
                y,
                width,
                height,
                shape,
                label,
                sort_order
         from cockpitpath_published.hotspots
         where aircraft_implementation_id = $1
         order by sort_order`,
        [context.id],
      ),
      queryPublished(
        `select component_control.control_id,
                concept.id,
                concept.title,
                concept.short_definition,
                concept.why_it_matters
         from cockpitpath_published.system_component_controls component_control
         join cockpitpath_published.system_components component
           on component.id = component_control.system_component_id
         join cockpitpath_published.system_component_concepts component_concept
           on component_concept.system_component_id = component.id
         join cockpitpath_published.concepts concept on concept.id = component_concept.concept_id
         where component_control.aircraft_implementation_id = $1
         order by component_control.control_id, component_concept.sort_order, concept.title`,
        [context.id],
      ),
      queryPublished(
        `select distinct step_control.control_id,
                journey.slug as journey_slug,
                journey.title as journey_title,
                procedure.slug as procedure_slug,
                procedure.title as procedure_title,
                step.id as step_id,
                step.sequence as step_sequence,
                step.title as step_title
         from cockpitpath_published.procedure_step_controls step_control
         join cockpitpath_published.procedure_steps step on step.id = step_control.procedure_step_id
         join cockpitpath_published.procedures procedure on procedure.id = step.procedure_id
         join cockpitpath_published.journey_sections section on section.procedure_id = procedure.id
         join cockpitpath_published.journeys journey on journey.id = section.journey_id
         where step_control.aircraft_implementation_id = $1
         order by step_control.control_id, journey.title, procedure.title, step.sequence`,
        [context.id],
      ),
    ]);

  const viewsByArea = groupBy(viewsResult.rows, "cockpit_area_id");
  const hotspotsByView = groupBy(hotspotsResult.rows, "cockpit_view_id");
  const conceptsByControl = groupBy(conceptsResult.rows, "control_id");
  const proceduresByControl = groupBy(proceduresResult.rows, "control_id");

  return {
    implementation: {
      id: context.id,
      slug: context.slug,
      name: context.display_name,
      supportStatus: context.support_status,
      aircraftSlug: context.aircraft_slug,
      aircraftName: context.aircraft_name,
      addonDeveloper: context.developer_name,
      addonName: context.product_name,
      simulatorName: context.simulator_name,
    },
    areas: areasResult.rows.map((area) => ({
      id: area.id,
      parentId: area.parent_area_id,
      type: area.area_type,
      slug: area.slug,
      title: area.title,
      sortOrder: area.sort_order,
      views: (viewsByArea.get(area.id) || []).map((view) => ({
        id: view.id,
        role: view.view_role,
        title: view.title,
        primary: view.is_primary,
        media: {
          id: view.media_id,
          storageKey: view.storage_key,
          mimeType: view.mime_type,
          width: view.width,
          height: view.height,
          alt: view.accessible_description,
          rightsStatus: view.rights_status,
          verificationStatus: view.verification_status,
          url: null,
        },
        hotspots: (hotspotsByView.get(view.id) || []).map((hotspot) => ({
          id: hotspot.id,
          targetAreaId: hotspot.target_cockpit_area_id,
          targetControlId: hotspot.target_control_id,
          x: numberOrZero(hotspot.x),
          y: numberOrZero(hotspot.y),
          width: numberOrZero(hotspot.width),
          height: numberOrZero(hotspot.height),
          shape: hotspot.shape,
          label: hotspot.label,
        })),
      })),
    })),
    controls: controlsResult.rows.map((control) => ({
      id: control.id,
      areaId: control.cockpit_area_id,
      slug: control.slug,
      name: control.canonical_name,
      type: control.control_type,
      whatItDoes: control.what_it_does,
      whenUsed: control.when_used,
      aliases: Array.isArray(control.search_aliases) ? control.search_aliases : [],
      system: control.system_id
        ? { id: control.system_id, slug: control.system_slug, title: control.system_title }
        : null,
      concepts: (conceptsByControl.get(control.id) || []).map((concept) => ({
        id: concept.id,
        title: concept.title,
        definition: concept.short_definition,
        whyItMatters: concept.why_it_matters,
      })),
      procedures: (proceduresByControl.get(control.id) || []).map((procedure) => ({
        journeySlug: procedure.journey_slug,
        journeyTitle: procedure.journey_title,
        procedureSlug: procedure.procedure_slug,
        procedureTitle: procedure.procedure_title,
        stepId: procedure.step_id,
        stepSequence: procedure.step_sequence,
        stepTitle: procedure.step_title,
      })),
    })),
  };
}

export async function getGuideProcedure(journeySlug, procedureSlug) {
  const contextResult = await queryPublished(
    `select journey.id as journey_id,
            journey.slug as journey_slug,
            journey.title as journey_title,
            journey.description as journey_description,
            implementation.slug as implementation_slug,
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
              control.slug,
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
      implementationSlug: context.implementation_slug,
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
          slug: control.slug,
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
