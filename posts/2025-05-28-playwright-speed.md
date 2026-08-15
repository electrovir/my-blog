---
title: Faster Playwright Install on Ubuntu
tags: [dev, docker, github, linux, playwright, testing, tip, web]
---

I noticed recently that running frontend Playwright tests on macOS via GitHub Actions is noticeably faster than on Ubuntu. This is because macOS ships with more browser dependencies out of the box, whereas the base Ubuntu image needs to install them all every run, which takes time. But Playwright has an image with these dependencies already installed! In the end it saves about 30 seconds on Ubuntu.

<!-- truncate -->

## Set Playwright Container

Here is the Playwright image: https://mcr.microsoft.com/en-us/artifact/mar/playwright. This can then be used in GitHub Actions with the `container` job property: https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainer. With the latest version as of this writing, that would look like the following:

```yml
container: mcr.microsoft.com/playwright:v1.52.0
```

The trick is now to make sure this image is only used on the Ubuntu job since Windows and macOS already ship with the dependencies. That can be done with some simple logic:

```yml
container: ${{ matrix.os == 'ubuntu-latest' && 'mcr.microsoft.com/playwright:v1.52.0' || null }}
```

## Handle Root path bug

Sometimes with this setup, Firefox will fail to start and throw the following error:

```
Firefox is unable to launch if the $HOME folder isn't owned by the current user.
Workaround: Set the HOME=/root environment variable in your GitHub Actions workflow file when running Playwright.
```

As the message suggests, we can work around that by setting `HOME=/root`, but only on Linux (Ubuntu):

```yml
- name: Set HOME for Ubuntu
    if: runner.os == 'Linux'
    run: echo "HOME=/root" >> $GITHUB_ENV
```

For more details see https://github.com/microsoft/playwright/issues/6500.

## All Together

Here's all of this in the context of a GitHub Actions workflow file that tests macOS, Ubuntu, and Windows:

```yml
jobs:
    tests:
        runs-on: ${{ matrix.os }}
        container: ${{ matrix.os == 'ubuntu-latest' && 'mcr.microsoft.com/playwright:v1.52.0' || null }}
        strategy:
            fail-fast: false
            matrix:
                os: [macos-latest, ubuntu-latest, windows-latest]
        steps:
            - name: Set HOME for Ubuntu
              if: runner.os == 'Linux'
              run: echo "HOME=/root" >> $GITHUB_ENV
```

You can see a complete workflow file here: https://github.com/electrovir/shoot-mp/blob/62a839f44c1d835c9433ca19b82df77f2b37f8e4/.github/workflows/tests.yml

In very small experiments, this saves about 1 minute in install time but then add about 30 seconds for setting up the container, for a final savings of **about 30 seconds**. I'll take it!
