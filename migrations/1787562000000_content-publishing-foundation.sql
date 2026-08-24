-- Up Migration

ALTER TABLE public.content_records
  ADD COLUMN audience text NOT NULL DEFAULT 'AUTHENTICATED',
  ADD CONSTRAINT content_records_audience_check
    CHECK (audience IN ('PUBLIC', 'AUTHENTICATED'));

CREATE TABLE public.source_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_key text NOT NULL UNIQUE,
  source_type text NOT NULL,
  title text NOT NULL,
  publisher text,
  url text,
  repository_identifier text,
  document_version text,
  publication_date date,
  notes text,
  access_rights text,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT source_references_key_format CHECK (
    source_key ~ '^source(\.[a-z0-9]+(-[a-z0-9]+)*)+$'
  ),
  CONSTRAINT source_references_type_check CHECK (source_type IN (
    'ADDON_DOCUMENTATION',
    'AIRCRAFT_DOCUMENTATION',
    'SIMULATOR_DOCUMENTATION',
    'TRAINING_MATERIAL',
    'DIRECT_SIMULATOR_TEST',
    'OTHER'
  )),
  CONSTRAINT source_references_locator_check CHECK (
    url IS NOT NULL OR repository_identifier IS NOT NULL
  )
);

CREATE TRIGGER source_references_set_updated_at
BEFORE UPDATE ON public.source_references
FOR EACH ROW EXECUTE FUNCTION public.cockpitpath_set_updated_at();

CREATE TABLE public.content_sources (
  content_record_id uuid NOT NULL,
  source_reference_id uuid NOT NULL,
  purpose text NOT NULL,
  locator text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT content_sources_pk PRIMARY KEY (content_record_id, source_reference_id, purpose),
  CONSTRAINT content_sources_purpose_check CHECK (
    purpose IN ('IDENTITY', 'PROCEDURE', 'CONTROL', 'SYSTEM', 'MEDIA', 'OTHER')
  ),
  CONSTRAINT content_sources_content_fk FOREIGN KEY (content_record_id)
    REFERENCES public.content_records(id) ON DELETE RESTRICT,
  CONSTRAINT content_sources_source_fk FOREIGN KEY (source_reference_id)
    REFERENCES public.source_references(id) ON DELETE RESTRICT
);

CREATE INDEX content_sources_source_idx
  ON public.content_sources (source_reference_id);

CREATE TABLE public.verification_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id uuid NOT NULL,
  aircraft_implementation_id uuid,
  verification_status text NOT NULL,
  content_revision integer NOT NULL,
  content_hash text NOT NULL,
  addon_version text,
  simulator_version text,
  verified_at timestamptz,
  verified_by text,
  method text,
  notes text,
  limitations text,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT verification_events_status_check CHECK (
    verification_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'STALE')
  ),
  CONSTRAINT verification_events_revision_positive CHECK (content_revision > 0),
  CONSTRAINT verification_events_hash_format CHECK (content_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT verification_events_verified_fields_check CHECK (
    verification_status <> 'VERIFIED' OR
    (verified_at IS NOT NULL AND verified_by IS NOT NULL AND method IS NOT NULL)
  ),
  CONSTRAINT verification_events_identity_unique UNIQUE (
    content_record_id,
    content_revision,
    content_hash,
    verification_status,
    verified_at,
    verified_by
  ),
  CONSTRAINT verification_events_content_fk FOREIGN KEY (content_record_id)
    REFERENCES public.content_records(id) ON DELETE RESTRICT,
  CONSTRAINT verification_events_implementation_fk FOREIGN KEY (aircraft_implementation_id)
    REFERENCES public.aircraft_implementations(id) ON DELETE RESTRICT
);

CREATE INDEX verification_events_content_status_idx
  ON public.verification_events (content_record_id, verification_status, verified_at DESC);
CREATE INDEX verification_events_implementation_idx
  ON public.verification_events (aircraft_implementation_id);

CREATE TABLE public.content_publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  environment text NOT NULL,
  source_digest text NOT NULL,
  repository_revision text,
  published_by text NOT NULL,
  result text NOT NULL DEFAULT 'SUCCEEDED',
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  completed_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT content_publications_environment_check CHECK (
    environment = 'development' OR
    environment LIKE 'test/%' OR
    environment LIKE 'preview/%'
  ),
  CONSTRAINT content_publications_digest_format CHECK (source_digest ~ '^[0-9a-f]{64}$'),
  CONSTRAINT content_publications_result_check CHECK (
    result IN ('SUCCEEDED', 'FAILED')
  )
);

CREATE TABLE public.content_publication_items (
  publication_id uuid NOT NULL,
  content_record_id uuid NOT NULL,
  action text NOT NULL,
  previous_revision integer,
  published_revision integer NOT NULL,
  content_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT content_publication_items_pk PRIMARY KEY (publication_id, content_record_id),
  CONSTRAINT content_publication_items_action_check CHECK (
    action IN ('INSERT', 'UPDATE', 'ARCHIVE')
  ),
  CONSTRAINT content_publication_items_revision_positive CHECK (
    published_revision > 0 AND
    (previous_revision IS NULL OR previous_revision > 0)
  ),
  CONSTRAINT content_publication_items_hash_format CHECK (content_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT content_publication_items_publication_fk FOREIGN KEY (publication_id)
    REFERENCES public.content_publications(id) ON DELETE RESTRICT,
  CONSTRAINT content_publication_items_content_fk FOREIGN KEY (content_record_id)
    REFERENCES public.content_records(id) ON DELETE RESTRICT
);

CREATE INDEX content_publication_items_content_idx
  ON public.content_publication_items (content_record_id);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cockpitpath_content_reader') THEN
    CREATE ROLE cockpitpath_content_reader NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cockpitpath_publisher') THEN
    CREATE ROLE cockpitpath_publisher NOLOGIN;
  END IF;
END;
$$;

CREATE SCHEMA cockpitpath_published AUTHORIZATION neondb_owner;
REVOKE ALL ON SCHEMA cockpitpath_published FROM PUBLIC;

CREATE VIEW cockpitpath_published.content_records
WITH (security_barrier = true)
AS
SELECT *
FROM public.content_records
WHERE status = 'PUBLISHED';

CREATE VIEW cockpitpath_published.aircraft WITH (security_barrier = true) AS
SELECT entity.* FROM public.aircraft entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';
CREATE VIEW cockpitpath_published.simulators WITH (security_barrier = true) AS
SELECT entity.* FROM public.simulators entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';
CREATE VIEW cockpitpath_published.addon_products WITH (security_barrier = true) AS
SELECT entity.* FROM public.addon_products entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';
CREATE VIEW cockpitpath_published.aircraft_implementations WITH (security_barrier = true) AS
SELECT entity.* FROM public.aircraft_implementations entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';
CREATE VIEW cockpitpath_published.journeys WITH (security_barrier = true) AS
SELECT entity.* FROM public.journeys entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';
CREATE VIEW cockpitpath_published.procedures WITH (security_barrier = true) AS
SELECT entity.* FROM public.procedures entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';
CREATE VIEW cockpitpath_published.procedure_steps WITH (security_barrier = true) AS
SELECT entity.* FROM public.procedure_steps entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';
CREATE VIEW cockpitpath_published.media_assets WITH (security_barrier = true) AS
SELECT entity.* FROM public.media_assets entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';
CREATE VIEW cockpitpath_published.cockpit_areas WITH (security_barrier = true) AS
SELECT entity.* FROM public.cockpit_areas entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';
CREATE VIEW cockpitpath_published.cockpit_views WITH (security_barrier = true) AS
SELECT entity.* FROM public.cockpit_views entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';
CREATE VIEW cockpitpath_published.controls WITH (security_barrier = true) AS
SELECT entity.* FROM public.controls entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';
CREATE VIEW cockpitpath_published.hotspots WITH (security_barrier = true) AS
SELECT entity.* FROM public.hotspots entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';
CREATE VIEW cockpitpath_published.aircraft_systems WITH (security_barrier = true) AS
SELECT entity.* FROM public.aircraft_systems entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';
CREATE VIEW cockpitpath_published.system_components WITH (security_barrier = true) AS
SELECT entity.* FROM public.system_components entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';
CREATE VIEW cockpitpath_published.concepts WITH (security_barrier = true) AS
SELECT entity.* FROM public.concepts entity
JOIN public.content_records record ON record.id = entity.content_record_id
WHERE record.status = 'PUBLISHED';

CREATE VIEW cockpitpath_published.journey_sections WITH (security_barrier = true) AS
SELECT relation.* FROM public.journey_sections relation
JOIN public.journeys journey ON journey.id = relation.journey_id
JOIN public.content_records journey_record ON journey_record.id = journey.content_record_id
JOIN public.procedures procedure ON procedure.id = relation.procedure_id
JOIN public.content_records procedure_record ON procedure_record.id = procedure.content_record_id
WHERE journey_record.status = 'PUBLISHED' AND procedure_record.status = 'PUBLISHED';

CREATE VIEW cockpitpath_published.procedure_step_controls WITH (security_barrier = true) AS
SELECT relation.* FROM public.procedure_step_controls relation
JOIN public.procedure_steps step ON step.id = relation.procedure_step_id
JOIN public.content_records step_record ON step_record.id = step.content_record_id
JOIN public.controls control ON control.id = relation.control_id
JOIN public.content_records control_record ON control_record.id = control.content_record_id
LEFT JOIN public.hotspots hotspot ON hotspot.id = relation.preferred_hotspot_id
LEFT JOIN public.content_records hotspot_record ON hotspot_record.id = hotspot.content_record_id
WHERE step_record.status = 'PUBLISHED'
  AND control_record.status = 'PUBLISHED'
  AND (relation.preferred_hotspot_id IS NULL OR hotspot_record.status = 'PUBLISHED');

CREATE VIEW cockpitpath_published.procedure_step_visuals WITH (security_barrier = true) AS
SELECT relation.* FROM public.procedure_step_visuals relation
JOIN public.procedure_steps step ON step.id = relation.procedure_step_id
JOIN public.content_records step_record ON step_record.id = step.content_record_id
LEFT JOIN public.cockpit_views view_entity ON view_entity.id = relation.cockpit_view_id
LEFT JOIN public.content_records view_record ON view_record.id = view_entity.content_record_id
LEFT JOIN public.media_assets media ON media.id = relation.media_asset_id
LEFT JOIN public.content_records media_record ON media_record.id = media.content_record_id
LEFT JOIN public.hotspots hotspot ON hotspot.id = relation.hotspot_id
LEFT JOIN public.content_records hotspot_record ON hotspot_record.id = hotspot.content_record_id
WHERE step_record.status = 'PUBLISHED'
  AND (relation.cockpit_view_id IS NULL OR view_record.status = 'PUBLISHED')
  AND (relation.media_asset_id IS NULL OR media_record.status = 'PUBLISHED')
  AND (relation.hotspot_id IS NULL OR hotspot_record.status = 'PUBLISHED');

CREATE VIEW cockpitpath_published.system_component_controls WITH (security_barrier = true) AS
SELECT relation.* FROM public.system_component_controls relation
JOIN public.system_components component ON component.id = relation.system_component_id
JOIN public.content_records component_record ON component_record.id = component.content_record_id
JOIN public.controls control ON control.id = relation.control_id
JOIN public.content_records control_record ON control_record.id = control.content_record_id
WHERE component_record.status = 'PUBLISHED' AND control_record.status = 'PUBLISHED';

CREATE VIEW cockpitpath_published.system_component_concepts WITH (security_barrier = true) AS
SELECT relation.* FROM public.system_component_concepts relation
JOIN public.system_components component ON component.id = relation.system_component_id
JOIN public.content_records component_record ON component_record.id = component.content_record_id
JOIN public.concepts concept ON concept.id = relation.concept_id
JOIN public.content_records concept_record ON concept_record.id = concept.content_record_id
WHERE component_record.status = 'PUBLISHED' AND concept_record.status = 'PUBLISHED';

GRANT USAGE ON SCHEMA cockpitpath_published TO cockpitpath_content_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA cockpitpath_published TO cockpitpath_content_reader;

GRANT USAGE ON SCHEMA public TO cockpitpath_publisher;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO cockpitpath_publisher;
GRANT UPDATE ON public.content_records,
  public.source_references,
  public.content_publications,
  public.aircraft,
  public.simulators,
  public.addon_products,
  public.aircraft_implementations,
  public.journeys,
  public.procedures,
  public.procedure_steps,
  public.media_assets,
  public.cockpit_areas,
  public.cockpit_views,
  public.controls,
  public.hotspots,
  public.aircraft_systems,
  public.system_components,
  public.concepts
TO cockpitpath_publisher;
GRANT DELETE ON public.journey_sections,
  public.procedure_step_controls,
  public.procedure_step_visuals,
  public.system_component_controls,
  public.system_component_concepts,
  public.content_sources
TO cockpitpath_publisher;

GRANT cockpitpath_content_reader, cockpitpath_publisher TO neondb_owner;

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public
  FROM PUBLIC, anonymous, authenticated, authenticator;
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA cockpitpath_published
  FROM PUBLIC, anonymous, authenticated, authenticator;

-- Down Migration

REVOKE cockpitpath_content_reader, cockpitpath_publisher FROM neondb_owner;
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA cockpitpath_published
  FROM cockpitpath_content_reader;
REVOKE ALL PRIVILEGES ON SCHEMA cockpitpath_published
  FROM cockpitpath_content_reader;
DROP SCHEMA cockpitpath_published CASCADE;

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM cockpitpath_publisher;
REVOKE ALL PRIVILEGES ON SCHEMA public FROM cockpitpath_publisher;
DROP ROLE cockpitpath_content_reader;
DROP ROLE cockpitpath_publisher;

DROP TABLE public.content_publication_items;
DROP TABLE public.content_publications;
DROP TABLE public.verification_events;
DROP TABLE public.content_sources;
DROP TABLE public.source_references;

ALTER TABLE public.content_records
  DROP CONSTRAINT content_records_audience_check,
  DROP COLUMN audience;
