---
title: Disable automatic macOS sleep
tags: [macOS]
---

<!-- cspell:word pmset -->

Sleeping on macOS messes up Thunderbolt USB devices, so I just can't have it happening.

```sh
sudo pmset -a sleep 0
```

For good measure, also enable "Prevent automatic sleeping when the display is off" under System Settings > Energy
