# CockpitPath

CockpitPath is a connected aircraft-learning platform for flight simulation users. It combines visual procedures, cockpit exploration, aircraft-system learning, and persistent progress in a simulator-companion web experience.

## Status

**Learning Progress and Guide Mode are complete. Staging deployment and real-device validation are the current checkpoint.**

## Initial supported target

- Boeing 737 MAX 8
- iFly
- Microsoft Flight Simulator 2024

## Core learning areas

- Guide Mode
- Aircraft Page
- Cockpit Explorer
- Aircraft Systems

## Architecture baseline

- Next.js and React
- Plain JavaScript
- Neon Postgres, Neon Auth, and PostgreSQL RLS
- Cloudflare R2 for learning media
- Railway deployment

## Documentation

Start with the [documentation index](docs/README.md).

All repository documentation, code-related artifacts, schemas, and project files are written in English.

## Local development

CockpitPath uses npm and a Node.js version compatible with the `engines` field in
`package.json`.

Copy `.env.example` to `.env.local`, then provide the development Neon Auth
configuration named in that file. Keep `.env.local` private and untracked.

```bash
npm install
npm run dev
```

The local application is available at `http://localhost:3000` by default.

Use `npm test`, `npm run lint`, and `npm run build` to run the current quality
checks.

Database migrations and integration tests use the unpooled connection configured
in `.env.local`. Both commands are intended for the linked Neon development branch;
the database guard also recognizes the dedicated staging branch while continuing
to reject production and unknown branches.

```bash
npm run db:migrate
npm run db:test
```

Guide Mode reads published content through a restricted development runtime role.
Provision its ignored `CONTENT_DATABASE_URL` once per development branch, then use
the Guide integration command for the synthetic Auth/Data API/RLS acceptance path.

```bash
npm run db:provision:content-reader
npm run guide:test:integration
```

Repository-authored YAML content is validated before publication. Publication
commands are guarded to the linked development/test environment; the dry run is
the normal review entry point.

```bash
npm run content:validate
npm run content:publish:dry-run
npm run content:publish
npm run content:test:integration
```

See the [content authoring guide](docs/content/authoring-guide.md) and
[publishing workflow](docs/content/publishing-workflow.md) for the full policy.

Staging deploys the same application to Railway against the isolated Neon
`staging` branch. The initial staging schema is applied and verified through a
trusted operator boundary before deployment; the Railway web runtime never
receives the database-owner credential. Railway checks `/api/health` before
activating a deployment. See the
[deployment architecture](docs/architecture/deployment.md#staging-on-railway)
for the required variable names and verification workflow.
