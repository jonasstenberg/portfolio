# Infra

Tested and deployed on Debian using [nginx](https://www.nginx.com/) as a web server.

### Prerequisites

Install:

1. nginx
2. [acme.sh](https://github.com/acmesh-official/acme.sh) (certificates live under
   `/home/jonas/.acme.sh/<domain>_ecc/`)

### Nginx config

Copy the configurations within the nginx directory to `/etc/nginx/`. The site file is
`sites-available/portfolio` and serves stenberg.io, jonasstenberg.se and jonasstenberg.com
from `/usr/local/bin/portfolio`.

### CV GraphQL API

The `apps/api/` directory holds a small Bun + GraphQL Yoga service that serves the CV at
`stenberg.io/graphql` (JSON only). Nginx proxies `/graphql` to it on `127.0.0.1:4000`. The
GraphiQL playground at `/graphiql/` is part of the static Vite build and deploys with the
site itself.

Both the static site and the API deploy automatically from the GitHub workflow on push to
`main` (Bun is not needed on the server — CI cross-compiles a standalone Linux binary).

One-time server provisioning:

```
ssh <server> 'sudo mkdir -p /usr/local/bin/cv-api && sudo chown jonas:jonas /usr/local/bin/cv-api'
cd apps/api && bun install && bun run build
scp dist/cv-api <server>:/usr/local/bin/cv-api/cv-api
scp ../infra/systemd/cv-api.service <server>:/tmp/cv-api.service
ssh <server> 'sudo mv /tmp/cv-api.service /etc/systemd/system/ && sudo systemctl daemon-reload && sudo systemctl enable --now cv-api'
```
