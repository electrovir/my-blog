---
title: How Rendering Works in element-vir
tags: [web, dev]
---

[`element-vir`](https://www.npmjs.com/package/element-vir) is a package for defining and rendering [custom HTML web components](/2024-07-16-web-components). It wraps [Lit](https://lit.dev) and aims to dramatically reduce the number of mistakes devs can easily make. This post will talk about how rendering within `element-vir` works.

<!-- truncate -->

## Rendering an element

Rendering in `element-vir` is the process of taking the output of `renderCallback` and actually displaying it to the user in the DOM.

For example, this element will render a simple greeting:

```typescript
import {defineElement, html} from 'element-vir';

const MyGreeting = defineElement<{name: string}>()({
    tagName: 'my-greeting',
    renderCallback({inputs}) {
        return html`
            Hello there ${inputs.name}!
        `;
    },
});
```

`renderCallback` is called in the following situations:

-   on initial connection to the DOM
-   when change detection triggers a re-render

## Change detection

Change detection is used to detect when an element needs to be re-rendered. An `element-vir` element is re-rendered whenever changes are detected in its _inputs_ or _state_, based on reference equality. When a property within either of those (inputs or state) changes, the element is re-rendered.

In the below example, every time the user clicks the "Click Me" button, it updates the `clickCount` state property. When that state update happens, the element re-renders (and thus updates the "You've clicked X times" message).

```typescript
import {defineElement, html} from 'element-vir';

const MyGreeting = defineElement<{}>()({
    tagName: 'my-greeting',
    stateInitStatic: {
        clickCount: 0,
    },
    renderCallback({state, updateState}) {
        return html`
            You've clicked ${state.clickCount} times!
            <br />
            <button ${listen('click', () => updateState({clickCount: state.clickCount++}))}>
                Click Me
            </button>
        `;
    },
});
```

Since change detection runs when state or inputs change, there are two entry points for change detection in `element-vir`:

-   updating inputs on a child element with `.assign()`
-   updating state with `updateState()`

## Efficient template rendering

You're probably already thinking "wow that's super wasteful to completely re-render an entire element every time!" But fear not! That's not actually what happens. Since `element-vir` is a wrapper of Lit, it uses Lit's efficient template rendering. Regarding this matter, the Lit docs say:

> During an update, only the parts of the DOM that change are re-rendered. Although Lit templates look like string interpolation, Lit parses and creates static HTML once, and then only updates changed values in expressions after that, making updates very efficient.

(Taken from https://lit.dev/docs/components/rendering/#when-templates-render)

Thus, in the above click count example, the only part of the DOM that gets re-rendered is the `${state.clickCount}` interpolation.
