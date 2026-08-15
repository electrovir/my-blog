---
title: Enable up-arrow history auto-complete
tags: [bash, cli, dev, shell, zsh]
---

This how to enable up/down arrow auto-complete navigation instead of basic history navigation, without installing plugins.

## Bash

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

## Zsh

Put the following into your `~/.zshrc`:

<!-- cspell:word: bindkey -->

```
autoload -Uz up-line-or-beginning-search down-line-or-beginning-search
zle -N up-line-or-beginning-search
zle -N down-line-or-beginning-search
bindkey '^[[A' up-line-or-beginning-search     # Up arrow
bindkey '^[[B' down-line-or-beginning-search   # Down arrow
```
