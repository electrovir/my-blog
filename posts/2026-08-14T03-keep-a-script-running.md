---
title: Keep a Server Script Running with Cron
tags: [cli, cron, dev, nginx, process-management, raspberry-pi]
---

<!-- cspell:words lsof nohup logfile -->

I tried using PM2 and `systemd` to keep a Raspberry Pi server running. Neither worked consistently. Instead, I setup a much simpler cron task.

<!-- truncate -->

## Cron setup

Add the following to the top of `crontab -e`:

```sh
SHELL=/bin/bash
HOME=/home/<username>
BASH_ENV=$HOME/.bashrc
```

This fills up the environment for your cron tasks so that they can actually run stuff, like npm scripts.

```sh
* * * * * bash check-server.sh
```

`check-server.sh` is a simple script:

```sh
#!/bin/bash

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOGFILE="/tmp/server.log"
# Whatever port your server runs on
PORT=3001

if ! lsof -i:"$PORT" >/dev/null 2>&1; then
  echo "$(date): Starting server..." > "$LOGFILE"
  nohup npm start >> "$LOGFILE" 2>&1 &
fi
```

Bonus: for external access, set up nginx as a reverse proxy:

```nginx
location / {
    proxy_pass http://127.0.0.1:3001;
}
```
