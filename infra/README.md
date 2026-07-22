# Infra

Tested and deployed on Debian using [nginx](https://www.nginx.com/) as a web server.

### Prerequisites

Install:

1. nginx
2. certbot

### Generate certificates

```
certbot --nginx -d stenberg.io -d www.stenberg.io
certbot --nginx -d jonasstenberg.se -d www.jonasstenberg.se
```

### Nginx config

Copy the configurations within the nginx directory to `/etc/nginx/`

### CV GraphQL API

The `api/` directory holds a small Bun + GraphQL Yoga service that serves the CV at
`stenberg.io/graphql` (JSON only). Nginx proxies `/graphql` to it on `127.0.0.1:4000`. The
GraphiQL playground at `/graphiql/` is part of the static Vite build and deploys with the
site itself.

Deploy (Bun is not needed on the server — the build produces a standalone Linux binary):

```
cd api
bun install
bun run build
scp dist/cv-api <server>:/usr/local/bin/cv-api
scp ../infra/systemd/cv-api.service <server>:/etc/systemd/system/cv-api.service
ssh <server> 'systemctl daemon-reload && systemctl enable --now cv-api && nginx -t && systemctl reload nginx'
```
