---
title: Quick GitHub PR Creation
tags: [dev, cli, git, GitHub]
---

Add the following to your `~/.bashrc` or `~/.zshrc`:

<!-- cspell:words ghpr -->

```sh
alias ghpr='git push && gh pr create --fill'
```

Now just run `ghpr` after you've committed, and now you have a PR!
