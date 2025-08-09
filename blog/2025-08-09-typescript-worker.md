---
title: Running a TypeScript worker in Node.js
tags: [Node.js, dev, TypeScript, tip]
---

It's really hard to get `new Worker()` from `node:worker_threads` to work when running code via `tsx`. I finally got an example working. Here's how to do it:

```TypeScript
import {fileURLToPath} from 'node:url';
import {Worker} from 'node:worker_threads';

const workerPath = fileURLToPath(import.meta.resolve('./sample-worker.js'));
const worker = import.meta.filename.endsWith('.ts')
    ? new Worker(
          `import('tsx/esm/api').then(({ register }) => { register(); import('${workerPath}') })`,
          {
              eval: true,
          },
      )
    : new Worker(workerPath);
```
