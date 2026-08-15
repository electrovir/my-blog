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
    -   Do not merge other features branches into your feature branch.
    -   Instead, when you need to update a feature branch, use `git rebase`.
    -   Not following this convention will not affect the default branch if the follow the next convention, so it's not a strict convention. However, when your branch's git history gets messed up and you ask me to help, it will be your fault that it takes a long time to fix :)
-   Merges are only acceptable for merging feature branch pull requests.
    -   Only use squash merging when merging feature branch pull requests: this produces the most clean git history.

## Pull Requests

-   Pull Requests (PRs) should be small and, as much as is reasonable, follow the Single Responsibility Principle (a single purpose per PR).
    -   A good target to reach for is one commit per PR, but, as mentioned above, _be reasonable_. One commit per PR is not required.
-   Handle lots of small PRs that depend on each other by chaining them together.
    -   An example merge chain could be: default branch < feature A < Fix B < Feature C
    -   Use [`git-vir`](https://www.npmjs.com/package/git-vir) to merge and push changes from within a PR chain.
        -   `git-vir push`: to update a branch anywhere in the chain and automatically update all dependent branches.
        -   `git-vir merge --squash`: to merge the base of the chain and automatically rebase each branch in the chain.
    -   Always merge the PR pointing to the default branch (`main`, `master`, `dev`), or the base of the chain, first.
    -   If you choose not to use `git-vir`, you'll have to manually rebase every branch in your chain.

## Branch Management

-   Call your default branch `dev` (not `main` or `master`). `dev` has much more intrinsic meaning to it.
-   Do not use `git pull`.
    -   If your goal in using `git pull` is to make your local branch match the remote copy of your branch, use `git reset --hard origin/<branch-name>`.
    -   If your goal is to merge your branch's local and remote changes together, use `git rebase` (and you'll probably want to use the `--onto` flag).
-   Do not open PRs that point to release branches (like `prod` or `staging`). Do not merge into release branches.
    -   Instead of merging into feature branches, directly push to them.
    -   For example, when releasing `staging` to `prod` using branches, run the following:
        ```sh
        git fetch origin staging
        git push origin origin/staging:prod
        ```
    -   When a hot fix is push to a release branch (`prod` or `staging`), always immediately open a fresh PR, with that hotfix, based on `dev`. This ensure that your next release does not delete the hot fix.

## GUIs

-   Do not use GitHub's "resolve conflicts". Fix them locally via the Git CLI.
-   Do not use Git GUIs to run any Git commit or push operations.
    -   Run all commands in a terminal so you know exactly what commands are being run and so you have full control over them.
    -   Learn to use the raw commands, they will give you so much more power and understanding than relying on a GUI.
-   If you wish, only a Git GUI (I recommend the simple one included with VS Code) for seeing what current changes you have as well as staging, reverting, or unstaging them.

## Global Git Configs

Use these configs to save yourself a lot of time.

-   Set the default upstream branch: `git config --global push.default current`
    -   This prevents you from ever needing to manually set your local branch's upstream branch name.
    <!-- cspell:word committerdate -->
-   Fix branch order sort: `git config --global branch.sort -committerdate`
    -   This sorts your `git branch` output by latest branch.
-   Prevent auto branch tracking: `git config --global branch.autoSetupMerge false`
    -   This prevents new local branches from automatically tracking their base branch.
