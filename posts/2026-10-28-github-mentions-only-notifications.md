---
title: GitHub Notifications for Mentions and Replies Only
tags: [dev, github, slack, tip]
---

How to get GitHub notifications only when someone mentions you or replies in one of your pull request threads, delivered to Slack instead of your email inbox. This is for anyone on a busy repo whose GitHub emails have become noise.

<!-- truncate -->

1. Stop watching the repo. On the repo's page, click "Watch" and pick "Participating and @mentions" (or "Ignore" if you want the Slack messages to be the only alerts).
2. Go to https://github.com/settings/reminders and connect your Slack workspace.
3. Create a new scheduled reminder:
    1. Leave "Review requests assigned to you" and "Review requests assigned to your team" unchecked.
    2. Check "Enable real-time alerts for pull requests".
    3. Under real-time alerts, check only these two:
        - "Someone comments in a thread you're in on a pull request"
        - "You are mentioned in a comment on a pull request"
    4. With these settings the days and times settings don't apply, so you can leave them or set them to anything you want.
4. Click "Create reminder".

Now GitHub sends you a Slack DM right away when someone @mentions you or replies to a thread you're in, and nothing else.

If you also want to hear about review requests or failed checks on your own PRs, check those boxes too.
