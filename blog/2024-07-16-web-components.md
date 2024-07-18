---
title: Basic Introduction to Using Web Components
tags: [web, dev]
---

Web Components are reusable, _native_ chunks of shared HTML, CSS, and JavaScript. They are _the_ way of reusing HTML and defining tightly-scoped and decoupled blocks of HTML with dedicated styles (CSS) and logic (JavaScript). How do you use them? This post is a high level introductory answer to that question.

<!-- truncate -->

## Define a custom element class

In order to use a custom element with the native browser APIs, you _must_ define a class that extends `HTMLElement`. How exactly you do this will depend on whether you're using a third party library or not to help with element definition (I recommend using [`element-vir`](https://www.npmjs.com/package/element-vir), my own package, or [Lit](https://lit.dev)).

<details>
  <summary>Code examples</summary>

-   In plain native JavaScript, simply extend the built-in global class `HTMLElement`:

    ```typescript
    // using native APIs only
    class MyElement extends HTMLElement {}
    ```

-   In [Lit](https://lit.dev), extend `LitElement` instead of `HTMLElement` (though `LitElement` itself extends `HTMLElement`):

    ```typescript
    // using Lit
    import {LitElement} from 'lit';
    import {customElement} from 'lit/decorators';

    @customElement('my-element')
    class MyElement extends LitElement {}
    ```

-   In [`element-vir`](https://www.npmjs.com/package/element-vir), the most basic example is a bit more verbose to prevent you from leaving out the necessary parts:

    ```typescript
    // using element-vir
    import {defineElement} from 'element-vir';

    const MyElement = defineElement<{}>()({
        tagName: 'my-element',
        renderCallback() {
            return '';
        },
    });
    ```

</details>

## Register a custom element

Once you've defined a custom element class, you have to tell the browser that it exists. This is done with [`window.customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) by passing in your desired tag name and element class. 3rd party libraries usually call this automatically so you don't have to remember it.

<!-- cspell:ignore myelement -->

Note that tag names have [specific requirements](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names), most notably that they require at least one hyphen, `-`, in their name (to prevent clashing with future built-in HTML elements, which will never contain a hyphen). Thus, for example, `my-element` is a valid custom tag name but `myelement` is not.

<details>
<summary>Code examples</summary>

-   In plain native JavaScript, you simply call `customElements.define` with a tag name of your choice and your class definition:

    ```typescript
    // using native APIs only
    window.customElements.define('my-element', MyElement);
    ```

-   In [Lit](https://lit.dev), the tag name has already been defined and the element has already been registered with the `customElement` decorator! This decorator calls `window.customElements.define()` internally.

    ```typescript
    // using Lit
    import {LitElement} from 'lit';
    import {customElement} from 'lit/decorators';

    @customElement('my-element')
    class MyElement extends LitElement {}
    ```

-   In [`element-vir`](https://www.npmjs.com/package/element-vir), the tag name has already been defined and the element has already been registered through the `defineElement` function! This function calls `window.customElements.define()` internally.

    ```typescript
    // using element-vir
    import {defineElement} from 'element-vir';

    const MyElement = defineElement<{}>()({
        tagName: 'my-element',
        renderCallback() {
            return '';
        },
    });
    ```

</details>

## Using your custom element

Once your custom element is defined and registered, you can use it in almost _any_ context where you would use a built-in HTML tag, like `document.createElement('my-element')` or `document.querySelector('my-element')`. You can also use it directly in your HTML just like any element:

```html
<main>
    Some stuff...

    <my-element></my-element>
</main>
```

### Upgrading

Because element definition and registration happens in JavaScript _only_, there's a potential race condition (depending on how you load and execute your JavaScript) between your HTML's usage of a custom element's tag name and the actual registration of that tag name. (For example, your web page could load an HTML page that uses `<my-element>` before `window.customElements.define('my-element', MyElement)` has been called.)

This is handled in what's called "custom element upgrading". Whenever you register a custom element, all existing instances of registered tag name automatically get "upgraded" to use your newly registered class!

## Custom element lifecycle

The native custom element API enables some lifecycle hooks so you can perform setup and teardown for elements that need it.

Discussed here are only the (imo) most important callbacks. A couple others exist as well, which you can read about on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks).

### Construction

First of all, of course, custom elements, since they're classes, have constructors. The constructor is called in the following situations:

-   when the tag name is found in any HTML parsed by the DOM:

    ```html
    <main>
        Some stuff...

        <my-element></my-element>
    </main>
    ```

-   when the element is manually created:

    ```typescript
    document.createElement('my-element');
    ```

**Important note**: using a custom element's constructor is actually _discouraged_. This will be explained more in the next section, [Connection](#connection); the connected callback is recommended instead.

### Connection

A element is "connected" whenever it is attached to the DOM. This happens when rendered from HTML or when manually appended to the DOM, such as when using `element.appendChild(myElement)`.

Using the connection lifecycle hook is preferred over using the constructor because any element can be freely removed and re-inserted into the DOM at any time. Insertion will not call any constructors, since the elements are already constructed. However, necessary cleanup (such as removing event listeners) should happen on removal (discussed later in [Disconnection](#disconnection)) and thus setup should then happen on connection. (If you use the constructor instead of the connection callback, removing and re-inserting an element would not cause the element to initialize again, and it will likely break.)

<details>
 <summary>Code examples</summary>

-   In [Lit](https://lit.dev) and native JavaScript, you hook into this with the `connectedCallback()` method:
    ```typescript
    // using native APIs or Lit
    class MyElement extends HTMLElement {
        connectedCallback() {
            // do init stuff here
        }
    }
    ```
-   In [`element-vir`](https://www.npmjs.com/package/element-vir), you hook into this with the `initCallback()` method:

        ```typescript
        // using element-vir
        import {defineElement} from 'element-vir';

        const MyElement = defineElement<{}>()({
            tagName: 'my-element',
            initCallback() {
              // do init stuff here
            },
            renderCallback() {
                return '';
            },
        });
        ```

</details>

### Disconnection

An element is "disconnected" whenever it is removed from the DOM, the exact opposite of connection. You should perform any cleanup here (such as removing window event listeners) so the element can be garbage collected.

<details>
 <summary>Code examples</summary>

-   In [Lit](https://lit.dev) and native JavaScript, you hook into this with the `disconnectedCallback()` method:
    ```typescript
    // using native APIs or Lit
    class MyElement extends HTMLElement {
        disconnectedCallback() {
            // do cleanup stuff here
        }
    }
    ```
-   In [`element-vir`](https://www.npmjs.com/package/element-vir), you hook into this with the `cleanupCallback()` method:

        ```typescript
        // using element-vir
        import {defineElement} from 'element-vir';

        const MyElement = defineElement<{}>()({
            tagName: 'my-element',
            cleanupCallback() {
              // do cleanup stuff here
            },
            renderCallback() {
                return '';
            },
        });
        ```

</details>

## Rendering custom HTML

The actual rendering of your custom element's HTML is the most cumbersome part of the web component process. Hence, there are many third party libraries that abstract and streamline it (like the already mentioned [`element-vir`](https://www.npmjs.com/package/element-vir) and [Lit](https://lit.dev) packages).

<details>
 <summary>Code examples</summary>

-   In native JavaScript, you have to separately define [templates](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots) in the DOM or manually create and attach all child elements with `document.createElement()` and [`element.appendChild()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild). You can read about that on MDN with their [Using shadow DOM guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) and their [Using templates and slots guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots).

    I _do not recommend_ using this method. It will be very cumbersome and error prone.

-   In [Lit](https://lit.dev) you render an element with the `render` method which can return a declarative HTML template string. This is _way_ more friendly than the native approach. This `render` method is called by Lit whenever an element updates.

    ```typescript
    // using Lit
    import {LitElement, html} from 'lit';
    import {customElement} from 'lit/decorators';

    @customElement('my-element')
    class MyElement extends LitElement {
        render() {
            return html`
                <p>Hello there</p>
            `;
        }
    }
    ```

-   In [`element-vir`](https://www.npmjs.com/package/element-vir), you render an element with the `renderCallback` method. Just like in Lit, this method returns an HTML template string and is called whenever an element updates.

    ```typescript
    // using element-vir
    import {defineElement, html} from 'element-vir';

    const MyElement = defineElement<{}>()({
        tagName: 'my-element',
        renderCallback() {
            return html`
                <p>Hello there</p>
            `;
        },
    });
    ```

</details>

## Element I/O

The technical specifics of how to assign inputs to elements and handle outputs from elements depends on the library you choose to use for rendering. However, any library that depends on the native APIs will follow this same structure:

-   inputs are passed to element through DOM properties or attributes
-   outputs are one-time events dispatched from elements that must be listened to in an element's ancestors

Each package has their own docs on the matter:

-   See Lit's docs for guidance on [attribute expressions](https://lit.dev/docs/templates/expressions/#attribute-expressions) or [property expressions](https://lit.dev/docs/templates/expressions/#property-expressions) (inputs) and [events](https://lit.dev/docs/components/events) (outputs).
-   See `element-vir`'s README for guidance on [inputs](https://www.npmjs.com/package/element-vir#defining-and-using-inputs) and [events](https://www.npmjs.com/package/element-vir#element-events-outputs) (outputs).
