---
title: Frontend Bundling
tags: [bundling, dev, frontend, javascript, web]
---

Frontend bundling is a process by which your frontend source code, typically spread across multiple files, gets squished and transformed into few files, often just one file. This post will cover some basics around bundling.

<!-- truncate -->

## Bundling

As mentioned, bundling reduces a frontend code base into fewer files. This is done to reduce the request overhead for the end user: it's better to fetch one moderately sized file than to fetch hundreds of tiny files. Bundling is also a good step to handle TypeScript to JavaScript transpilation.

To maximally reduce network request overhead, the goal is to bundle all the frontend JavaScript into a single file. However, this can be overdone. If the bundle is too large (most bundlers print warnings when they think your bundle is too large) then squishing it all into a single file will actually reduce load times because the user must now wait for the entire bundle to load, even though it's likely that most of that bundle won't be immediately needed upon initial page load. Enter chunking:

## Chunking

Chunking is the process of splitting the bundle into multiple pieces, multiple JavaScript files. This is used to mitigate the issues caused by a bundle that is too large. The idea is that you can architect your code such that it does this:

1. On initial page load, the user's browser loads the "main" chunk (JS file).
2. The main chunk contains all code necessary to render the current page.
3. Based on user actions or preferences, additional chunks (JS files) can then be loaded on-demand _or_ preloaded in the background.

This ensures the fastest initial load time ([one of the most important metrics for a website](https://www.cloudflare.com/learning/performance/why-site-speed-matters)).

This is typically achieved through dynamic imports ([`await import('')`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import) rather than [`import {} from ''`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import)). You could, for example, dynamically load a different element when the user clicks a button.

## Minification

Minification is a common step in bundling that makes JavaScript take up less space, further improved user load times. For example, variable names are condensed to be as small as possible without breaking functionality, white space is removed as much as possible, etc.

The downside of minification is that it results in code that is being very difficult to read, though that also provides slight security benefits. Stack traces will look like gibberish, class names are meaningless, etc. Debugging becomes very difficult. Enter source maps:

## Source Maps

Source maps are files that map modified code (minified code, bundled code, chunked code, etc.) back to the original source code. For example, a source map could map a minified single-file bundle back to the original TypeScript source code files. When source maps are included, browser dev tools will automatically fetch and display the original code.

Typically Source maps are not uploaded with production deploys but could be included in testing or dev environments. They can also be uploaded to error tracking services (like [Sentry](http://sentry.io) to provide accurate stack traces.
