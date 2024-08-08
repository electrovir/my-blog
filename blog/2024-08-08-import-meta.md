---
title: What's in import.meta?
tags: [Node.js, dev, web, Bun, Deno]
---

If you look at the [`import.meta` docs on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta) you'll notice that it says:

> The spec doesn't specify any properties to be defined on it, but hosts usually implement the following properties: [url, resolve]

So what is actually in there? MDN is correct in saying `url` and `resolved` are usually (always) implemented, but each run-time also sticks some other stuff in there. From my own testing, below are the values that exist for each major runtime.

<!-- truncate -->

## Browsers

In my testing, Safari, Chrome, and Firefox all have the same `import.meta`. They don't add anything extra to MDN's listed properties:

-   `url`: A full URL to the current module file.
-   `resolve`: a function that converts a relative module path to a URL using the current module's URL as a base.

[MDN browser docs on `import.meta`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta#value)

## Node.js

Node.js v22 has the following:

-   `filename`: the equivalent of CommonJS's `__filename` or `url.fileURLToPath(import.meta.url)`.
-   `dirname`: the equivalent of CommonJS's `__dirname` or `path.dirname(import.meta.filename)`.
-   `resolve`: the same as in browsers.
-   `url`: the same as in browsers. Note that this uses a `file://` URL while `dirname` and `filename` are absolute paths (they start with `/`).

[Node.js docs on `import.meta`.](https://nodejs.org/api/esm.html#importmeta)

## Deno

Deno v1.45 has the following:

-   `main`: a boolean indicating "whether the current module is the entry point to your program". This is the equivalent of CommonJS's `require.main === module` check.
-   `filename`: the same as in Node.js.
-   `dirname`: the same as in Node.js.
-   `resolve`: the same as in browsers.
-   `url`: the same as in browsers.

[Deno docs on `import.meta`.](https://docs.deno.com/runtime/manual/runtime/import_meta_api)

## Bun

Bun v1.1 has the following:

-   `dir`: the same as `dirname`.
-   `file`: the same as `filename`.
-   `path`: the same as `filename`.
-   `require`: this is undocumented but appears to be CommonJS's [`require` function](https://nodejs.org/api/modules.html#requireid).
-   `resolveSync`: this is undocumented and is an synchronous version of `import.meta.resolve`. However, since `import.meta.resolve` is no longer asynchronous, they're the same.
-   `env`: a reference to `process.env`.
-   `main`: the same as in Deno.
-   `filename`: the same as in Node.js.
-   `dirname`: the same as in Node.js.
-   `resolve`: the same as in browsers.
-   `url`: the same as in browsers.

[Bun docs on `import.meta`.](https://bun.sh/docs/api/import-meta)
