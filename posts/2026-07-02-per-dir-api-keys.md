---
title: Per-Dir API keys
tags: [cli, direnv, guide, security, worktrees]
---

How to easily setup per directory API keys to, for example, scope different AI subscriptions in different folders. This will use the CLI `direnv` to accomplish that.

<!-- truncate -->

## `direnv` Setup

1. Install direnv: https://direnv.net/docs/installation.html
    - Use `brew install direnv` for macOS.
2. Hook direnv into your shell: https://direnv.net/docs/hook.html
    - Add `eval "$(direnv hook zsh)"` in your `~/.zshrc` file on macOS.
3. For shells that have launched without using `cd` (like in agent-storm), you'll need to immediately trigger `direnv`.
    - On macOS, add `_direnv_hook` after `eval "$(direnv hook zsh)"` in your `~/.zshrc` file.
4. Open a new terminal tab or source your shell profile to load the change.
    - Run `source ~/.zshrc` on macOS.

## Per-Dir Setup

1. Create a `.envrc` file in the dir.
2. Export a variable in that file: `export ANTHROPIC_API_KEY="<something>";`.
3. Navigate to the folder that contains that `.envrc`.

Now when you `cd` into a dir that is an ancestor of folder containing the `.envrc` file (or multiple nested `.envrc` files), your env will be populated with those variables.

If you get a `Run direnv allow to approve its content` error, just run `direnv allow` (only needed once per folder).

## Setup worktree root

If you use git worktrees frequently, you'll need to allow `direnv` on _every new worktree_. This fixes that.

1. Create a `direnv` config file:
    1. `mkdir -p ~/.config/direnv`
    2. `touch ~/.config/direnv/direnv.toml`
2. Trust the root of your worktrees but adding the following to that `direnv.toml` file:
    ```
    [whitelist]
    prefix = ["<replace-with-absolute-path-to-worktree-root>"]
    ```
3. Make sure to replace `replace-with-absolute-path-to-worktree-root` above with the correct path.
