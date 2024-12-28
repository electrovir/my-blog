---
title: Use Touch ID for sudo on macOS
tags: [dev, tip, macOS]
---

Add the line

```
auth       sufficient     pam_tid.so
```

at the top of `/etc/pam.d/sudo` (you will need sudo access to write to that file).

You'll need to do this after at least every OS update as that file gets overwritten in those updates.

Here's a single command you can run to accomplish this:

```bash
sudo sed -i '' '2i\
auth       sufficient     pam_tid.so
' /etc/pam.d/sudo
```
