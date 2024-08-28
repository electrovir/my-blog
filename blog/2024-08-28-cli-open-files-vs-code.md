---
title: Open Multiple Files in VS Code from a Grep
tags: [dev, VS Code, CLI]
---

A simple script:

```sh
grep -rl '<search-string>' <search/dir> | xargs code -r
```

Between two different directories:

```sh
cd <first-path> && grep -rl '<search-string>' <search/dir> | (cd <second-path>; xargs code -r)
```
