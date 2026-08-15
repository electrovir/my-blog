---
title: ESM scripts can detect when they're run directly
tags: [dev, esm, javascript, nodejs]
---

CJS Node.js scripts have always been able to detect if they're running directly through the CLI or imported from another JS script through various means (the most recent being `require.main === module`).

However, ESM scripts have not been so lucky. For years the answer to this in ESM has simply been [no.](https://github.com/nodejs/help/issues/2420#issuecomment-575044606)

[Now it's in Node.js v24!](https://github.com/nodejs/node/pull/57804) You use it like this:

```typescript
if (import.meta.main) {
    // executed from CLI
} else {
    // imported into another JS module
}
```
