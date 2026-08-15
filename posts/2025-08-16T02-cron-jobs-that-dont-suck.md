---
title: Cron jobs that don't suck
tags: [cli, cron, dev, shell]
---

To run cron jobs with your user env so that it's actually possible for them to run anything, add this to the top of your cron file (edit with `crontab -e`):

```
SHELL=/bin/bash
HOME=/home/<username>
BASH_ENV=$HOME/.bashrc
```

Then look at your `~/.bashrc` file and make sure to remove any code (usually at the top) that exits early if found in a non-interactive shell.
