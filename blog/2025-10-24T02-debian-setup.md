---
title: Debian Server from Scratch
tags: [dev]
---

A quick guide on setting up a minimal but secure HTTPS web server on a Debian (12) Linux server.

<!-- truncate -->

## Initial setup

Setup SSH, auth, and firewall.

1. Login as root to your host machine.
2. [Setup an SSH key.](./2025-10-24-ssh-key)
3. Create a non-root user: `adduser <username>` and fill in the details
4. Allow your new user to use `sudo`: `usermod -aG sudo <username>`
5. Add your ssh key to the new user's authorized keys file: `/home/<username>/.ssh/authorized_keys` (you will need to make the folder first with `mkdir /home/<username>/.ssh`).
6. Make sure your new user owns it: `chown -R <username>:<username> /home/<username>/.ssh`
7. Setup a firewall
    1. `apt update`
    2. `apt install ufw`
    3. `ufw allow OpenSSH`
    4. `ufw enable`
    5. `ufw status`
8. Add the following to `/etc/ssh/sshd_config` (if it's not already there) to disable root password login (use SSH keys to login):
    ```
    PermitRootLogin prohibit-password
    PasswordAuthentication no
    ```
9. Logout and use your non-root user for everything else (`<username>`).

## Nginx

1. `sudo apt update`
2. `sudo apt install nginx`
3. `sudo ufw allow 'Nginx HTTP'`
4. `sudo ufw allow 'Nginx HTTPS'`
5. Create a server block

    1. `sudo nano /etc/nginx/sites-available/<site-name>`
    2. Paste in the following (make sure to replace `<domain>` with your actual domain):

        ```nginx
        server {
            listen 80;
            listen [::]:80;

            server_name <domain>;

            location / {
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_pass http://localhost:3000;
            }
        }
        ```

6. Enable the server block: `sudo ln -s /etc/nginx/sites-available/<site-name> /etc/nginx/sites-enabled/<site-name>`
7. Disable the default server block: `sudo rm /etc/nginx/sites-enabled/default`
8. Verify that your config is valid: `sudo nginx -t`

## Setup Certbot (Let's Encrypt)

1. `sudo apt install certbot python3-certbot-nginx`
2. `sudo certbot --nginx -d <domain>`
3. Test auto renewal with: `sudo certbot renew --dry-run`

## Install Node.js

1. Install nvm: https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script
    - As of writing this, the command is: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash`
2. If you don't want to restart your shell, source you bashrc: `source ~/.bashrc`
3. Install Node.js: `nvm install --lts`
4. Install a specific npm version: `npm i -g npm@<version>`

## Test the server

1. `npm i -g @electrovir/basic-server`
2. `basic-server 3000`
