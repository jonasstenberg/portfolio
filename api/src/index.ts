import { createYoga } from 'graphql-yoga';

import { schema } from './schema';

// JSON only — the GraphiQL playground is a page of the Vite app, served at /graphiql/.
const yoga = createYoga({
  schema,
  landingPage: false,
  graphqlEndpoint: '/graphql',
  graphiql: false,
});

const server = Bun.serve({
  hostname: Bun.env.HOST ?? '127.0.0.1',
  port: Number(Bun.env.PORT ?? 4000),
  fetch: yoga.fetch,
});

console.info(`CV API running on http://${server.hostname}:${server.port}${yoga.graphqlEndpoint}`);
