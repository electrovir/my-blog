---
title: Run a process that continues after exiting an SSH connection
tags: [dev, process-management, ssh, tip, tmux]
---

1. ssh into the machine.
2. Install `tmux` if the machine doesn't already have it: `sudo apt install tmux`.
3. Run `tmux`.
4. Run the command you want to continue.
5. Hit `ctrl+b` and then `d`. You should see a `detached` note after doing so.

All done!
