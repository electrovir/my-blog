---
title: Recursively convert OGG to MP3
tags: [dev]
---

This command will recursively find all OGG files in the currently directory and nested directories and convert them to MP3.

```sh
find . -type f -name '*.ogg' -exec bash -c 'for f; do ffmpeg -i "$f" -c:v copy -q:a 2 -map_metadata 0:s:0 "${f%.ogg}.mp3"; done' bash {} +
```
