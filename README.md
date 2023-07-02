# Portfolio: Jonas Stenberg

### What is this?

This is a simple portfolio website for Jonas Stenberg

### Structure

```bash
.
├── apps
│   ├── client                 # React + Vite
└── packages
    ├── eslint-config-custom   # Shared eslint config
    └── tsconfig               # Shared tsconfig for Node and React
```

### Prerequisites

Before you begin, make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/) v18 LTS
- [pnpm](https://pnpm.io/) v8

### Getting Started

1. Install prerequisites.

2. Install dependencies. Run:

   ```sh
   pnpm install
   ```

3. Start local development servers for server and client:

   ```sh
   pnpm dev
   ```

#### Root level commands

| Command          | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `pnpm dev`       | Start local development servers for server and client |
| `pnpm lint`      | Lint the project                                      |
| `pnpm test`      | Run tests for the project                             |
| `pnpm typecheck` | Typecheck the project                                 |
| `pnpm format`    | Format the project with prettier                      |
| `pnpm clean`     | Clean temporary files (e.g node_modules and dist)     |
