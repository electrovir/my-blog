---
title: Show macOS app switcher on all screens
tags: [macOS]
---

To show the macOS app switcher on all screens:

<!-- cspell:word appswitcher -->

```sh
defaults write com.apple.dock appswitcher-all-displays -bool true
```

To see the change, restart the Dock with `killall Dock`.
