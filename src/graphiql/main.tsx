import { explorerPlugin } from '@graphiql/plugin-explorer';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL, HISTORY_PLUGIN } from 'graphiql';
import { createRoot } from 'react-dom/client';

import type { Environment } from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JSONWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import GraphQLWorker from 'monaco-graphql/esm/graphql.worker?worker';

import 'graphiql/style.css';
import '@graphiql/plugin-explorer/style.css';

(globalThis as { MonacoEnvironment?: Environment }).MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    switch (label) {
      case 'json':
        return new JSONWorker();
      case 'graphql':
        return new GraphQLWorker();
      default:
        return new EditorWorker();
    }
  },
};

const fetcher = createGraphiQLFetcher({ url: '/graphql' });

const defaultQuery = `# Hi! This CV is a real GraphQL API.
# The Explorer on the left shows every queryable field —
# tick boxes to build a query, then press ▶ to run it.
# Autocomplete (Ctrl-Space) and the Docs panel work too.
#
# Also try: education, links, me { about helloWorld },
# skills(category: HARD) { name keywords }

{
  me {
    name
    headline
    location
  }
  experience {
    company
    role
    highlights
  }
}
`;

createRoot(document.getElementById('root')!).render(
  <GraphiQL
    fetcher={fetcher}
    defaultQuery={defaultQuery}
    plugins={[HISTORY_PLUGIN, explorerPlugin()]}
    visiblePlugin='Explorer'
  />,
);
