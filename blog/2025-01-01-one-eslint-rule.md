---
title: Run ESLint with only a single rule
tags: [dev, ESLint, tip]
---

It's easy to run ESLint with just a single rule from you config without much work using the `--rule` flag.

<!-- truncate -->

The input to this rule is a JSON string:

```sh
npx eslint --rule '{"<rule-name>": "error"}'
```

You can use plugin names from your ESLint config. Example:

```sh
npx eslint --rule '{"@cross-module/no-bad-cjs-imports": "error"}'
```

Note that the official ESLint docs on the flag (https://eslint.org/docs/latest/use/command-line-interface#--rule) mention a different input syntax.
