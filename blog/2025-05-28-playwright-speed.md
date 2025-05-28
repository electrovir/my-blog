---
title: Faster Playwright Install on Ubuntu
tags: [dev, web, testing, tip, Linux]
---

I noticed recently that running frontend Playwright tests on macOS via GitHub Actions is noticeably faster than on Ubuntu. This is because macOS ships with more browser dependencies out of the box, whereas the base Ubuntu image needs to install them all every run, which takes time. But Playwright has an image with these dependencies already installed! In the end it saves about 30 seconds on Ubuntu.

<!-- truncate -->

Here is the Playwright image: https://mcr.microsoft.com/en-us/artifact/mar/playwright. This can then be used in GitHub Actions with the `container` job property: https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainer. With the latest version as of this writing, that would look like the following:

```yml
container: mcr.microsoft.com/playwright:v1.52.0
```

The trick is now to make sure this image is only used on the Ubuntu job since Windows and macOS already ship with the dependencies. That can be done with some simple logic:

```yml
container: ${{ matrix.os == 'ubuntu-latest' && 'mcr.microsoft.com/playwright:v1.52.0' || null }}
```

Here's that line in the context of a GitHub Actions workflow file that tests macOS, Ubuntu, and Windows:

```yml
jobs:
    tests:
        runs-on: ${{ matrix.os }}
        container: ${{ matrix.os == 'ubuntu-latest' && 'mcr.microsoft.com/playwright:v1.52.0' || null }}
        strategy:
            fail-fast: false
            matrix:
                os: [macos-latest, ubuntu-latest, windows-latest]
```

You can see the complete workflow file here: https://github.com/electrovir/shoot-mp/blob/b7a55c455418e0e34e445b699c034f5b77dab985/.github/workflows/tests.yml

In very small experiments, this only saves about 1 minute in install time but then add about 30 seconds for setting up the container, for a final savings of **about 30 seconds**. I'll take it!
