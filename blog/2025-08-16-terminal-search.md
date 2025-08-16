---
title: Enable up-arrow history auto-complete
tags: [dev, CLI]
---

This is really simple:

```sh
nano ~/.inputrc
```

Paste in:

```
"\e[A": history-search-backward
"\e[B": history-search-forward
```

Run:

```sh
bind -f ~/.inputrc
```
