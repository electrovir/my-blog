---
title: JavaScript Testing Packages
tags: [dev, testing, JavaScript]
---

There are tons of options for test packages and frameworks within the JavaScript ecosystem, both on the backend and frontend. This is my knowledge dump of them.

**Disclaimer**: This is only what I know about each package from browsing its docs, my experiences with them, and my, often strong (beware), opinions. I can't possibly hear or know about _all_ available testing packages.

<!-- truncate -->

## Unit test runners

Intended for unit testing, these are packages that load up your test files, execute them within a specific environment, and don't require any other processes to be running.

### Web Test Runner

By far this is my favorite test runner out of any that I've ever used. I write code _for the browser_, I debug my code _in a browser_, JavaScript is built _for the browser_, I already know all the APIs I need in _the browser_. Web Test Runner executes your tests in the browser itself; it's bewildering to me that other testing packages don't do this. Web Test Runner is a dream come true.

Make sure to use this in conjunction with [`@open-wc/testing`](https://www.npmjs.com/package/@open-wc/testing).

| [npm](https://www.npmjs.com/package/@web/test-runner) | [website](https://modern-web.dev/docs/test-runner/overview/) |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| **Environment**                                       | Frontend (browser)                                           |

#### Pros

-   it runs all test code within a browser environment, just like any code that runs in a browser (meaning you have access to all the built-in browser APIs)
-   it does not mock a browser environment
-   code coverage calculations are built-in
-   you can pick the browser runner you want (Playwright, Puppeteer, or Selenium)
-   very easily supports TypeScript
-   supports ESM out of the box, intentionally discourages CommonJS
-   follows Mocha's `describe`, `it` pattern
-   provides easy commands for _actually_ controller the mouse and keyboard (not just mocking it)
-   just pass an HTML snippet to `@open-wc/testing` to instantly render any custom element

#### Cons

-   maintenance seems to be very sparse, none of my bug reports or pull requests have received any attention from collaborators
-   it's caused dependency issues for me in the past with previous versions of [`lit`](https://www.npmjs.com/package/lit)
-   the CLI has some very unnecessary opinions, like not letting you call `--watch` from within another script
-   keeping open the browser for debugging is surprisingly cumbersome

### Mocha

Overall, I'm disappointed in Mocha's developer experience, but it works. Mocha is currently my go-to for backend unit testing, but that's only because it's interface is matched by Web Test Runner (my favorite). I'll happily switch from Mocha when I find something better.

| [npm](https://www.npmjs.com/package/mocha) | [website](https://mochajs.org) |
| ------------------------------------------ | ------------------------------ |
| **Environment**                            | Backend (Node.js)              |

#### Pros

-   it's well vetted and the api is stable (it's been around for ~13 years now)
-   it uses the common `describe` and `it` pattern
-   it's relatively easy to get it running with TypeScript

#### Cons

-   `describe` and `it` are global functions
-   it does not include its own types, you must rely on the community published types at [`@types/mocha`](https://www.npmjs.com/package/@types/mocha)
-   it claims to run in a browser but it's written in CommonJS so you need a build pipeline just to even begin to execute it in a browser
-   the docs are just a single giant web page that's a pain to navigate, it has tons of examples but somehow I find they're never very helpful
-   doesn't automatically support TypeScript
-   does not list file names in results
-   not a smooth experience in modern dev

### Jest

I do not like Jest. I've tried using it before several times and it's always been a miserable experience.

| [npm](https://www.npmjs.com/package/jest) | [website](https://jestjs.io) |
| ----------------------------------------- | ---------------------------- |
| **Environment**                           | Backend (Node.js)            |

#### Pros

-   includes its own types
-   uses `describe`

#### Cons

-   uses `test` instead of `it`
-   `describe` and `test` are global
-   it is targeted towards React
-   requires tons of configuration
-   mocks the DOM / frontend (instead of using a real browser)

### Karma

I used Karma at a previous job with Angular. It was very meh, but worked fine. Karma itself says that it is deprecated, so you probably shouldn't use it anymore.

| [npm](https://www.npmjs.com/package/karma) | [website](https://karma-runner.github.io) |
| ------------------------------------------ | ----------------------------------------- |
| **Environment**                            | Backend (Node.js)                         |

#### Cons

-   deprecated

### AVA

I coincidentally came across this package recently. Based on what I've listed below, I'm not interested.

| [npm](https://www.npmjs.com/package/ava) | [website](https://avajs.dev/) |
| ---------------------------------------- | ----------------------------- |
| **Environment**                          | Backend (Node.js)             |

#### Pros

-   requires `test` to be imported (it's not a global)

#### Cons

-   uses `test` instead of `it`
-   has no test suite or grouping function, like `describe`

### Node.js built-in test runner

Node.js actually has its own built-in test runner. I've yet to use it but I'm very intrigued by it.

| `'node:test'`   | [website](https://nodejs.org/api/test.html) |
| --------------- | ------------------------------------------- |
| **Environment** | Backend (Node.js)                           |

#### Pros

-   built-in to Node.js
-   supports `describe`, `it`, `suite`, and `test`
-   `describe`, `it`, `suite`, `test` are not globals

### Vitest

Uses Vite for in-browser testing. I haven't used this but I expect it's at least decent since I love using Vite.

| [npm](https://www.npmjs.com/package/vitest) | [website](https://vitest.dev) |
| ------------------------------------------- | ----------------------------- |
| **Environment**                             | Frontend (browser)            |

#### Pros

-   uses Vite
-   supports `describe`
-   `test` and `describe` are not globals
-   includes `chai`'s `assert` and `expect`

#### Cons

-   does not support `it`

## E2E test runners

Intended for end-to-end testing, these are packages that load up your test files, execute them within a backend (Node.js) environment, open up a browser and hit a given URL, and require other processes to actually serve up something (a frontend server, a backend, etc). Since these run within a Node.js context, you can also setup tests by interacting with your backend directly.

### Playwright

Playwright is my go-to choice for E2E testing. It supports the largest range of browsers and I've had the least amount of pain with its API.

| [npm](https://www.npmjs.com/package/playwright) | [website](https://playwright.dev)                |
| ----------------------------------------------- | ------------------------------------------------ |
| **Environment**                                 | Backend (Node.js) testing the frontend (browser) |

#### Pros

-   allows testing in Chrome (Chromium), Safari (WebKit), and Firefox
-   supports Linux, macOS, and Windows
-   uses `suite` and `test`, not `describe` or `it`
-   `test` and `suite` are not globals

#### Cons

-   it's possible to run code in the browser itself but Playwright actively discourages doing so
-   you have to reinstall browsers with a separate command every time there's an update to them
-   you have to install system level dependencies in CI environments

### Cypress

| [npm](https://www.npmjs.com/package/cypress) | [website](https://www.cypress.io)                |
| -------------------------------------------- | ------------------------------------------------ |
| **Environment**                              | Backend (Node.js) testing the frontend (browser) |

#### Pros

-   supports TS configs
-   uses `describe` and `it`

#### Cons

-   `describe` and `it` are globals
-   built on top of jQuery
-   has a fancy UI that just gets in the way
-   documentation is overly verbose and doesn't actually answer any of my questions
-   always trying to push their cloud product

### Puppeteer

Very similar to Playwright, but much more limited; almost entirely focused on testing Chrome.

| [npm](https://www.npmjs.com/package/puppeteer) | [website](https://pptr.dev)                      |
| ---------------------------------------------- | ------------------------------------------------ |
| **Environment**                                | Backend (Node.js) testing the frontend (browser) |

#### Pros

-   similar API to Playwright

#### Cons

-   focused on Chrome, with experimental Firefox support

## Code coverage

These packages calculate code coverage within your tests. They still require you to pick a separate test runner package.

### nyc

nyc is the CLI for Istanbul (I don't understand the naming choices). This has worked better for me in CommonJS.

| [npm](https://www.npmjs.com/package/nyc) | [website](https://istanbul.js.org) |
| ---------------------------------------- | ---------------------------------- |
| **Environment**                          | Backend (Node.js)                  |

#### Pros

-   supports JS config
-   accurate with CommonJS code

#### Cons

-   only supports CommonJS config
-   cumbersome configuration
-   very flakey, easy to accidentally use an environment where it simply doesn't work
-   the "ignore line" comments are very limited
-   inaccurate in ESM

### c8

This has worked better for me than nyc in ESM.

| [npm](https://www.npmjs.com/package/c8) | [website](https://github.com/bcoe/c8#readme) |
| --------------------------------------- | -------------------------------------------- |
| **Environment**                         | Backend (Node.js)                            |

#### Pros

-   accurate with ESM code
-   the "ignore line" comments are much more flexible and powerful

#### Cons

-   only supports JSON configs
-   cumbersome configuration (very similar to nyc)
-   misleading documentation
-   very flakey, easy to accidentally use an environment where it simply doesn't work
-   inaccurate in CommonJS

### Web Test Runner

Web Test Runner ([mentioned earlier as a unit test runner](#web-test-runner)) also has built-in code coverage.

| [npm](https://www.npmjs.com/package/@web/test-runner) | [website](https://modern-web.dev/docs/test-runner/overview/) |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| **Environment**                                       | Frontend (browser)                                           |

#### Pros

-   it works perfectly
-   uses c8's more powerful "ignore line" comments

#### Cons

-   only works in browsers, can't be used for Node.js testing

## Assertion Libraries

These packages simply export a bunch of functions for asserting that test conditions are as expected.

### Chai

I like using Chai, but only its `assert` export. Its `expect` export, while actually being easier to read, has misleading names and bad TypeScript typing.

| [npm](https://www.npmjs.com/package/chai) | [website](https://www.chaijs.com)         |
| ----------------------------------------- | ----------------------------------------- |
| **Environment**                           | Backend (Node.js) and Frontend? (browser) |

#### Pros

-   it's so popular that it's reimplemented / re-exported for ESM contexts as well (like in `@open-wc/testing` and Vitest)

#### Cons

-   Claims browser support but used CommonJS (so it won't run in a browser without a separate build pipeline, like Mocha). The newer versions claim to be ESM, so this might no longer be an issue.
-   `expect` has unclear method names and TypeScript types
-   does not support asserting thrown errors
-   assertions are not type guards

### @open-wc/testing

This is the recommended assertion library for [the aforementioned Web Test Runner](#web-test-runner) test runner. It "exposes chai as an es module with useful plugins pre-configured" and makes in-browser testing and asserting a breeze.

| [npm](https://www.npmjs.com/package/@open-wc/testing) | [website](https://github.com/open-wc/open-wc/blob/master/docs/docs/testing/testing-package.md) |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Environment**                                       | Frontend (browser)                                                                             |

#### Pros

-   ESM, works in browser without any extra steps
-   makes it really easy to test arbitrary HTML

### Cons

-   does not support asserting thrown errors (just like Chai)

### Jest

Jest ([mentioned earlier as a test runner](#jest)) also includes its own assertions. I have no comments on its pros and cons, but if you use Jest you should probably use this.

| [npm](https://www.npmjs.com/package/jest) | [website](https://jestjs.io) |
| ----------------------------------------- | ---------------------------- |
| **Environment**                           | Backend (Node.js)            |

### Vitest

Vitest ([mentioned earlier as a test runner](#vitest)) also includes assertions. They match Chai's.

| [npm](https://www.npmjs.com/package/vitest) | [website](https://vitest.dev) |
| ------------------------------------------- | ----------------------------- |
| **Environment**                             | Frontend (browser)            |

### Node.js built-in assert

To accompany Node.js's [already mentioned built-in test runner](#nodejs-built-in-test-runner), Node.js also has a built in assertion module. I've not used it.

| `'node:assert/strict'` | [website](https://nodejs.org/api/assert.html) |
| ---------------------- | --------------------------------------------- |
| **Environment**        | Backend (Node.js)                             |

#### Pros

-   built in to Node.js

#### Cons

-   the plain `'node:assert'` module uses ["legacy" assertion mode](https://nodejs.org/api/assert.html#legacy-assertion-mode) with lots of undesirable results

### run-time-assertions

This is a package that I wrote to make up the difference in missing Chai functionality plus lots of other related assertion helpers.

| [npm](https://www.npmjs.com/package/run-time-assertions) | [website](https://electrovir.github.io/run-time-assertions/) |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| **Environment**                                          | any                                                          |

#### Pros

-   _actually_ supports Node.js _and_ the browser with CommonJS _and_ ESM exports
-   easily asserts thrown errors
-   all assertions are also type guards, as much as possible

#### Cons

-   not a full replacement for Chai, so must be used in addition to Chai (or something like it)

### @augment-vir/browser-testing and @augment-vir/chai

These are more packages that I wrote to make testing a bit easier, with some environment-specific assertions. Each has a set of identical exports (like `itCases`) while also having environment-specific exports.

| [@augment-vir/browser-testing](https://www.npmjs.com/package/@augment-vir/browser-testing) |                    |
| ------------------------------------------------------------------------------------------ | ------------------ |
| **Environment**                                                                            | Frontend (browser) |

| [@augment-vir/chai](https://www.npmjs.com/package/@augment-vir/chai) |                   |
| -------------------------------------------------------------------- | ----------------- |
| **Environment**                                                      | Backend (Node.js) |

#### Pros

-   lots of useful test utilities

#### Cons

-   no documentation 🙈

### Testing Library

This is a suite of packages that are each specific to a specific environment or framework. I don't use anything that they have packages for so I've never tried it. (Also, I can't figure out how to actually use it.)

| [npm](https://www.npmjs.com/org/testing-library) | [website](https://testing-library.com) |
| ------------------------------------------------ | -------------------------------------- |
| **Environment**                                  | Frontend (browser)                     |

#### Cons

-   documentation talks a lot about "guiding principles" instead of "how do you actually use this"
-   in an odd position between lower-level unit testing and end-to-end testing, I'd prefer to just stick to either of those
