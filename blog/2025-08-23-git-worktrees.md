---
title: Setup and Use Git Worktree
tags: [dev, git, guide]
---

Clone a repo with worktrees setup from the start:

```sh
mkdir <repo-name>
cd <repo-name>
git clone --bare --filter=blob:none <git-url>
cd <repo-name>.git
```

Some options to help your sanity:

```sh
# always prune on fetch
git config fetch.prune true
# allow `git fetch origin <branch-name>` to work as expected (create a remote ref)
git config remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'
```

To create a new branch:

```sh
git worktree add ../<branch-name>
cd ../<branch-name>
```

To copy a remote branch (note that this will only work with the above fetch config set):

```sh
git fetch origin <branch-name>
git worktree add ../<branch-name>
cd ../<branch-name>
```

To create a new branch based on a remote branch:

```sh
git worktree add ../<branch-name> -b <branch-name> --no-track origin/dev
cd ../<branch-name>
```
