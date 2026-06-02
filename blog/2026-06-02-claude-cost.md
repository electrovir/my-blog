---
title: Track Claude CLI Cost
tags: [dev, cli, ai]
---

<!-- cspell:words statusline, argjson, Iseconds -->

A quick guide on how to track session cost with a Claude hook. This will both keep a running cost counter below your Claude CLI and persist session costs to `~/.claude/cost/`.

<!-- truncate -->

1. Create a shell script for the hook. I saved mine at `~/.claude/statusline.sh`:

    ```sh
    #!/usr/bin/env bash
    input=$(cat)
    sid=$(jq -r '.session_id' <<<"$input")
    cost=$(jq -r '.cost.total_cost_usd // 0' <<<"$input")
    dir=$(jq -r '.workspace.project_dir // .cwd // "unknown"' <<<"$input")

    mkdir -p ~/.claude/cost
    jq -nc --arg s "$sid" --arg d "$dir" --argjson c "${cost:-0}" --arg t "$(date -Iseconds)" \
    '{session_id:$s, dir:$d, cost_usd:$c, ts:$t}' > ~/.claude/cost/"$sid".json

    printf '$%.2f' "$cost"
    ```

2. Register the hook in `~/.claude/settings.json`:

    ```json
    {
        "statusLine": {
            "command": "bash ~/.claude/statusline.sh",
            "type": "command"
        }
    }
    ```
