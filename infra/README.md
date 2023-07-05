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
