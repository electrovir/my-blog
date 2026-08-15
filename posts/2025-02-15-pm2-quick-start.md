---
title: pm2 Quick Start
tags: [dev, nodejs, pm2, process-management]
---

I couldn't find a single consolidated place that explains how to setup pm2 from scratch (assuming you've already installed Node.js), and their own "quick start" didn't help. I was finally able to piece together how to get it working.

<!-- truncate -->

1. Install pm2: `npm i -g pm2`
2. Configure pm2 to restart processes on reboot: `pm2 startup`
3. If that command prints a command to run, run it.
4. `cd` to wherever your script is.
5. Run the script with pm2: `pm2 start <command> -- <args>`
    - `pm2 start npm -- start`
    - `pm2 start node -- index.js`
    - `pm2 start npx -- tsx index.ts`
6. Verify that it is running with `pm2 list`
7. Run `pm2 save`

Now if you reboot your system, pm2 should automatically start itself and the script you ran!
