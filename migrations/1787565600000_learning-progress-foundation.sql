-- Up Migration

-- Neon Data API exposes the verified Neon Auth subject through auth.user_id()
-- as text. Keep CockpitPath progress weakly coupled to the managed Auth schema.
ALTER TABLE public.journey_sections
  ADD CONSTRAINT journey_sections_id_journey_unique UNIQUE (id, journey_id);

ALTER TABLE public.procedure_steps
  ADD CONSTRAINT procedure_steps_id_procedure_unique UNIQUE (id, procedure_id);

-- Data API manages schema-level access to auth. Bind the proven identity helper
-- at definition time so CockpitPath roles need only its narrow EXECUTE privilege.
CREATE FUNCTION public.cockpitpath_auth_user_id()
RETURNS text
LANGUAGE sql
STABLE
BEGIN ATOMIC
  SELECT auth.user_id();
END;
REVOKE ALL ON FUNCTION public.cockpitpath_auth_user_id() FROM PUBLIC;

CREATE TABLE public.user_journey_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL DEFAULT public.cockpitpath_auth_user_id(),
  journey_id uuid NOT NULL REFERENCES public.journeys(id) ON DELETE RESTRICT,
  progress_status text NOT NULL DEFAULT 'NOT_STARTED',
  current_journey_section_id uuid,
  current_procedure_step_id uuid REFERENCES public.procedure_steps(id) ON DELETE RESTRICT,
  guide_mode text NOT NULL DEFAULT 'LEARN',
  started_at timestamptz,
  completed_at timestamptz,
  last_activity_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT user_journey_progress_user_journey_unique UNIQUE (user_id, journey_id),
  CONSTRAINT user_journey_progress_user_nonempty CHECK (user_id <> ''),
  CONSTRAINT user_journey_progress_status_check CHECK (
    progress_status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')
  ),
  CONSTRAINT user_journey_progress_guide_mode_check CHECK (guide_mode IN ('QUICK', 'LEARN')),
  CONSTRAINT user_journey_progress_timestamps_check CHECK (
    (progress_status = 'NOT_STARTED' AND started_at IS NULL AND completed_at IS NULL AND last_activity_at IS NULL) OR
    (progress_status = 'IN_PROGRESS' AND started_at IS NOT NULL AND completed_at IS NULL AND last_activity_at IS NOT NULL) OR
    (progress_status = 'COMPLETED' AND started_at IS NOT NULL AND completed_at IS NOT NULL AND last_activity_at IS NOT NULL)
  ),
  CONSTRAINT user_journey_progress_timestamp_order_check CHECK (
    (last_activity_at IS NULL OR started_at IS NULL OR last_activity_at >= started_at) AND
    (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at)
  ),
  CONSTRAINT user_journey_progress_section_fk FOREIGN KEY (
    current_journey_section_id,
    journey_id
  ) REFERENCES public.journey_sections (id, journey_id) ON DELETE RESTRICT
);

CREATE INDEX user_journey_progress_user_activity_idx
  ON public.user_journey_progress (user_id, last_activity_at DESC);
CREATE INDEX user_journey_progress_journey_idx
  ON public.user_journey_progress (journey_id);

CREATE TABLE public.user_procedure_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL DEFAULT public.cockpitpath_auth_user_id(),
  procedure_id uuid NOT NULL REFERENCES public.procedures(id) ON DELETE RESTRICT,
  progress_status text NOT NULL DEFAULT 'NOT_STARTED',
  current_step_id uuid,
  started_at timestamptz,
  completed_at timestamptz,
  last_activity_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT user_procedure_progress_user_procedure_unique UNIQUE (user_id, procedure_id),
  CONSTRAINT user_procedure_progress_user_nonempty CHECK (user_id <> ''),
  CONSTRAINT user_procedure_progress_status_check CHECK (
    progress_status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')
  ),
  CONSTRAINT user_procedure_progress_timestamps_check CHECK (
    (progress_status = 'NOT_STARTED' AND started_at IS NULL AND completed_at IS NULL AND last_activity_at IS NULL) OR
    (progress_status = 'IN_PROGRESS' AND started_at IS NOT NULL AND completed_at IS NULL AND last_activity_at IS NOT NULL) OR
    (progress_status = 'COMPLETED' AND started_at IS NOT NULL AND completed_at IS NOT NULL AND last_activity_at IS NOT NULL)
  ),
  CONSTRAINT user_procedure_progress_timestamp_order_check CHECK (
    (last_activity_at IS NULL OR started_at IS NULL OR last_activity_at >= started_at) AND
    (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at)
  ),
  CONSTRAINT user_procedure_progress_step_fk FOREIGN KEY (
    current_step_id,
    procedure_id
  ) REFERENCES public.procedure_steps (id, procedure_id) ON DELETE RESTRICT
);

CREATE INDEX user_procedure_progress_user_activity_idx
  ON public.user_procedure_progress (user_id, last_activity_at DESC);
CREATE INDEX user_procedure_progress_procedure_idx
  ON public.user_procedure_progress (procedure_id);

CREATE TABLE public.user_step_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL DEFAULT public.cockpitpath_auth_user_id(),
  procedure_id uuid NOT NULL REFERENCES public.procedures(id) ON DELETE RESTRICT,
  procedure_step_id uuid NOT NULL,
  progress_status text NOT NULL,
  completed_at timestamptz,
  skipped_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  CONSTRAINT user_step_progress_user_step_unique UNIQUE (user_id, procedure_step_id),
  CONSTRAINT user_step_progress_user_nonempty CHECK (user_id <> ''),
  CONSTRAINT user_step_progress_status_check CHECK (progress_status IN ('COMPLETED', 'SKIPPED')),
  CONSTRAINT user_step_progress_outcome_timestamp_check CHECK (
    (progress_status = 'COMPLETED' AND completed_at IS NOT NULL AND skipped_at IS NULL) OR
    (progress_status = 'SKIPPED' AND completed_at IS NULL AND skipped_at IS NOT NULL)
  ),
  CONSTRAINT user_step_progress_step_fk FOREIGN KEY (
    procedure_step_id,
    procedure_id
  ) REFERENCES public.procedure_steps (id, procedure_id) ON DELETE RESTRICT
);

CREATE INDEX user_step_progress_user_procedure_idx
  ON public.user_step_progress (user_id, procedure_id);
CREATE INDEX user_step_progress_step_idx
  ON public.user_step_progress (procedure_step_id);

CREATE TRIGGER user_journey_progress_set_updated_at
BEFORE UPDATE ON public.user_journey_progress
FOR EACH ROW EXECUTE FUNCTION public.cockpitpath_set_updated_at();

CREATE TRIGGER user_procedure_progress_set_updated_at
BEFORE UPDATE ON public.user_procedure_progress
FOR EACH ROW EXECUTE FUNCTION public.cockpitpath_set_updated_at();

CREATE TRIGGER user_step_progress_set_updated_at
BEFORE UPDATE ON public.user_step_progress
FOR EACH ROW EXECUTE FUNCTION public.cockpitpath_set_updated_at();

ALTER TABLE public.user_journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey_progress FORCE ROW LEVEL SECURITY;
ALTER TABLE public.user_procedure_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_procedure_progress FORCE ROW LEVEL SECURITY;
ALTER TABLE public.user_step_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_step_progress FORCE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'cockpitpath_progress_writer') THEN
    CREATE ROLE cockpitpath_progress_writer NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
  END IF;
END;
$$;

CREATE SCHEMA cockpitpath_private;
REVOKE ALL ON SCHEMA cockpitpath_private FROM PUBLIC, anonymous, authenticated, authenticator;

GRANT cockpitpath_progress_writer TO neondb_owner;
GRANT USAGE ON SCHEMA public TO cockpitpath_progress_writer;
GRANT EXECUTE ON FUNCTION auth.user_id() TO cockpitpath_progress_writer;
GRANT EXECUTE ON FUNCTION public.cockpitpath_auth_user_id() TO cockpitpath_progress_writer;
GRANT SELECT ON public.content_records,
  public.journeys,
  public.journey_sections,
  public.procedures,
  public.procedure_steps
TO cockpitpath_progress_writer;
GRANT SELECT, INSERT, UPDATE ON public.user_journey_progress,
  public.user_procedure_progress,
  public.user_step_progress
TO cockpitpath_progress_writer;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.cockpitpath_auth_user_id() TO authenticated;
GRANT SELECT ON public.user_journey_progress,
  public.user_procedure_progress,
  public.user_step_progress
TO authenticated;

REVOKE ALL PRIVILEGES ON public.user_journey_progress,
  public.user_procedure_progress,
  public.user_step_progress
FROM PUBLIC, anonymous, authenticator;

CREATE POLICY user_journey_progress_select_own
ON public.user_journey_progress
FOR SELECT
TO authenticated
USING (user_id = public.cockpitpath_auth_user_id());

CREATE POLICY user_journey_progress_writer_select_context
ON public.user_journey_progress
FOR SELECT
TO cockpitpath_progress_writer
USING (user_id = current_setting('cockpitpath.authenticated_user_id', true));

CREATE POLICY user_journey_progress_insert_own
ON public.user_journey_progress
FOR INSERT
TO cockpitpath_progress_writer
WITH CHECK (user_id = current_setting('cockpitpath.authenticated_user_id', true));

CREATE POLICY user_journey_progress_update_own
ON public.user_journey_progress
FOR UPDATE
TO cockpitpath_progress_writer
USING (user_id = current_setting('cockpitpath.authenticated_user_id', true))
WITH CHECK (user_id = current_setting('cockpitpath.authenticated_user_id', true));

CREATE POLICY user_procedure_progress_select_own
ON public.user_procedure_progress
FOR SELECT
TO authenticated
USING (user_id = public.cockpitpath_auth_user_id());

CREATE POLICY user_procedure_progress_writer_select_context
ON public.user_procedure_progress
FOR SELECT
TO cockpitpath_progress_writer
USING (user_id = current_setting('cockpitpath.authenticated_user_id', true));

CREATE POLICY user_procedure_progress_insert_own
ON public.user_procedure_progress
FOR INSERT
TO cockpitpath_progress_writer
WITH CHECK (user_id = current_setting('cockpitpath.authenticated_user_id', true));

CREATE POLICY user_procedure_progress_update_own
ON public.user_procedure_progress
FOR UPDATE
TO cockpitpath_progress_writer
USING (user_id = current_setting('cockpitpath.authenticated_user_id', true))
WITH CHECK (user_id = current_setting('cockpitpath.authenticated_user_id', true));

CREATE POLICY user_step_progress_select_own
ON public.user_step_progress
FOR SELECT
TO authenticated
USING (user_id = public.cockpitpath_auth_user_id());

CREATE POLICY user_step_progress_writer_select_context
ON public.user_step_progress
FOR SELECT
TO cockpitpath_progress_writer
USING (user_id = current_setting('cockpitpath.authenticated_user_id', true));

CREATE POLICY user_step_progress_insert_own
ON public.user_step_progress
FOR INSERT
TO cockpitpath_progress_writer
WITH CHECK (user_id = current_setting('cockpitpath.authenticated_user_id', true));

CREATE POLICY user_step_progress_update_own
ON public.user_step_progress
FOR UPDATE
TO cockpitpath_progress_writer
USING (user_id = current_setting('cockpitpath.authenticated_user_id', true))
WITH CHECK (user_id = current_setting('cockpitpath.authenticated_user_id', true));

CREATE FUNCTION cockpitpath_private.cockpitpath_start_guide_impl(
  p_verified_user_id text,
  p_journey_id uuid,
  p_procedure_id uuid DEFAULT NULL
)
RETURNS TABLE (
  journey_progress_id uuid,
  current_journey_section_id uuid,
  current_procedure_step_id uuid,
  progress_status text,
  guide_mode text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = on
AS $$
DECLARE
  v_user_id text := p_verified_user_id;
  v_section public.journey_sections%ROWTYPE;
  v_step public.procedure_steps%ROWTYPE;
  v_now timestamptz := statement_timestamp();
BEGIN
  IF v_user_id IS NULL OR v_user_id = '' THEN
    RAISE EXCEPTION 'Authentication is required' USING ERRCODE = '42501';
  END IF;
  PERFORM set_config('cockpitpath.authenticated_user_id', v_user_id, true);

  SELECT section.*
  INTO v_section
  FROM public.journey_sections section
  JOIN public.journeys journey ON journey.id = section.journey_id
  JOIN public.content_records journey_record ON journey_record.id = journey.content_record_id
  JOIN public.procedures procedure ON procedure.id = section.procedure_id
  JOIN public.content_records procedure_record ON procedure_record.id = procedure.content_record_id
  WHERE section.journey_id = p_journey_id
    AND (p_procedure_id IS NULL OR section.procedure_id = p_procedure_id)
    AND journey_record.status = 'PUBLISHED'
    AND procedure_record.status = 'PUBLISHED'
  ORDER BY section.sequence
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Published guide content was not found' USING ERRCODE = 'P0002';
  END IF;

  SELECT step.*
  INTO v_step
  FROM public.procedure_steps step
  JOIN public.content_records step_record ON step_record.id = step.content_record_id
  WHERE step.procedure_id = v_section.procedure_id
    AND step_record.status = 'PUBLISHED'
  ORDER BY step.sequence
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Published guide steps were not found' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.user_journey_progress (
    user_id,
    journey_id,
    progress_status,
    current_journey_section_id,
    current_procedure_step_id,
    started_at,
    last_activity_at
  ) VALUES (
    v_user_id,
    p_journey_id,
    'IN_PROGRESS',
    v_section.id,
    v_step.id,
    v_now,
    v_now
  )
  ON CONFLICT (user_id, journey_id) DO NOTHING;

  UPDATE public.user_journey_progress progress
  SET current_journey_section_id = v_section.id,
      current_procedure_step_id = v_step.id,
      progress_status = CASE WHEN progress.progress_status = 'NOT_STARTED' THEN 'IN_PROGRESS' ELSE progress.progress_status END,
      started_at = COALESCE(progress.started_at, v_now),
      last_activity_at = CASE WHEN progress.last_activity_at IS NULL THEN v_now ELSE progress.last_activity_at END
  WHERE progress.user_id = v_user_id
    AND progress.journey_id = p_journey_id
    AND (
      progress.current_journey_section_id IS NULL OR
      progress.current_procedure_step_id IS NULL OR
      NOT EXISTS (
        SELECT 1
        FROM public.journey_sections valid_section
        JOIN public.procedure_steps valid_step ON valid_step.procedure_id = valid_section.procedure_id
        JOIN public.content_records valid_step_record ON valid_step_record.id = valid_step.content_record_id
        WHERE valid_section.id = progress.current_journey_section_id
          AND valid_section.journey_id = progress.journey_id
          AND valid_step.id = progress.current_procedure_step_id
          AND valid_step_record.status = 'PUBLISHED'
      )
    );

  INSERT INTO public.user_procedure_progress (
    user_id,
    procedure_id,
    progress_status,
    current_step_id,
    started_at,
    last_activity_at
  ) VALUES (
    v_user_id,
    v_section.procedure_id,
    'IN_PROGRESS',
    v_step.id,
    v_now,
    v_now
  )
  ON CONFLICT (user_id, procedure_id) DO NOTHING;

  RETURN QUERY
  SELECT progress.id,
         progress.current_journey_section_id,
         progress.current_procedure_step_id,
         progress.progress_status,
         progress.guide_mode
  FROM public.user_journey_progress progress
  WHERE progress.user_id = v_user_id
    AND progress.journey_id = p_journey_id;
END;
$$;

CREATE FUNCTION cockpitpath_private.cockpitpath_set_guide_position_impl(
  p_verified_user_id text,
  p_journey_id uuid,
  p_procedure_step_id uuid,
  p_guide_mode text DEFAULT NULL
)
RETURNS TABLE (
  current_journey_section_id uuid,
  current_procedure_step_id uuid,
  progress_status text,
  guide_mode text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = on
AS $$
DECLARE
  v_user_id text := p_verified_user_id;
  v_section public.journey_sections%ROWTYPE;
  v_step public.procedure_steps%ROWTYPE;
  v_now timestamptz := statement_timestamp();
BEGIN
  IF v_user_id IS NULL OR v_user_id = '' THEN
    RAISE EXCEPTION 'Authentication is required' USING ERRCODE = '42501';
  END IF;
  PERFORM set_config('cockpitpath.authenticated_user_id', v_user_id, true);
  IF p_guide_mode IS NOT NULL AND p_guide_mode NOT IN ('QUICK', 'LEARN') THEN
    RAISE EXCEPTION 'Invalid Guide Mode density' USING ERRCODE = '22023';
  END IF;

  SELECT section.*
  INTO v_section
  FROM public.procedure_steps step
  JOIN public.content_records step_record ON step_record.id = step.content_record_id
  JOIN public.journey_sections section ON section.procedure_id = step.procedure_id
  JOIN public.journeys journey ON journey.id = section.journey_id
  JOIN public.content_records journey_record ON journey_record.id = journey.content_record_id
  JOIN public.procedures procedure ON procedure.id = step.procedure_id
  JOIN public.content_records procedure_record ON procedure_record.id = procedure.content_record_id
  WHERE section.journey_id = p_journey_id
    AND step.id = p_procedure_step_id
    AND journey_record.status = 'PUBLISHED'
    AND procedure_record.status = 'PUBLISHED'
    AND step_record.status = 'PUBLISHED'
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Published guide position was not found' USING ERRCODE = 'P0002';
  END IF;

  SELECT step.*
  INTO STRICT v_step
  FROM public.procedure_steps step
  WHERE step.id = p_procedure_step_id;

  INSERT INTO public.user_journey_progress (
    user_id, journey_id, progress_status, current_journey_section_id,
    current_procedure_step_id, guide_mode, started_at, last_activity_at
  ) VALUES (
    v_user_id, p_journey_id, 'IN_PROGRESS', v_section.id,
    v_step.id, COALESCE(p_guide_mode, 'LEARN'), v_now, v_now
  )
  ON CONFLICT (user_id, journey_id) DO UPDATE
  SET current_journey_section_id = EXCLUDED.current_journey_section_id,
      current_procedure_step_id = EXCLUDED.current_procedure_step_id,
      guide_mode = COALESCE(p_guide_mode, user_journey_progress.guide_mode),
      progress_status = CASE
        WHEN user_journey_progress.progress_status = 'COMPLETED' THEN 'COMPLETED'
        ELSE 'IN_PROGRESS'
      END,
      started_at = COALESCE(user_journey_progress.started_at, v_now),
      last_activity_at = v_now;

  INSERT INTO public.user_procedure_progress (
    user_id, procedure_id, progress_status, current_step_id, started_at, last_activity_at
  ) VALUES (
    v_user_id, v_step.procedure_id, 'IN_PROGRESS', v_step.id, v_now, v_now
  )
  ON CONFLICT (user_id, procedure_id) DO UPDATE
  SET current_step_id = EXCLUDED.current_step_id,
      progress_status = CASE
        WHEN user_procedure_progress.progress_status = 'COMPLETED' THEN 'COMPLETED'
        ELSE 'IN_PROGRESS'
      END,
      started_at = COALESCE(user_procedure_progress.started_at, v_now),
      last_activity_at = v_now;

  RETURN QUERY
  SELECT progress.current_journey_section_id,
         progress.current_procedure_step_id,
         progress.progress_status,
         progress.guide_mode
  FROM public.user_journey_progress progress
  WHERE progress.user_id = v_user_id
    AND progress.journey_id = p_journey_id;
END;
$$;

CREATE FUNCTION cockpitpath_private.cockpitpath_record_step_progress_impl(
  p_verified_user_id text,
  p_journey_id uuid,
  p_procedure_step_id uuid,
  p_outcome text
)
RETURNS TABLE (
  current_journey_section_id uuid,
  current_procedure_step_id uuid,
  procedure_status text,
  journey_status text,
  stale_position boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
SET row_security = on
AS $$
DECLARE
  v_user_id text := p_verified_user_id;
  v_section public.journey_sections%ROWTYPE;
  v_step public.procedure_steps%ROWTYPE;
  v_next_step public.procedure_steps%ROWTYPE;
  v_next_section public.journey_sections%ROWTYPE;
  v_next_section_step public.procedure_steps%ROWTYPE;
  v_stored_step_id uuid;
  v_already_resolved boolean := false;
  v_procedure_complete boolean := false;
  v_journey_complete boolean := false;
  v_stale boolean := false;
  v_now timestamptz := statement_timestamp();
BEGIN
  IF v_user_id IS NULL OR v_user_id = '' THEN
    RAISE EXCEPTION 'Authentication is required' USING ERRCODE = '42501';
  END IF;
  PERFORM set_config('cockpitpath.authenticated_user_id', v_user_id, true);
  IF p_outcome NOT IN ('COMPLETED', 'SKIPPED') THEN
    RAISE EXCEPTION 'Invalid step progress outcome' USING ERRCODE = '22023';
  END IF;

  SELECT section.*
  INTO v_section
  FROM public.procedure_steps step
  JOIN public.content_records step_record ON step_record.id = step.content_record_id
  JOIN public.journey_sections section ON section.procedure_id = step.procedure_id
  JOIN public.journeys journey ON journey.id = section.journey_id
  JOIN public.content_records journey_record ON journey_record.id = journey.content_record_id
  JOIN public.procedures procedure ON procedure.id = step.procedure_id
  JOIN public.content_records procedure_record ON procedure_record.id = procedure.content_record_id
  WHERE section.journey_id = p_journey_id
    AND step.id = p_procedure_step_id
    AND journey_record.status = 'PUBLISHED'
    AND procedure_record.status = 'PUBLISHED'
    AND step_record.status = 'PUBLISHED'
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Published guide step was not found' USING ERRCODE = 'P0002';
  END IF;

  SELECT step.*
  INTO STRICT v_step
  FROM public.procedure_steps step
  WHERE step.id = p_procedure_step_id;
  IF p_outcome = 'SKIPPED' AND NOT v_step.is_optional THEN
    RAISE EXCEPTION 'Required steps cannot be skipped' USING ERRCODE = '22023';
  END IF;

  PERFORM cockpitpath_private.cockpitpath_start_guide_impl(v_user_id, p_journey_id, v_step.procedure_id);

  SELECT progress.current_procedure_step_id
  INTO v_stored_step_id
  FROM public.user_journey_progress progress
  WHERE progress.user_id = v_user_id AND progress.journey_id = p_journey_id
  FOR UPDATE;

  SELECT EXISTS (
    SELECT 1
    FROM public.user_step_progress progress
    WHERE progress.user_id = v_user_id
      AND progress.procedure_step_id = p_procedure_step_id
  ) INTO v_already_resolved;

  INSERT INTO public.user_step_progress (
    user_id, procedure_id, procedure_step_id, progress_status, completed_at, skipped_at
  ) VALUES (
    v_user_id,
    v_step.procedure_id,
    v_step.id,
    p_outcome,
    CASE WHEN p_outcome = 'COMPLETED' THEN v_now END,
    CASE WHEN p_outcome = 'SKIPPED' THEN v_now END
  )
  ON CONFLICT (user_id, procedure_step_id) DO UPDATE
  SET progress_status = CASE
        WHEN user_step_progress.progress_status = 'COMPLETED' THEN 'COMPLETED'
        ELSE EXCLUDED.progress_status
      END,
      completed_at = CASE
        WHEN user_step_progress.progress_status = 'COMPLETED' THEN user_step_progress.completed_at
        WHEN EXCLUDED.progress_status = 'COMPLETED' THEN EXCLUDED.completed_at
      END,
      skipped_at = CASE
        WHEN user_step_progress.progress_status = 'COMPLETED' OR EXCLUDED.progress_status = 'COMPLETED' THEN NULL
        ELSE COALESCE(user_step_progress.skipped_at, EXCLUDED.skipped_at)
      END;

  v_stale := v_stored_step_id IS NOT NULL AND v_stored_step_id <> p_procedure_step_id;

  SELECT step.*
  INTO v_next_step
  FROM public.procedure_steps step
  JOIN public.content_records record ON record.id = step.content_record_id
  WHERE step.procedure_id = v_step.procedure_id
    AND step.sequence > v_step.sequence
    AND record.status = 'PUBLISHED'
  ORDER BY step.sequence
  LIMIT 1;

  SELECT NOT EXISTS (
    SELECT 1
    FROM public.procedure_steps required_step
    JOIN public.content_records required_record ON required_record.id = required_step.content_record_id
    LEFT JOIN public.user_step_progress completed
      ON completed.user_id = v_user_id
     AND completed.procedure_step_id = required_step.id
     AND completed.progress_status = 'COMPLETED'
    WHERE required_step.procedure_id = v_step.procedure_id
      AND required_record.status = 'PUBLISHED'
      AND NOT required_step.is_optional
      AND completed.id IS NULL
  ) INTO v_procedure_complete;

  UPDATE public.user_procedure_progress progress
  SET progress_status = CASE WHEN v_procedure_complete THEN 'COMPLETED' ELSE 'IN_PROGRESS' END,
      current_step_id = CASE
        WHEN v_stale THEN progress.current_step_id
        WHEN v_next_step.id IS NOT NULL THEN v_next_step.id
        ELSE v_step.id
      END,
      started_at = COALESCE(progress.started_at, v_now),
      completed_at = CASE
        WHEN v_procedure_complete THEN COALESCE(progress.completed_at, v_now)
        ELSE NULL
      END,
      last_activity_at = v_now
  WHERE progress.user_id = v_user_id
    AND progress.procedure_id = v_step.procedure_id;

  IF NOT v_stale AND v_next_step.id IS NULL THEN
    SELECT section.*
    INTO v_next_section
    FROM public.journey_sections section
    JOIN public.procedures procedure ON procedure.id = section.procedure_id
    JOIN public.content_records record ON record.id = procedure.content_record_id
    WHERE section.journey_id = p_journey_id
      AND section.sequence > v_section.sequence
      AND record.status = 'PUBLISHED'
    ORDER BY section.sequence
    LIMIT 1;

    IF v_next_section.id IS NOT NULL THEN
      SELECT step.*
      INTO v_next_section_step
      FROM public.procedure_steps step
      JOIN public.content_records record ON record.id = step.content_record_id
      WHERE step.procedure_id = v_next_section.procedure_id
        AND record.status = 'PUBLISHED'
      ORDER BY step.sequence
      LIMIT 1;
    END IF;
  END IF;

  SELECT NOT EXISTS (
    SELECT 1
    FROM public.journey_sections required_section
    LEFT JOIN public.user_procedure_progress completed
      ON completed.user_id = v_user_id
     AND completed.procedure_id = required_section.procedure_id
     AND completed.progress_status = 'COMPLETED'
    WHERE required_section.journey_id = p_journey_id
      AND required_section.is_required
      AND completed.id IS NULL
  ) INTO v_journey_complete;

  UPDATE public.user_journey_progress progress
  SET progress_status = CASE WHEN v_journey_complete THEN 'COMPLETED' ELSE 'IN_PROGRESS' END,
      current_journey_section_id = CASE
        WHEN v_stale THEN progress.current_journey_section_id
        WHEN v_next_step.id IS NOT NULL THEN v_section.id
        WHEN v_next_section.id IS NOT NULL THEN v_next_section.id
        ELSE v_section.id
      END,
      current_procedure_step_id = CASE
        WHEN v_stale THEN progress.current_procedure_step_id
        WHEN v_next_step.id IS NOT NULL THEN v_next_step.id
        WHEN v_next_section_step.id IS NOT NULL THEN v_next_section_step.id
        ELSE v_step.id
      END,
      started_at = COALESCE(progress.started_at, v_now),
      completed_at = CASE
        WHEN v_journey_complete THEN COALESCE(progress.completed_at, v_now)
        ELSE NULL
      END,
      last_activity_at = v_now
  WHERE progress.user_id = v_user_id
    AND progress.journey_id = p_journey_id;

  RETURN QUERY
  SELECT journey_progress.current_journey_section_id,
         journey_progress.current_procedure_step_id,
         procedure_progress.progress_status,
         journey_progress.progress_status,
         v_stale AND NOT v_already_resolved
  FROM public.user_journey_progress journey_progress
  JOIN public.user_procedure_progress procedure_progress
    ON procedure_progress.user_id = journey_progress.user_id
   AND procedure_progress.procedure_id = v_step.procedure_id
  WHERE journey_progress.user_id = v_user_id
    AND journey_progress.journey_id = p_journey_id;
END;
$$;

GRANT USAGE, CREATE ON SCHEMA cockpitpath_private TO cockpitpath_progress_writer;
ALTER FUNCTION cockpitpath_private.cockpitpath_start_guide_impl(text, uuid, uuid)
  OWNER TO cockpitpath_progress_writer;
ALTER FUNCTION cockpitpath_private.cockpitpath_set_guide_position_impl(text, uuid, uuid, text)
  OWNER TO cockpitpath_progress_writer;
ALTER FUNCTION cockpitpath_private.cockpitpath_record_step_progress_impl(text, uuid, uuid, text)
  OWNER TO cockpitpath_progress_writer;
REVOKE CREATE ON SCHEMA cockpitpath_private FROM cockpitpath_progress_writer;

CREATE FUNCTION public.cockpitpath_start_guide(
  p_journey_id uuid,
  p_procedure_id uuid DEFAULT NULL
)
RETURNS TABLE (
  journey_progress_id uuid,
  current_journey_section_id uuid,
  current_procedure_step_id uuid,
  progress_status text,
  guide_mode text
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = pg_catalog, public
BEGIN ATOMIC
  SELECT *
  FROM cockpitpath_private.cockpitpath_start_guide_impl(
    public.cockpitpath_auth_user_id(), p_journey_id, p_procedure_id
  );
END;

CREATE FUNCTION public.cockpitpath_set_guide_position(
  p_journey_id uuid,
  p_procedure_step_id uuid,
  p_guide_mode text DEFAULT NULL
)
RETURNS TABLE (
  current_journey_section_id uuid,
  current_procedure_step_id uuid,
  progress_status text,
  guide_mode text
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = pg_catalog, public
BEGIN ATOMIC
  SELECT *
  FROM cockpitpath_private.cockpitpath_set_guide_position_impl(
    public.cockpitpath_auth_user_id(), p_journey_id, p_procedure_step_id, p_guide_mode
  );
END;

CREATE FUNCTION public.cockpitpath_record_step_progress(
  p_journey_id uuid,
  p_procedure_step_id uuid,
  p_outcome text
)
RETURNS TABLE (
  current_journey_section_id uuid,
  current_procedure_step_id uuid,
  procedure_status text,
  journey_status text,
  stale_position boolean
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = pg_catalog, public
BEGIN ATOMIC
  SELECT *
  FROM cockpitpath_private.cockpitpath_record_step_progress_impl(
    public.cockpitpath_auth_user_id(), p_journey_id, p_procedure_step_id, p_outcome
  );
END;

REVOKE ALL ON FUNCTION public.cockpitpath_start_guide(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cockpitpath_set_guide_position(uuid, uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cockpitpath_record_step_progress(uuid, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cockpitpath_start_guide(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cockpitpath_set_guide_position(uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cockpitpath_record_step_progress(uuid, uuid, text) TO authenticated;
REVOKE ALL ON FUNCTION cockpitpath_private.cockpitpath_start_guide_impl(text, uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION cockpitpath_private.cockpitpath_set_guide_position_impl(text, uuid, uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION cockpitpath_private.cockpitpath_record_step_progress_impl(text, uuid, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION cockpitpath_private.cockpitpath_start_guide_impl(text, uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION cockpitpath_private.cockpitpath_set_guide_position_impl(text, uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION cockpitpath_private.cockpitpath_record_step_progress_impl(text, uuid, uuid, text) TO authenticated;

-- Journey sections are stable relationship identities once progress references them.
GRANT UPDATE ON public.journey_sections TO cockpitpath_publisher;

-- Down Migration

REVOKE UPDATE ON public.journey_sections FROM cockpitpath_publisher;

REVOKE EXECUTE ON FUNCTION public.cockpitpath_record_step_progress(uuid, uuid, text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.cockpitpath_set_guide_position(uuid, uuid, text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.cockpitpath_start_guide(uuid, uuid) FROM authenticated;
DROP FUNCTION public.cockpitpath_record_step_progress(uuid, uuid, text);
DROP FUNCTION public.cockpitpath_set_guide_position(uuid, uuid, text);
DROP FUNCTION public.cockpitpath_start_guide(uuid, uuid);

REVOKE EXECUTE ON FUNCTION cockpitpath_private.cockpitpath_record_step_progress_impl(text, uuid, uuid, text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION cockpitpath_private.cockpitpath_set_guide_position_impl(text, uuid, uuid, text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION cockpitpath_private.cockpitpath_start_guide_impl(text, uuid, uuid) FROM authenticated;
DROP FUNCTION cockpitpath_private.cockpitpath_record_step_progress_impl(text, uuid, uuid, text);
DROP FUNCTION cockpitpath_private.cockpitpath_set_guide_position_impl(text, uuid, uuid, text);
DROP FUNCTION cockpitpath_private.cockpitpath_start_guide_impl(text, uuid, uuid);

DROP TABLE public.user_step_progress;
DROP TABLE public.user_procedure_progress;
DROP TABLE public.user_journey_progress;

DROP FUNCTION IF EXISTS public.cockpitpath_auth_user_id();

ALTER TABLE public.procedure_steps
  DROP CONSTRAINT procedure_steps_id_procedure_unique;
ALTER TABLE public.journey_sections
  DROP CONSTRAINT journey_sections_id_journey_unique;

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM cockpitpath_progress_writer;
REVOKE EXECUTE ON FUNCTION auth.user_id() FROM cockpitpath_progress_writer;
REVOKE ALL PRIVILEGES ON SCHEMA public FROM cockpitpath_progress_writer;
REVOKE ALL PRIVILEGES ON SCHEMA cockpitpath_private FROM cockpitpath_progress_writer;
DROP SCHEMA cockpitpath_private;
REVOKE cockpitpath_progress_writer FROM neondb_owner;
DROP ROLE cockpitpath_progress_writer;
