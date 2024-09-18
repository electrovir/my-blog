---
title: Preventing Ridiculous ESLint auto-fixes in VS code
tags: [dev, VS Code, ESLint, tip]
---

I recently adopted ESLint into my workflow and enabled auto-fix-on-save in VS Code. I've noticed since then that sometimes _massive_ chunks of code get deleted on save by ESLint auto-fix. My current suspicion is that this is entirely to blame on the rule `@typescript-eslint/no-unused-expressions`. I've noticed other auto-fix issues as well, however, and will track down the culprit rules as they occur.

It is possible to leave on auto-fix and disable only the bad rules! Below is the JSON config that you will need to insert in your VS Code settings to do that. As I discover more problematic rules in the future, I'll append them below.

```json
"eslint.codeActionsOnSave.rules": [
    "!@typescript-eslint/no-unused-expressions",
    "*"
],
```
