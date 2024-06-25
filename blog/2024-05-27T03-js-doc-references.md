---
title: Use @link JSDoc comments
tags: [web, dev, VS Code, TypeScript, comments, tip]
---

Use `{@link VarName}` in JSDoc comments when referencing variables or types to get:

-   "Rename Symbol" support in VS Code
-   "Go to Definition" support in VS Code
-   "Find All References" support in VS Code
-   generated doc links to the original reference (in packages like [typedoc](https://www.npmjs.com/package/typedoc))

I assume that all the features in VS Code are driven by the TypeScript Language Server and thus are applicable to any editor that utilizes that same language server.
