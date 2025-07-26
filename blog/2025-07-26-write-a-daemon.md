---
title: Write a Daemon
tags: [dev]
---

It's super easy to write your own daemon, so here's how.

<!-- truncate -->

## The Daemon File

Choose a name for your app / service. This example will use `my-app`.

Create a new file (with `sudo`) at: `/etc/systemd/system/<app-name>.service`, like `/etc/systemd/system/my-app.service`

There are plenty of options for the file, but here's an example one that requires the network and users to be up after a reboot, and then starts a python script. To actually use this script, make sure to replace `<username>` with the actual username you want to use and replace any paths as necessary.

```ini
[Unit]
Description=My App
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/<username>/my-script.py
Restart=always
User=<username>
WorkingDirectory=/home/<username>

[Install]
WantedBy=multi-user.target
```

## Install the Daemon

Load the new service:

```sh
sudo systemctl daemon-reload
```

Enable the service:

```sh
sudo systemctl enable my-app
```

Start the service for the first time, if you don't want to reboot right now:

```sh
sudo systemctl start my-app
```
