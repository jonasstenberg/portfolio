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
}
