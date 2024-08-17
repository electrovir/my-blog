---
title: Code Coverage Ignore Comments
tags: [Node.js, dev, web]
---

[c8](https://www.npmjs.com/package/c8) is my preferred package for calculating code coverage in Node.js testing and it is also apparently used by [web-test-runner](https://modern-web.dev/docs/test-runner/writing-tests/code-coverage/#writing-tests-code-coverage). However, c8 supports a lot more ignore comments then [they document](https://www.npmjs.com/package/c8#ignoring-uncovered-lines-functions-and-blocks). Below I've listed all the supported comments from my own personal testing and some other notes about ignoring lines for code coverage.

<!-- truncate -->

## Recommended comments to use

**tl;dr**, use these comments.

-   For reasonable sized blocks of ignored code, use `/* node:coverage ignore next <line-count> */`.
-   For long blocks of ignored code, wrap the block in `/* node:coverage disable */` and `/* node:coverage enable */`.

These recommended comments allow you to avoid the most problems and support the widest range of tools. (Specifically, they are supported by c8, web-test-runner, _and_ Node.js's built-in test runner).

## Comments that work

All of these comments will work with both Node.js tests using c8 and web-test-runner browser tests.

-   "c8" comments
    -   `/* c8 ignore next */`
    -   `/* c8 ignore next <line-count> */`
    -   `/* c8 ignore start */`
    -   `/* c8 ignore stop */`
-   "v8" comments
    -   `/* v8 ignore next */`
    -   `/* v8 ignore next <line-count> */`
    -   `/* v8 ignore start */`
    -   `/* v8 ignore stop */`
-   "node:coverage" comments
    -   `/* node:coverage ignore next */`
    -   `/* node:coverage ignore next <line-count> */`
    -   `/* node:coverage disable */`
    -   `/* node:coverage enable */`

## Comments that don't work

-   single line comments don't work
    -   `// c8 ignore next`
    -   `// c8 ignore next <line-count>`
    -   `// c8 ignore start`
    -   `// c8 ignore stop`
    -   `// v8 ignore next`
    -   `// v8 ignore next <line-count>`
    -   `// v8 ignore start`
    -   `// v8 ignore stop`
    -   `// node:coverage ignore next`
    -   `// node:coverage ignore next <line-count>`
    -   `// node:coverage disable`
    -   `// node:coverage enable`
-   `/* istanbul ignore next */`: istanbul comments are not supported
-   `/* c8 ignore next <block name> */`: block name ignore comments are not supported (as opposed to istanbul which does support this)
-   `/* node:coverage ignore start */`: use `/* node:coverage disable */`
-   `/* node:coverage ignore stop */`: use `/* node:coverage enable */`
-   `/* c8 disable */`: use `/* c8 ignore start */`
-   `/* c8 enable */`: use `/* c8 ignore stop */`

## Issues to keep in mind

-   The "ignore next" comments (without a line count) are very inconsistent and unpredictable. I've also found that sometimes those comments themselves get marked as missing coverage!
-   Node's built-in test runner with coverage (`node --test --experimental-test-coverage`) does not support any of the "v8" or "c8" comments, only the `node:coverage` comments.
