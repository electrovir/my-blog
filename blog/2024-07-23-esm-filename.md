---
title: __filename and __dirname in ESM
tags: [Node.js, dev]
---

ESM does not populate the [`__filename`](https://nodejs.org/api/modules.html#__filename) and [`__dirname`](https://nodejs.org/api/modules.html#__dirname) variables frequently used in CommonJS. This post shows what to do instead.

<!-- truncate -->

## Most robust

This version is supported in all modern Node.js versions. (As of writing this, July 2024, v18-v22.)

```typescript
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

## Most succinct

This version is shorter but is still marked as "experimental" in Node.js ([here](https://nodejs.org/api/esm.html#importmetadirname) and [here](https://nodejs.org/api/esm.html#importmetadirname)) and was only introduced recently into Node.js via v21.2.0 and v20.11.0.

```typescript
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
```
