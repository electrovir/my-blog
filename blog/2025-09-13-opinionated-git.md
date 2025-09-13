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

-   Do not _EVER_ merge the base branch into your feature branch. This is the hardest common mistake to recover from.
    -   Do not merge `main`, `master`, `dev` (or whatever you call your default branch) into your feature branches.
    -   Instead, update your feature branch by _rebasing_ it off of the base branch.
-   Merges are only acceptable for finishing / merging feature branch Pull Requests.
-   Only use squash merging when merging pull requests.

## Pull Requests

-   Pull Requests (PRs) should be small and, as much as possible, follow the Single Responsibility Principle (a single purpose per PR).
    -   Note that this rule isn't as strict when you don't have anyone reviewing your code.
-   Handle lots of small PRs by chaining them together.
    -   An example merge chain could be: default branch < feature A < Fix B < Feature C
    -   Use [`git-vir`](https://www.npmjs.com/package/git-vir) to merge and push changes anywhere within the chain.
    -   Always merge the PR pointing to the default branch (`main`, `master`, `dev`) first.

## Branch Management

-   Call your default branch `dev` (not `main` or `master`, both of have less intrinsic meaning).
-   Do not ever use `git pull`.
    -   If you're trying to update a local branch to match a remote branch, use `git reset --hard origin/<branch-name>`.
-   Do not open PRs or merge into release branches (like `prod` or `staging`).
    -   Instead, use `git reset --hard`.
    -   For example, when releasing `staging` to `prod`, run the following:
        ```sh
        git fetch origin staging
        git checkout prod
        git reset --hard origin/staging
        ```

## GUIs

-   Do not use Git GUIs to run any Git commit or push operations.
    -   Run all commands in a terminal so you know the exact commands that are being run and have full control over them.
    -   Learn to use the raw commands, they will give you so much more power and understanding than relying on a GUI.
-   If you wish, only a Git GUI (I recommend the simple one included with VS Code) for seeing what current changes you have and staging, reverting, unstaging, them.

## Global Git Configs

-   Set the default upstream branch: `git config --global push.default current`
    -   This prevents you from ever needing to manually set your local branch's upstream branch name.
    <!-- cspell:word committerdate -->
-   Fix branch order sort: `git config --global branch.sort -committerdate`
    -   This sorts your `git branch` output by latest branch.
-   Prevent auto branch tracking: `git config --global branch.autoSetupMerge false`
    -   This prevents new local branches from automatically tracking their base branch.
