-- Up Migration

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public
  FROM PUBLIC, anonymous, authenticated, authenticator;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public
  FROM PUBLIC, anonymous, authenticated, authenticator;
REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public
  FROM PUBLIC, anonymous, authenticated, authenticator;

ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner IN SCHEMA public
  REVOKE ALL PRIVILEGES ON TABLES FROM PUBLIC, anonymous, authenticated, authenticator;
ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner IN SCHEMA public
  REVOKE ALL PRIVILEGES ON SEQUENCES FROM PUBLIC, anonymous, authenticated, authenticator;
ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner
  REVOKE ALL PRIVILEGES ON FUNCTIONS FROM PUBLIC, anonymous, authenticated, authenticator;

-- CockpitPath's current schema contains product-owned editorial content only.
-- Dedicated NOLOGIN runtime roles and their narrowly scoped grants are created
-- with the Phase 2 published-content surface, when those grants can be meaningful.
-- Persistent user-owned tables and their auth.user_id()-based RLS policies begin
-- with the Phase 3 progress schema; Phase 1B.2 already proved that mechanism.

-- Down Migration

-- PostgreSQL's default function privilege grants EXECUTE to PUBLIC. Restore only
-- that built-in default; no Data API role or table privilege is granted here.
ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner
  GRANT EXECUTE ON FUNCTIONS TO PUBLIC;
