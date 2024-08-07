---
title: Modifying Menu Bar Spacing on macOS
tags: [macOS]
---

Modifying menu bar spacing on macOS can be done with two commands:

```
defaults -currentHost write -globalDomain NSStatusItemSpacing -int x
defaults -currentHost write -globalDomain NSStatusItemSelectionPadding -int y
```

```
defaults -currentHost delete -globalDomain NSStatusItemSelectionPadding
defaults -currentHost delete -globalDomain NSStatusItemSpacing
```

https://www.reddit.com/r/MacOS/comments/16lpfg5/hidden_preference_to_alter_the_menubar_spacing/

https://apple.stackexchange.com/questions/406316/can-the-spacing-of-menu-bar-apps-be-modified-in-macos-big-sur-and-later/465674#465674

https://flaky.build/built-in-workaround-for-applications-hiding-under-the-macbook-pro-notch
