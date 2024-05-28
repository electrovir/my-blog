---
title: ESLint Violations as Warnings in VS Code
tags: [web, dev, VS Code, TypeScript, Comments, ESLint, Tip]
---

If you're using TypeScript and ESLint in VS Code, wip files or legacy files can quickly explode into a sea of red squiggles, making it hard to know where to start or track what's going on.

I like to hone in on type errors first, since they're typically more critical (as in, type errors will often completely crash your code). I keep those as scary red squiggles and tone ESLint down a bit by changing all its squiggles to just (orange) warnings.

This is easy to do with a quick edit to your user settings JSON file (accessed via the `>Preferences: Open User Settings (JSON)` command in VS Code):

```json
"eslint.rules.customizations": [
    { "rule": "*", "severity": "warn" },
]
```
