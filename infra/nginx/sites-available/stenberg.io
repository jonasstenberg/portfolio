server {
  listen 80;
  listen [::]:80;

  server_name jonasstenberg.se *.jonasstenberg.se;

  include includes/headers;

  return 301 https://stenberg.io$request_uri;
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;

  server_name jonasstenberg.se *.jonasstenberg.se;

  ssl_certificate /etc/letsencrypt/live/jonasstenberg.se/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/jonasstenberg.se/privkey.pem;

  include includes/ssl;
  include includes/headers;

  return 301 https://stenberg.io$request_uri;
}

server {
  listen 80;
  listen [::]:80;

  server_name stenberg.io *.stenberg.io;

  include includes/headers;

  if ($host = stenberg.io) {
    return 301 https://$host$request_uri;
  }
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;

  server_name stenberg.io www.stenberg.io;

  ssl_certificate /etc/letsencrypt/live/stenberg.io/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/stenberg.io/privkey.pem;

  include includes/ssl;
  include includes/headers;

  gzip on;
  gzip_types text/plain application/javascript application/x-javascript text/javascript text/xml text/css;

  keepalive_timeout   70;

  root /usr/local/bin/stenberg.io;
  index index.html;

  location / {
    try_files $uri $uri/ =404;
  }

  # CV GraphQL API (see api/ in the repo). JSON only — the GraphiQL playground
  # is a page of the Vite app, served statically at /graphiql/.
  # add_header directives here replace the inherited ones from includes/headers,
  # so the relevant ones are restated with an API-appropriate CSP.
  location = /graphql {
    proxy_pass http://127.0.0.1:4000/graphql;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;

    add_header Strict-Transport-Security "max-age=15768000; preload" always;
    add_header X-Content-Type-Options nosniff;
    add_header Content-Security-Policy "default-src 'none'; frame-ancestors 'none';";
    add_header 'Referrer-Policy' 'strict-origin';
  }
}
