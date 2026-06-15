---
title: Script to Secure Your GitHub Repos
tags: [cli, github, script]
---

Here is a script using the GitHub `gh` CLI to iterate over all of your repos and make them more secure by setting the following settings on them:

-   pull requests only allowed for collaborators (to prevent [cache poisoning attacks](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem))
-   immutable releases (because immutable releases are good)

<!-- truncate -->

Save this to a file, then call it with `bash <file-path>`. Note that if you have a lot of repos, this will take a while!

<!-- cspell:words pipefail, mapfile -->

```sh
#!/usr/bin/env bash
set -uo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "please install the github cli" >&2
  exit 1
fi

if ! gh api user -q .login >/dev/null 2>&1; then
  echo "please authenticate your github cli" >&2
  exit 1
fi

echo "Listing GitHub repos..."

mapfile -t repos < <(gh api --paginate "user/repos?affiliation=owner&per_page=100" \
  --jq '.[] | select(.archived == false) | .full_name')

count=${#repos[@]}

if [[ "$count" -eq 0 ]]; then
  echo "no repos found"
  exit 0
fi

read -r -p "Are you sure you want to update $count repos? [y/N] " reply
if [[ "$reply" != [yY] && "$reply" != [yY][eE][sS] ]]; then
  echo "aborted"
  exit 0
fi

failures=0

for repo in "${repos[@]}"; do
  if gh api -X PATCH "repos/$repo" -f pull_request_creation_policy=collaborators_only >/dev/null \
     && gh api -X PUT "repos/$repo/immutable-releases" >/dev/null; then
    echo "✓ $repo"
  else
    echo "✗ $repo (failed)" >&2
    failures=$((failures + 1))
  fi
  sleep 1
done

if [[ "$failures" -gt 0 ]]; then
  echo "finished with $failures repo(s) failed" >&2
  exit 1
fi
```
