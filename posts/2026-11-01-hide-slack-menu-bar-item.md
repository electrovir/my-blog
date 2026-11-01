---
title: Hide the Slack Menu Bar Item on macOS
tags: [macos, slack, tip]
---

How to remove Slack's new, useless menu bar item on macOS:

<!-- cspell:words slackmacgap tinyspeck -->

1. Run this in your Terminal:

    ```sh
    defaults write com.tinyspeck.slackmacgap "NSStatusItem Visible Item-0" -bool false
    ```

2. Restart Slack.
