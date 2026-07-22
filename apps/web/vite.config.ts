import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      proxy: {
        '/graphql': 'http://localhost:4000',
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
          graphiql: fileURLToPath(new URL('./graphiql/index.html', import.meta.url)),
          health: fileURLToPath(new URL('./health/index.html', import.meta.url)),
        },
      },
    },
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          exportType: 'named',
          ref: true,
          svgo: false,
          titleProp: true,
        },
        include: '**/*.svg',
      }),
    ],
  };
});
