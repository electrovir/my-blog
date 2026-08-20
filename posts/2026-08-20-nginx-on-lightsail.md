---
title: Setting up Node.js server with Nginx on Lightsail
tags: [dev, web, aws, guide, node-js]
---

How to setup a bare bones Nginx server with HTTPS and reverse proxy on Lightsail.

<!-- truncate -->
<!-- cspell:words secp ecdh nosniff letsencrypt fullchain privkey certonly llmnr -->

## Create Lightsail Instance

1. Navigate to AWS Lightsail and create a new instance
2. Select "Linux apps" > "Nginx".
    1. I recommend selecting the "Dual-stack" network type.
3. Create the instance, then download the SSH key, then SSH into the instance.

## Cleanup the Lightsail Instance

1. remove MariaDB and php:
    ```
    sudo apt purge 'mariadb-*' 'php*'
    sudo apt autoremove --purge
    sudo rm -rf /run/php
    ```
2. Disable LLMNR:
    ```sh
    sudo mkdir -p /etc/systemd/resolved.conf.d && echo -e '[Resolve]\nLLMNR=no' | sudo tee /etc/systemd/resolved.conf.d/disable-llmnr.conf
    sudo systemctl restart systemd-resolved
    ```

## Fix Terminal Up Arrow

https://electrovir.com/post/2025-08-16-terminal-search

1. Create / open a input rc file:
    ```sh
    nano ~/.inputrc
    ```
2. Paste in the following:
    ```
    "\e[A": history-search-backward
    "\e[B": history-search-forward
    ```
3. enable it:

    ```sh
    bind -f ~/.inputrc
    ```

## Optional: Install Starship

For better shell prompts.

1. Follow the Starship install step for Linux here: https://starship.rs/guide/
    ```sh
    curl -sS https://starship.rs/install.sh | sudo sh
    ```
2. Add starship to your `~/.bashrc`:
    ```sh
    echo 'eval "$(starship init bash)"' >> ~/.bashrc
    ```
3. Create a config:
    ```sh
    mkdir -p ~/.config
    nano ~/.config/starship.toml
    ```
4. Create your config (see https://electrovir.com/post/2024-08-29-awesome-terminal for more details)
5. Reload your bashrc:

    ```sh
    source ~/.bashrc
    ```

## Setup firewall

1. Install ufw:
    ```sh
    sudo apt install ufw
    ```
2. Configure ufw:
    ```sh
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    ```
3. Verify rules:
    ```sh
    sudo ufw show added
    ```
4. Enable ufw:

    ```sh
    sudo ufw enable
    ```

## Setup Let's Encrypt

1. Install certbot:
    ```sh
    sudo apt update
    sudo apt install -y certbot
    ```
2. Stop nginx so certbot can use port 80:
    ```sh
    sudo systemctl stop nginx
    ```
3. Get your certificate (make sure to replace the <paste-here> parts):
    ```
    sudo certbot certonly --standalone \
        -d <paste-your-domain-here> \
        -m <paste-your-email-here> --agree-tos --no-eff-email
    ```

## Setup Node.js

1. Install nvm (https://github.com/nvm-sh/nvm#installing-and-updating):

    ```sh
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash
    source ~/.bashrc
    ```

2. Install the Node.js version you want (this command uses version 24):
    ```sh
    nvm install 24
    ```
3. Secure your npm install with a config.
    1. Create and open the config:
        ```sh
        nano ~/.npmrc
        ```
    2. Paste in the following:
        ```properties
        ignore-scripts=true
        min-release-age=5 # days
        ```

## Setup Nginx

1. Delete the default config:
    ```sh
    sudo rm /etc/nginx/conf.d/default.conf
    ```
2. Create a new config (make sure to replace the <paste-here> part):
    ```sh
    sudo nano /etc/nginx/conf.d//<paste-your-domain-here>.conf
    ```
3. Create the server config in that file. Here's an example one with HTTPS and reverse proxying. Use at your own risk!

    ```properties
    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        listen 443 ssl default_server;
        listen [::]:443 ssl default_server;
        server_name _;

        # refuse the TLS handshake instead of presenting a cert whose name cannot match
        ssl_reject_handshake on;

        # nginx-specific: close the connection with no response at all
        return 444;
    }

    server {
        listen 80;
        listen [::]:80;
        server_name <paste-your-domain-here>;

        location / {
            # redirect HTTP to HTTPS
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        http2 on;
        server_name <paste-your-domain-here>;

        # stricter than most sites: TLS 1.2 clients are refused outright.
        # This will break old browsers (>=6 years old).
        ssl_protocols TLSv1.3;
        ssl_ecdh_curve X25519:prime256v1:secp384r1;
        ssl_session_timeout 10m;
        ssl_session_cache shared:SSL:10m;
        ssl_session_tickets off;

        # nginx does not merge add_header across levels: one add_header inside a location block discards
        # every add_header set here. Repeat all of them in any location that adds one of its own.
        add_header Strict-Transport-Security "max-age=63072000" always;
        add_header X-Content-Type-Options nosniff;
        add_header Referrer-Policy strict-origin-when-cross-origin always;
        # frame-ancestors is the modern replacement for X-Frame-Options; both are sent because some
        # scanners and older clients still only read the latter
        add_header Content-Security-Policy "frame-ancestors 'none'" always;
        add_header X-Frame-Options DENY always;

        server_tokens off;

        ssl_certificate /etc/letsencrypt/live/<paste-your-domain-here>/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/<paste-your-domain-here>/privkey.pem;

        location / {
            proxy_pass http://127.0.0.1:<paste-in-your-internal-port-number-here>;

            # required for websockets; nginx proxies with HTTP/1.0 by default, which cannot carry an upgrade
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # keep idle websockets alive
            proxy_read_timeout 3600s;
            proxy_send_timeout 3600s;
        }
    }
    ```

4. Verify your config:
    ```sh
    sudo nginx -t
    ```
5. Start and enable Nginx again:
    ```sh
    sudo systemctl start nginx
    sudo systemctl enable nginx
    ```
6. Setup Nginx to turn off then back on during certificate renewal:

    ```sh
    sudo mkdir -p /etc/letsencrypt/renewal-hooks/pre /etc/letsencrypt/renewal-hooks/post
    printf '#!/bin/sh\nsystemctl stop nginx\n' | sudo tee /etc/letsencrypt/renewal-hooks/pre/stop-nginx.sh
    printf '#!/bin/sh\nsystemctl start nginx\n' | sudo tee /etc/letsencrypt/renewal-hooks/post/start-nginx.sh
    sudo chmod +x /etc/letsencrypt/renewal-hooks/pre/stop-nginx.sh /etc/letsencrypt/renewal-hooks/post/start-nginx.sh
    ```

## Start your server

Clone your repo, or copy your server script, or whatever, then start it and make sure it listens to host 127.0.0.1 with port `<paste-in-your-internal-port-number-here>` from your Nginx config above.

You should be able to connect to your server now!

## Setup ensure-service

1. Install crontab:
    ```sh
    sudo apt install cron
    sudo systemctl enable --now cron
    ```
2. Setup [`ensure-service`](https://www.npmjs.com/package/ensure-service):
    ```sh
    npm init ensure-service
    ```
3. Configure `~/.config/ensure-service/config.json` for your server
