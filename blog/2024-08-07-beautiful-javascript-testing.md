---
title: The Beauty of the Current JavaScript Testing Ecosystem
tags: [Node.js, dev, web, testing]
---

The JavaScript testing scene is better than ever! From actual-browser based testing with web-test-runner to Node.js's built-in test runner to Chai working in both environments now, there's a lot to talk about how portable unit tests are between the two and also my new package, `@augment-vir/test`, which unites the two environments completely.

<!-- truncate -->

## Node.js built-in test runner

Node.js now has a built-in test runner, which is a dream to use. It's fast, it doesn't require a huge config, and `tsx` makes it a breeze to use with TypeScript. Let's take a look.

### Any suite functions you like

The Node.js test runner exports multiple test suite functions, so you can pick your favorite:

-   `describe()`
-   `suite()`
-   `it()`
-   `test()`

(Personally I prefer `describe()` and `it()` because it makes reading the test descriptions in the code more smooth.)

In a huge leap over Mocha, these suite functions are _not globals_. They are imported from `node:test`. (Note that you _must_ include the `node:` prefix for this import.)

```typescript
import {describe, it, suite, test} from 'node:test';
```

### All-in-one test runner

The Node.js's test runner includes everything you need in a test runner:

-   Awesome mocking capabilities: https://nodejs.org/api/test.html#mocking
    -   Notably, the ability to precisely control timers and the `Date` class functionality.
-   🧪 Code coverage: https://nodejs.org/api/test.html#collecting-code-coverage
-   🧪 Watch mode: https://nodejs.org/api/test.html#watch-mode
-   🧪 Snapshot testing: https://nodejs.org/api/test.html#snapshot-testing
-   Straightforward reporter customization: https://nodejs.org/api/test.html#custom-reporters

Note that several of those all-in-one features are still experimental (noted above by 🧪) and thus are not currently stable. Here are my experiences trying out those experimental features:

-   Code coverage calculations are not accurate for TypeScript. I'm using [c8](https://www.npmjs.com/package/c8) instead.
-   Watch mode works fine.
-   Snapshot testing works fantastically, though it's still missing types in [@types/node](https://www.npmjs.com/package/@types/node).

### How to run tests

It's super straightforward:

```sh
node --test 'src/**/*.test.js'
```

Running tests for TypeScript files isn't any harder:

```sh
tsx --test 'src/**/*.test.ts'
```

### What a test looks like in the Node.js built-in test runner

Nothing unfamiliar here! Node.js also includes its own `assert` library, but I recommend Chai instead as it has more features. (Chai also supports ESM now, more on that later.)

```typescript
import assert from 'node:assert/strict'; // make sure to import the strict version
import {describe, it} from 'node:test';
import {myFunction} from './index.js';

describe('my test', () => {
    it('does something', async () => {
        assert.deepStrictEqual(await myFunction(), {something: 'to test'});
    });
});
```

### Why I like the built in Node.js test runner

I've been using Mocha for backend testing for a few years now, and never really liked it much. However, I liked all the other options less! The Node.js test runner has been great though and now I'm completely switching to it in all my projects. Here's why:

-   support for `describe` and `it`
-   test functions (like `describe` and `it`) are _not_ globals
-   built-in really great snapshot testing
-   no cumbersome config file
-   super clear documentation
-   no need for another dependency
-   built-in support from `tsx` for TypeScript
-   incredible `Date` mocking capabilities (though I haven't tried it yet)

## web-test-runner

I've already talked about how much I love the [web-test-runner](https://modern-web.dev/docs/test-runner/overview/) testing package in a [previous blog post](/2024-06-27-javascript-testing-packages#web-test-runner), but I have to mention it here as a major contributor to my joy with the current JavaScript testing ecosystem. To summarize my thoughts from the previous blog post, web-test-runner is great because it runs frontend unit tests in an _actual browser_ and lets you run them in all the major browsers.

## Universal Chai

Chai's `assert` function has always been one of my favorites (intentionally leaving out the [confusing `expect` tester](/2024-06-27-javascript-testing-packages#chai)). There are no changes to its interface in modern Chai, but Chai is now, [as of 7 months ago](https://www.npmjs.com/package/chai/v/5.0.0), exported in ESM. Thus, it can now be used directly in both the backend _and_ the frontend without any fancy build processes or extra steps.

It still doesn't include it's own TypeScript types though.

## @augment-vir/test

Tying all of these great improvements in the testing ecosystem is my new, still unpublished, `@augment-vir/test` package. This package has the following features:

-   exports a `describe` testing function which automatically detects which environment its running in (backend vs frontend) and dynamically calls the correct test runner `describe` based on that (Node.js's built-in test runner for the backend and web-test-runner for the frontend). ([Still unreleased code here.](https://github.com/electrovir/augment-vir/blob/d8974a80b042ecdf06e9707a7d2daa198bf34d01/packages/test/src/augments/universal-testing-suite/universal-describe.ts#L150))
-   includes `itCases` and `it` alongside each other
-   no more separate @augment-vir/chai and @augment-vir/browser-testing packages
-   masks the Mocha `describe` export so you don't need to rely on globals
-   re-exports Chai's `assert` (so you don't need to separately install Chai), intentionally leaving out `expect` (so you don't have to worry about its issues), and includes types (so you don't need to separately install @types/chai)

Now you can import _everything_ for testing in both frontend and backend unit testing from a single package!

The only strangeness with this package is that `it` is no longer an import, but extracted from the `describe` callback's parameters, as you'll see in the example below. It's not a problem, it's just different than normal.

### What testing with @augment-vir/test looks like

Here's the same test example from the above Node.js test runner section but using @augment-vir/test:

```typescript
import {assert, describe} from '@augment-vir/test';
import {myFunction} from './index.js';

describe('my test', ({it}) => {
    it('does something', async () => {
        assert.deepStrictEqual(await myFunction(), {something: 'to test'});
    });
});
```

It's not a huge difference, but we now have the following characteristics of our tests:

-   they can be run in frontend or backend test runners without changing any code or writing separate test files
-   all test setup is imported from a single place

This allows running tests in both environments at the same time for maximum testing coverage (like in the new @augment-vir/common's [test command](https://github.com/electrovir/augment-vir/blob/d8974a80b042ecdf06e9707a7d2daa198bf34d01/packages/common/package.json#L24)) with no extra boilerplate in test files (as can be seen [here](https://github.com/electrovir/augment-vir/blob/d8974a80b042ecdf06e9707a7d2daa198bf34d01/packages/common/src/augments/array/array-element.test.ts)).

### Running tests with @augment-vir/test

@augment-vir/test is not a test runner, so you use the same commands for running Node.js's test runner or web-test-runner as always:

-   `tsx --test 'src/**/*.test.ts'`
-   `web-test-runner --config configs/web-test-runner.mjs`

(Or use `virmator test node` or `virmator test web` if you're using [virmator](https://www.npmjs.com/package/virmator), as I am.)
