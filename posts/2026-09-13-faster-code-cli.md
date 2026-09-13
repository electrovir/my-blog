---
title: Faster VS Code CLI
tags: [cli, dev, macos, shell, vscode, zsh]
---

On macOS I made `code .` (a command I run dozens of times per day) much faster by overriding the `code` command in my `~/.zshrc` file. This also modifies the bare `code` to be the same as `code .`.

```sh
code() {
    local arg
    (( $# )) || set -- .
    for arg in "$@"; do
        [[ -e $arg ]] || { command code "$@"; return $? }
    done
    open -b com.microsoft.VSCode "$@"
}
```

From what I understand and experience, `code .` by default boots a new Electron process, then waits for my existing VS Code instance to respond and take over. This override short-circuits that and goes straight to my existing, already open VS Code instance. (If VS Code is not yet open, it _does_ open it.)
