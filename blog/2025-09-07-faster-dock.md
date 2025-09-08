---
title: Show/hide macOS Dock faster
tags: [macOS]
---

To show the macOS app switcher on all screens:

<!-- cspell:word autohide -->

```sh
defaults write com.apple.dock autohide-delay -int 0
defaults write com.apple.dock autohide-time-modifier -float 0.1
```

To see the change, restart the Dock with `killall Dock`.
