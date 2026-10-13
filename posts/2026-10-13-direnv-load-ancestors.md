---
title: Load All Ancestor direnv Files
tags: [cli, direnv, guide, shell]
---

Make `direnv` load every `.envrc` file in a directory's ancestors, not just the closest one. `direnv` has a built-in `source_up` function for this, but it must be added to every `.envrc` file and I don't want to do that.

<!-- truncate -->

<!-- cspell:words direnvrc -->

`direnv` always sources `~/.config/direnv/direnvrc`, so add and call a function in there:

```sh
load_ancestors() {
  local dir files=() f
  dir=$(dirname "$PWD")
  while [[ $dir != "$HOME" ]]; do
    [[ -f $dir/.envrc ]] && files=("$dir/.envrc" "${files[@]}")
    dir=$(dirname "$dir")
  done
  for f in "${files[@]}"; do source_env "$f"; done
}
load_ancestors
```

Note that this stops walking ancestors once your user home is reached.
