---
title: My Opinionated Git Conventions
tags: [dev, git]
---

My (very) opinionated Git conventions. If you follow these, you will be much less likely to create messed up git histories, and your git setup will make much more sense.

<!-- truncate -->

## Git Version

Make sure your Git is up to date. On macOS, install Git via Homebrew (don't stick with the default version shipped with macOS):

1. Install Homebrew if you haven't: https://brew.sh
2. Install Git via Homebrew: `brew install git`

The latest version as of this writing is 2.51.0. You can find the latest version tag at the following locations:

-   https://git-scm.com
-   https://formulae.brew.sh/formula/git
-   https://github.com/git/git/tags

## Merging

-   Do not _EVER_ merge a branch into feature branches. This is the hardest common mistake to recover from.
    -   Do not merge `main`, `master`, `dev` (or whatever you call your default branch) into feature branches.
    -   Instead, when you need to update a feature branch, use `git rebase` instead.
-   Merges are only acceptable for merging feature branch pull requests.
    -   Only use squash merging when merging feature branch pull requests.

## Pull Requests

-   Pull Requests (PRs) should be small and, as much as is reasonable, follow the Single Responsibility Principle (a single purpose per PR).
-   Handle lots of small PRs by chaining them together.
    -   An example merge chain could be: default branch < feature A < Fix B < Feature C
    -   Use [`git-vir`](https://www.npmjs.com/package/git-vir) to merge and push changes from within a PR chain.
    -   Always merge the PR pointing to the default branch (`main`, `master`, `dev`), or the base of the chain, first.

## Branch Management

-   Call your default branch `dev` (not `main` or `master`).
-   Do not ever use `git pull`.
    -   If you're trying to update a local branch to match a remote branch, use `git reset --hard origin/<branch-name>`.
-   Do not open PRs that point to release branches (like `prod` or `staging`). Do not _merge_ into release branches.
    -   Instead of merging into feature branches, directly push to them.
    -   For example, when releasing `staging` to `prod` using branches, run the following:
        ```sh
        git fetch origin staging
        git push origin origin/staging:prod
        ```

## GUIs

-   Do not use GitHub's "resolve conflicts". Fix them locally via the CLI.
-   Do not use Git GUIs to run any Git commit or push operations.
    -   Run all commands in a terminal so you know exactly what commands are being run and so you have full control over them.
    -   Learn to use the raw commands, they will give you so much more power and understanding than relying on a GUI.
-   If you wish, only a Git GUI (I recommend the simple one included with VS Code) for seeing what current changes you have and staging, reverting, or unstaging them.

## Global Git Configs

Use these configs to save yourself a lot of time.

-   Set the default upstream branch: `git config --global push.default current`
    -   This prevents you from ever needing to manually set your local branch's upstream branch name.
    <!-- cspell:word committerdate -->
-   Fix branch order sort: `git config --global branch.sort -committerdate`
    -   This sorts your `git branch` output by latest branch.
-   Prevent auto branch tracking: `git config --global branch.autoSetupMerge false`
    -   This prevents new local branches from automatically tracking their base branch.
