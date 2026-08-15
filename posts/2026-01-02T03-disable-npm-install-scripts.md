---
title: Disable npm install scripts
tags: [dev, npm, security]
---

(for security purposes)

-   Globally:
    -   run `npm config set ignore-scripts true`
    -   this will populate `~/.npmrc`
-   Per repo:
    -   create `./.npmrc`
    -   add `ignore-scripts=true` into that file
