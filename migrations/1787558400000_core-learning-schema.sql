-- Up Migration

CREATE FUNCTION public.cockpitpath_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog
AS $$
BEGIN
  NEW.updated_at = statement_timestamp();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.cockpitpath_set_updated_at() FROM PUBLIC;

CREATE TABLE public.content_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text NOT NULL,
  kind text NOT NULL,
  status text NOT NULL DEFAULT 'DRAFT',
  locale text NOT NULL DEFAULT 'en',
  revision integer NOT NULL DEFAULT 1,
  content_hash text,
  access_class text NOT NULL DEFAULT 'FREE',
  required_entitlement_key text,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT content_records_content_key_unique UNIQUE (content_key),
  CONSTRAINT content_records_id_kind_unique UNIQUE (id, kind),
  CONSTRAINT content_records_content_key_format CHECK (
    content_key ~ '^[a-z]+(\.[a-z0-9]+(-[a-z0-9]+)*)+$'
  ),
  CONSTRAINT content_records_kind_check CHECK (kind IN (
    'AIRCRAFT',
    'SIMULATOR',
    'ADDON_PRODUCT',
    'AIRCRAFT_IMPLEMENTATION',
    'JOURNEY',
    'PROCEDURE',
    'PROCEDURE_STEP',
    'COCKPIT_AREA',
    'COCKPIT_VIEW',
    'CONTROL',
    'HOTSPOT',
    'AIRCRAFT_SYSTEM',
    'SYSTEM_COMPONENT',
    'CONCEPT',
    'MEDIA_ASSET'
  )),
  CONSTRAINT content_records_key_kind_match CHECK (
    (kind = 'AIRCRAFT' AND content_key LIKE 'aircraft.%') OR
    (kind = 'SIMULATOR' AND content_key LIKE 'simulator.%') OR
    (kind = 'ADDON_PRODUCT' AND content_key LIKE 'addon.%') OR
    (kind = 'AIRCRAFT_IMPLEMENTATION' AND content_key LIKE 'implementation.%') OR
    (kind = 'JOURNEY' AND content_key LIKE 'journey.%') OR
    (kind = 'PROCEDURE' AND content_key LIKE 'procedure.%') OR
    (kind = 'PROCEDURE_STEP' AND content_key LIKE 'step.%') OR
    (kind = 'COCKPIT_AREA' AND content_key LIKE 'area.%') OR
    (kind = 'COCKPIT_VIEW' AND content_key LIKE 'view.%') OR
    (kind = 'CONTROL' AND content_key LIKE 'control.%') OR
    (kind = 'HOTSPOT' AND content_key LIKE 'hotspot.%') OR
    (kind = 'AIRCRAFT_SYSTEM' AND content_key LIKE 'system.%') OR
    (kind = 'SYSTEM_COMPONENT' AND content_key LIKE 'component.%') OR
    (kind = 'CONCEPT' AND content_key LIKE 'concept.%') OR
    (kind = 'MEDIA_ASSET' AND content_key LIKE 'media.%')
  ),
  CONSTRAINT content_records_status_check CHECK (
    status IN ('DRAFT', 'REVIEW', 'VERIFIED', 'PUBLISHED', 'ARCHIVED')
  ),
  CONSTRAINT content_records_locale_format CHECK (
    locale ~ '^[a-z]{2}(-[A-Z]{2})?$'
  ),
  CONSTRAINT content_records_revision_positive CHECK (revision > 0),
  CONSTRAINT content_records_hash_format CHECK (
    content_hash IS NULL OR content_hash ~ '^[0-9a-f]{64}$'
  ),
  CONSTRAINT content_records_access_class_check CHECK (
    access_class IN ('FREE', 'PRO', 'PACK', 'INHERIT')
  ),
  CONSTRAINT content_records_entitlement_check CHECK (
    (access_class = 'PACK' AND required_entitlement_key IS NOT NULL) OR
    (access_class <> 'PACK' AND required_entitlement_key IS NULL)
  )
);

CREATE TABLE public.aircraft (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  manufacturer text NOT NULL,
  family text NOT NULL,
  variant text NOT NULL,
  display_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT aircraft_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

CREATE TABLE public.simulators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  name text NOT NULL,
  product_family text,
  display_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  support_status text NOT NULL DEFAULT 'PLANNED',
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT simulators_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT simulators_support_status_check CHECK (
    support_status IN ('PLANNED', 'SUPPORTED', 'DEPRECATED')
  )
);

CREATE TABLE public.addon_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  developer_name text NOT NULL,
  product_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  support_status text NOT NULL DEFAULT 'PLANNED',
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT addon_products_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT addon_products_support_status_check CHECK (
    support_status IN ('PLANNED', 'SUPPORTED', 'DEPRECATED')
  )
);

CREATE TABLE public.aircraft_implementations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  aircraft_id uuid NOT NULL REFERENCES public.aircraft(id) ON DELETE RESTRICT,
  simulator_id uuid NOT NULL REFERENCES public.simulators(id) ON DELETE RESTRICT,
  addon_product_id uuid NOT NULL REFERENCES public.addon_products(id) ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  support_status text NOT NULL DEFAULT 'PLANNED',
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT aircraft_implementations_combination_unique UNIQUE (
    aircraft_id,
    simulator_id,
    addon_product_id
  ),
  CONSTRAINT aircraft_implementations_slug_format CHECK (
    slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ),
  CONSTRAINT aircraft_implementations_support_status_check CHECK (
    support_status IN ('PLANNED', 'SUPPORTED', 'DEPRECATED')
  )
);

CREATE INDEX aircraft_implementations_aircraft_idx
  ON public.aircraft_implementations (aircraft_id);
CREATE INDEX aircraft_implementations_simulator_idx
  ON public.aircraft_implementations (simulator_id);
CREATE INDEX aircraft_implementations_addon_idx
  ON public.aircraft_implementations (addon_product_id);

CREATE TABLE public.journeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  aircraft_implementation_id uuid NOT NULL REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  slug text NOT NULL,
  title text NOT NULL,
  description text,
  difficulty text,
  estimated_scope text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT journeys_implementation_slug_unique UNIQUE (aircraft_implementation_id, slug),
  CONSTRAINT journeys_id_implementation_unique UNIQUE (id, aircraft_implementation_id),
  CONSTRAINT journeys_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT journeys_sort_order_nonnegative CHECK (sort_order >= 0)
);

CREATE INDEX journeys_implementation_sort_idx
  ON public.journeys (aircraft_implementation_id, sort_order);

CREATE TABLE public.procedures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  aircraft_implementation_id uuid NOT NULL REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  slug text NOT NULL,
  title text NOT NULL,
  short_description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT procedures_implementation_slug_unique UNIQUE (aircraft_implementation_id, slug),
  CONSTRAINT procedures_id_implementation_unique UNIQUE (id, aircraft_implementation_id),
  CONSTRAINT procedures_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT procedures_sort_order_nonnegative CHECK (sort_order >= 0)
);

CREATE INDEX procedures_implementation_sort_idx
  ON public.procedures (aircraft_implementation_id, sort_order);

CREATE TABLE public.journey_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aircraft_implementation_id uuid NOT NULL REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  journey_id uuid NOT NULL,
  procedure_id uuid NOT NULL,
  sequence integer NOT NULL,
  title_override text,
  is_required boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT journey_sections_journey_sequence_unique UNIQUE (journey_id, sequence),
  CONSTRAINT journey_sections_journey_procedure_unique UNIQUE (journey_id, procedure_id),
  CONSTRAINT journey_sections_sequence_positive CHECK (sequence > 0),
  CONSTRAINT journey_sections_journey_scope_fk FOREIGN KEY (
    journey_id,
    aircraft_implementation_id
  ) REFERENCES public.journeys (id, aircraft_implementation_id) ON DELETE RESTRICT,
  CONSTRAINT journey_sections_procedure_scope_fk FOREIGN KEY (
    procedure_id,
    aircraft_implementation_id
  ) REFERENCES public.procedures (id, aircraft_implementation_id) ON DELETE RESTRICT
);

CREATE INDEX journey_sections_procedure_idx
  ON public.journey_sections (procedure_id);

CREATE TABLE public.procedure_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  aircraft_implementation_id uuid NOT NULL REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  procedure_id uuid NOT NULL,
  sequence integer NOT NULL,
  step_type text NOT NULL,
  title text NOT NULL,
  action_text text,
  location_hint text,
  expected_result text,
  explanation text,
  tip text,
  warning text,
  is_optional boolean NOT NULL DEFAULT false,
  wait_hint text,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT procedure_steps_procedure_sequence_unique UNIQUE (procedure_id, sequence),
  CONSTRAINT procedure_steps_id_implementation_unique UNIQUE (id, aircraft_implementation_id),
  CONSTRAINT procedure_steps_sequence_positive CHECK (sequence > 0),
  CONSTRAINT procedure_steps_type_check CHECK (
    step_type IN ('ACTION', 'VERIFY', 'WAIT', 'INFORMATION', 'MULTI_ACTION')
  ),
  CONSTRAINT procedure_steps_procedure_scope_fk FOREIGN KEY (
    procedure_id,
    aircraft_implementation_id
  ) REFERENCES public.procedures (id, aircraft_implementation_id) ON DELETE RESTRICT
);

CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  aircraft_implementation_id uuid REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  asset_type text NOT NULL,
  storage_key text NOT NULL UNIQUE,
  mime_type text NOT NULL,
  width integer NOT NULL,
  height integer NOT NULL,
  original_filename text,
  accessible_description text NOT NULL,
  checksum text NOT NULL,
  capture_context text,
  captured_addon_version text,
  captured_simulator_version text,
  rights_status text NOT NULL DEFAULT 'PENDING',
  verification_status text NOT NULL DEFAULT 'PENDING',
  is_original_capture boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT media_assets_id_implementation_unique UNIQUE (id, aircraft_implementation_id),
  CONSTRAINT media_assets_asset_type_check CHECK (asset_type IN (
    'COCKPIT_VIEW',
    'GUIDE_VISUAL',
    'AIRCRAFT_IDENTITY',
    'SYSTEM_ILLUSTRATION',
    'SUPPORTING_DIAGRAM'
  )),
  CONSTRAINT media_assets_storage_key_check CHECK (
    storage_key <> '' AND
    storage_key !~ '(^/|\\\\|(^|/)\.\.(/|$))'
  ),
  CONSTRAINT media_assets_mime_type_format CHECK (
    mime_type ~ '^[a-z0-9.+-]+/[a-z0-9.+-]+$'
  ),
  CONSTRAINT media_assets_dimensions_positive CHECK (width > 0 AND height > 0),
  CONSTRAINT media_assets_checksum_format CHECK (checksum ~ '^[0-9a-f]{64}$'),
  CONSTRAINT media_assets_rights_status_check CHECK (
    rights_status IN ('PENDING', 'APPROVED', 'REJECTED')
  ),
  CONSTRAINT media_assets_verification_status_check CHECK (
    verification_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'STALE')
  )
);

CREATE INDEX media_assets_implementation_idx
  ON public.media_assets (aircraft_implementation_id);

CREATE TABLE public.cockpit_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  aircraft_implementation_id uuid NOT NULL REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  parent_area_id uuid,
  area_type text NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT cockpit_areas_implementation_slug_unique UNIQUE (aircraft_implementation_id, slug),
  CONSTRAINT cockpit_areas_id_implementation_unique UNIQUE (id, aircraft_implementation_id),
  CONSTRAINT cockpit_areas_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT cockpit_areas_type_check CHECK (area_type IN ('COCKPIT', 'REGION', 'PANEL', 'AREA')),
  CONSTRAINT cockpit_areas_sort_order_nonnegative CHECK (sort_order >= 0),
  CONSTRAINT cockpit_areas_not_self_parent CHECK (parent_area_id IS NULL OR parent_area_id <> id),
  CONSTRAINT cockpit_areas_parent_scope_fk FOREIGN KEY (
    parent_area_id,
    aircraft_implementation_id
  ) REFERENCES public.cockpit_areas (id, aircraft_implementation_id) ON DELETE RESTRICT
);

CREATE INDEX cockpit_areas_parent_idx ON public.cockpit_areas (parent_area_id);
CREATE INDEX cockpit_areas_implementation_sort_idx
  ON public.cockpit_areas (aircraft_implementation_id, sort_order);

CREATE TABLE public.aircraft_systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  aircraft_implementation_id uuid NOT NULL REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  slug text NOT NULL,
  title text NOT NULL,
  short_description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT aircraft_systems_implementation_slug_unique UNIQUE (aircraft_implementation_id, slug),
  CONSTRAINT aircraft_systems_id_implementation_unique UNIQUE (id, aircraft_implementation_id),
  CONSTRAINT aircraft_systems_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT aircraft_systems_sort_order_nonnegative CHECK (sort_order >= 0)
);

CREATE INDEX aircraft_systems_implementation_sort_idx
  ON public.aircraft_systems (aircraft_implementation_id, sort_order);

CREATE TABLE public.system_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  aircraft_implementation_id uuid NOT NULL REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  aircraft_system_id uuid NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  component_type text,
  what_it_does text,
  why_it_matters text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT system_components_system_slug_unique UNIQUE (aircraft_system_id, slug),
  CONSTRAINT system_components_id_implementation_unique UNIQUE (id, aircraft_implementation_id),
  CONSTRAINT system_components_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT system_components_sort_order_nonnegative CHECK (sort_order >= 0),
  CONSTRAINT system_components_system_scope_fk FOREIGN KEY (
    aircraft_system_id,
    aircraft_implementation_id
  ) REFERENCES public.aircraft_systems (id, aircraft_implementation_id) ON DELETE RESTRICT
);

CREATE INDEX system_components_system_sort_idx
  ON public.system_components (aircraft_system_id, sort_order);

CREATE TABLE public.concepts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  aircraft_implementation_id uuid REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  slug text NOT NULL,
  title text NOT NULL,
  short_definition text NOT NULL,
  why_it_matters text,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT concepts_scope_slug_unique UNIQUE NULLS NOT DISTINCT (
    aircraft_implementation_id,
    slug
  ),
  CONSTRAINT concepts_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

CREATE TABLE public.controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  aircraft_implementation_id uuid NOT NULL REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  cockpit_area_id uuid NOT NULL,
  aircraft_system_id uuid,
  slug text NOT NULL,
  canonical_name text NOT NULL,
  control_type text NOT NULL,
  what_it_does text,
  when_used text,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT controls_implementation_slug_unique UNIQUE (aircraft_implementation_id, slug),
  CONSTRAINT controls_id_implementation_unique UNIQUE (id, aircraft_implementation_id),
  CONSTRAINT controls_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT controls_type_check CHECK (control_type IN (
    'SWITCH',
    'BUTTON',
    'KNOB',
    'LEVER',
    'SELECTOR',
    'DISPLAY',
    'INDICATOR',
    'ANNUNCIATOR',
    'GAUGE',
    'GROUP',
    'OTHER'
  )),
  CONSTRAINT controls_area_scope_fk FOREIGN KEY (
    cockpit_area_id,
    aircraft_implementation_id
  ) REFERENCES public.cockpit_areas (id, aircraft_implementation_id) ON DELETE RESTRICT,
  CONSTRAINT controls_system_scope_fk FOREIGN KEY (
    aircraft_system_id,
    aircraft_implementation_id
  ) REFERENCES public.aircraft_systems (id, aircraft_implementation_id) ON DELETE RESTRICT
);

CREATE INDEX controls_area_idx ON public.controls (cockpit_area_id);
CREATE INDEX controls_system_idx ON public.controls (aircraft_system_id);

CREATE TABLE public.cockpit_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  aircraft_implementation_id uuid NOT NULL REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  cockpit_area_id uuid NOT NULL,
  media_asset_id uuid NOT NULL,
  view_role text NOT NULL,
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT cockpit_views_id_implementation_unique UNIQUE (id, aircraft_implementation_id),
  CONSTRAINT cockpit_views_area_sort_unique UNIQUE (cockpit_area_id, sort_order),
  CONSTRAINT cockpit_views_role_check CHECK (
    view_role IN ('OVERVIEW', 'PRIMARY', 'ALTERNATE', 'GUIDE', 'CLOSEUP')
  ),
  CONSTRAINT cockpit_views_sort_order_nonnegative CHECK (sort_order >= 0),
  CONSTRAINT cockpit_views_area_scope_fk FOREIGN KEY (
    cockpit_area_id,
    aircraft_implementation_id
  ) REFERENCES public.cockpit_areas (id, aircraft_implementation_id) ON DELETE RESTRICT,
  CONSTRAINT cockpit_views_media_scope_fk FOREIGN KEY (
    media_asset_id,
    aircraft_implementation_id
  ) REFERENCES public.media_assets (id, aircraft_implementation_id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX cockpit_views_one_primary_per_area_idx
  ON public.cockpit_views (cockpit_area_id)
  WHERE is_primary;
CREATE INDEX cockpit_views_media_idx ON public.cockpit_views (media_asset_id);

CREATE TABLE public.hotspots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL UNIQUE REFERENCES public.content_records(id) ON DELETE RESTRICT,
  aircraft_implementation_id uuid NOT NULL REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  cockpit_view_id uuid NOT NULL,
  target_cockpit_area_id uuid,
  target_control_id uuid,
  x numeric NOT NULL,
  y numeric NOT NULL,
  width numeric NOT NULL,
  height numeric NOT NULL,
  shape text NOT NULL DEFAULT 'RECTANGLE',
  label text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT hotspots_id_implementation_unique UNIQUE (id, aircraft_implementation_id),
  CONSTRAINT hotspots_id_view_implementation_unique UNIQUE (
    id,
    cockpit_view_id,
    aircraft_implementation_id
  ),
  CONSTRAINT hotspots_view_sort_unique UNIQUE (cockpit_view_id, sort_order),
  CONSTRAINT hotspots_shape_check CHECK (shape = 'RECTANGLE'),
  CONSTRAINT hotspots_sort_order_nonnegative CHECK (sort_order >= 0),
  CONSTRAINT hotspots_normalized_geometry_check CHECK (
    x >= 0 AND x <= 1 AND
    y >= 0 AND y <= 1 AND
    width > 0 AND width <= 1 AND
    height > 0 AND height <= 1 AND
    x + width <= 1 AND
    y + height <= 1
  ),
  CONSTRAINT hotspots_exactly_one_target_check CHECK (
    num_nonnulls(target_cockpit_area_id, target_control_id) = 1
  ),
  CONSTRAINT hotspots_view_scope_fk FOREIGN KEY (
    cockpit_view_id,
    aircraft_implementation_id
  ) REFERENCES public.cockpit_views (id, aircraft_implementation_id) ON DELETE RESTRICT,
  CONSTRAINT hotspots_area_scope_fk FOREIGN KEY (
    target_cockpit_area_id,
    aircraft_implementation_id
  ) REFERENCES public.cockpit_areas (id, aircraft_implementation_id) ON DELETE RESTRICT,
  CONSTRAINT hotspots_control_scope_fk FOREIGN KEY (
    target_control_id,
    aircraft_implementation_id
  ) REFERENCES public.controls (id, aircraft_implementation_id) ON DELETE RESTRICT
);

CREATE INDEX hotspots_target_area_idx ON public.hotspots (target_cockpit_area_id);
CREATE INDEX hotspots_target_control_idx ON public.hotspots (target_control_id);

CREATE TABLE public.procedure_step_controls (
  aircraft_implementation_id uuid NOT NULL REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  procedure_step_id uuid NOT NULL,
  control_id uuid NOT NULL,
  role text NOT NULL,
  sequence integer NOT NULL,
  preferred_hotspot_id uuid,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT procedure_step_controls_pk PRIMARY KEY (procedure_step_id, control_id),
  CONSTRAINT procedure_step_controls_sequence_unique UNIQUE (procedure_step_id, sequence),
  CONSTRAINT procedure_step_controls_role_check CHECK (
    role IN ('ACTION_TARGET', 'VERIFY_TARGET', 'CONTEXT')
  ),
  CONSTRAINT procedure_step_controls_sequence_positive CHECK (sequence > 0),
  CONSTRAINT procedure_step_controls_step_scope_fk FOREIGN KEY (
    procedure_step_id,
    aircraft_implementation_id
  ) REFERENCES public.procedure_steps (id, aircraft_implementation_id) ON DELETE RESTRICT,
  CONSTRAINT procedure_step_controls_control_scope_fk FOREIGN KEY (
    control_id,
    aircraft_implementation_id
  ) REFERENCES public.controls (id, aircraft_implementation_id) ON DELETE RESTRICT,
  CONSTRAINT procedure_step_controls_hotspot_scope_fk FOREIGN KEY (
    preferred_hotspot_id,
    aircraft_implementation_id
  ) REFERENCES public.hotspots (id, aircraft_implementation_id) ON DELETE RESTRICT
);

CREATE INDEX procedure_step_controls_control_idx
  ON public.procedure_step_controls (control_id);
CREATE INDEX procedure_step_controls_hotspot_idx
  ON public.procedure_step_controls (preferred_hotspot_id);

CREATE TABLE public.system_component_controls (
  aircraft_implementation_id uuid NOT NULL REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  system_component_id uuid NOT NULL,
  control_id uuid NOT NULL,
  relation_type text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT system_component_controls_pk PRIMARY KEY (system_component_id, control_id),
  CONSTRAINT system_component_controls_sort_order_nonnegative CHECK (sort_order >= 0),
  CONSTRAINT system_component_controls_component_scope_fk FOREIGN KEY (
    system_component_id,
    aircraft_implementation_id
  ) REFERENCES public.system_components (id, aircraft_implementation_id) ON DELETE RESTRICT,
  CONSTRAINT system_component_controls_control_scope_fk FOREIGN KEY (
    control_id,
    aircraft_implementation_id
  ) REFERENCES public.controls (id, aircraft_implementation_id) ON DELETE RESTRICT
);

CREATE INDEX system_component_controls_control_idx
  ON public.system_component_controls (control_id);

CREATE TABLE public.system_component_concepts (
  system_component_id uuid NOT NULL REFERENCES public.system_components(id) ON DELETE RESTRICT,
  concept_id uuid NOT NULL REFERENCES public.concepts(id) ON DELETE RESTRICT,
  relation_type text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT system_component_concepts_pk PRIMARY KEY (system_component_id, concept_id),
  CONSTRAINT system_component_concepts_sort_order_nonnegative CHECK (sort_order >= 0)
);

CREATE INDEX system_component_concepts_concept_idx
  ON public.system_component_concepts (concept_id);

CREATE TABLE public.procedure_step_visuals (
  aircraft_implementation_id uuid NOT NULL REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT,
  procedure_step_id uuid NOT NULL,
  cockpit_view_id uuid,
  media_asset_id uuid REFERENCES public.media_assets(id) ON DELETE RESTRICT,
  hotspot_id uuid,
  role text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT procedure_step_visuals_pk PRIMARY KEY (procedure_step_id, sort_order),
  CONSTRAINT procedure_step_visuals_role_check CHECK (
    role IN ('PRIMARY', 'ORIENTATION', 'SECONDARY')
  ),
  CONSTRAINT procedure_step_visuals_sort_order_nonnegative CHECK (sort_order >= 0),
  CONSTRAINT procedure_step_visuals_visual_required CHECK (
    cockpit_view_id IS NOT NULL OR media_asset_id IS NOT NULL
  ),
  CONSTRAINT procedure_step_visuals_hotspot_requires_view CHECK (
    hotspot_id IS NULL OR cockpit_view_id IS NOT NULL
  ),
  CONSTRAINT procedure_step_visuals_step_scope_fk FOREIGN KEY (
    procedure_step_id,
    aircraft_implementation_id
  ) REFERENCES public.procedure_steps (id, aircraft_implementation_id) ON DELETE RESTRICT,
  CONSTRAINT procedure_step_visuals_view_scope_fk FOREIGN KEY (
    cockpit_view_id,
    aircraft_implementation_id
  ) REFERENCES public.cockpit_views (id, aircraft_implementation_id) ON DELETE RESTRICT,
  CONSTRAINT procedure_step_visuals_hotspot_view_scope_fk FOREIGN KEY (
    hotspot_id,
    cockpit_view_id,
    aircraft_implementation_id
  ) REFERENCES public.hotspots (
    id,
    cockpit_view_id,
    aircraft_implementation_id
  ) ON DELETE RESTRICT
);

CREATE INDEX procedure_step_visuals_view_idx
  ON public.procedure_step_visuals (cockpit_view_id);
CREATE INDEX procedure_step_visuals_media_idx
  ON public.procedure_step_visuals (media_asset_id);
CREATE INDEX procedure_step_visuals_hotspot_idx
  ON public.procedure_step_visuals (hotspot_id);

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'content_records',
    'aircraft',
    'simulators',
    'addon_products',
    'aircraft_implementations',
    'journeys',
    'procedures',
    'journey_sections',
    'procedure_steps',
    'media_assets',
    'cockpit_areas',
    'aircraft_systems',
    'system_components',
    'concepts',
    'controls',
    'cockpit_views',
    'hotspots'
  ]
  LOOP
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.cockpitpath_set_updated_at()',
      table_name || '_set_updated_at',
      table_name
    );
  END LOOP;
END;
$$;

-- Down Migration

DROP TABLE public.procedure_step_visuals;
DROP TABLE public.system_component_concepts;
DROP TABLE public.system_component_controls;
DROP TABLE public.procedure_step_controls;
DROP TABLE public.hotspots;
DROP TABLE public.cockpit_views;
DROP TABLE public.controls;
DROP TABLE public.concepts;
DROP TABLE public.system_components;
DROP TABLE public.aircraft_systems;
DROP TABLE public.cockpit_areas;
DROP TABLE public.media_assets;
DROP TABLE public.procedure_steps;
DROP TABLE public.journey_sections;
DROP TABLE public.procedures;
DROP TABLE public.journeys;
DROP TABLE public.aircraft_implementations;
DROP TABLE public.addon_products;
DROP TABLE public.simulators;
DROP TABLE public.aircraft;
DROP TABLE public.content_records;
DROP FUNCTION public.cockpitpath_set_updated_at();
