---
title: Convert H.264 MP4 to WebM
tags: [video, CLI, dev]
---

```shell
ffmpeg -i video.mp4 -c:v libvpx -crf 30 -b:v 0 -c:a libvorbis video.webm
```

<!-- truncate -->

It took way too long for me to find how to generate a _valid_ WebM video file from an H.264 MP4 file with a single command. So I'm documenting it here for future reference in case I need it.

By "valid" I mean: correctly plays in browsers. Nearly all commands I found online produced WebM files that were either totally broken or could only be played in some browsers (testing was done on MacOS Safari, Firefox, and Chrome).
