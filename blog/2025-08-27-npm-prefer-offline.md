---
title: Don't use --prefer-offline
tags: [dev, Node.js]
---

If you set `--prefer-offline` to `true` in npm, naively thinking (like I did) that this will speed up your npm installs, you will be disappointed (like I was). Annoyingly, this setting causes npm to _also_ cache which packages and versions _don't_ exist. Thus, updating a dependency to a newly published version causes npm to think it doesn't exist and, instead of doing anything about it, npm will simply error out.
