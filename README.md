# CockpitPath

CockpitPath is a connected aircraft-learning platform for flight simulation users. It combines visual procedures, cockpit exploration, aircraft-system learning, and persistent progress in a simulator-companion web experience.

## Status

**Product foundation complete. Phase 1A application scaffold active.**

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
