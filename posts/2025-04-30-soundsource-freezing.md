---
title: SoundSource freezing
tags: [automation, cron, macos, shell]
---

I can't use macOS anymore without [SoundSource](https://rogueamoeba.com/soundsource/). However, it frequently freezes, hangs, crashes, etc. This requires a not-too-lengthy but still annoying manual flow of opening up Activity Monitor to force kill it, then opening it again. So I made it easier and automated.

<!-- truncate -->

## Shell Alias

First, I always have a terminal open, so I added an alias to `~/.zshrc` to reboot SoundSource:

```sh
alias restart-sound="killall -9 SoundSource && sleep 5 && open -a SoundSource"
```

The sleep could probably be shorter, but I found at least some delay is needed between killing SoundSource and starting it again.

## Cron job

Then I added a cronjob to automatically restart SoundSource each day (with `crontab -e`), which seems to be helping:

```sh
0 2 * * * killall -9 SoundSource && sleep 5 && open -a SoundSource && echo "restarted $(date)"
```

Note: I had to add `export VISUAL=nano` to my `~/.zshrc` so `crontab -e` didn't use VIM since I'm not a VIM user.
