# Portfolio: Jonas Stenberg

### What is this?

This is a simple portfolio website for Jonas Stenberg, laid out as a pnpm workspace:

- `apps/web` — the site itself (Vite + React), including the GraphiQL playground page
- `apps/api` — the CV GraphQL API (Bun + GraphQL Yoga, outside the pnpm workspace)
- `apps/qa` — Playwright/Lighthouse checks that run against the live site

### GraphQL CV

The CV is also a real GraphQL API, served from `api/` (Bun + GraphQL Yoga) at
[stenberg.io/graphql](https://stenberg.io/graphql), with a GraphiQL playground at
[stenberg.io/graphiql/](https://stenberg.io/graphiql/) built as a second page of the Vite app:

```graphql
{
  experience {
    company
    role
    highlights
  }
}
```

Run it locally with `cd apps/api && bun install && bun run dev` alongside `pnpm dev` — the
Vite dev server proxies `/graphql` to the API and serves the playground at
[localhost:5173/graphiql/](http://localhost:5173/graphiql/).
