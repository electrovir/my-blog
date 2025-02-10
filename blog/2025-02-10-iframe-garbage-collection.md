---
title: Iframe Garbage Collection
tags: [web, dev, tip]
---

When you have an iframe loading an intense amount of content (like an entire video game, in the case of https://playfeed.io), and you need you need to reuse that iframe, you need to force the iframe to free up its memory usage so the browser will garbage collect it.

<!-- truncate -->

Here are some ideas that didn't work:

-   get a reference to the iframe, remove it from the DOM: `parent.querySelector('iframe').remove()`
    -   this only removes the element from the DOM but it keeps the iframe in memory still
-   gate the `iframe` behind an `if` statement of some kind (such as a ternary, `renderIf` in element-vir, `ngIf` in Angular, etc.)

What _does_ work, however, is the following:

1. Load the initial iframe `src`.
2. When it's time to reuse the iframe, set its `src` to an empty page (the below example uses `src="/blank.html"`).
3. Wait for the empty page to finish loading.
4. Set the new iframe `src`.

## Waiting for the empty page to load

Step 3 in the working steps is the hard part. The browser provides several naive ways of determining when a child iFrame is loaded (such as the [`load` event](https://developer.mozilla.org/docs/Web/API/HTMLElement/load_event)). However, after lots of experimentation over the years I've found that none of them are reliable for knowing when an iframe has _truly_ loaded. So I built a package to handle that: https://www.npmjs.com/package/interlocking-iframe-messenger

Here's how to use `interlocking-iframe-messenger` to solve this problem:

1. Create an iframe messenger using `interlocking-iframe-messenger`:

    ```typescript
    // iframe-messenger.ts
    import {createIframeMessenger, IframeMessageDirectionEnum} from 'interlocking-iframe-messenger';

    export enum LoadedIframeMessageType {
        IframeLoaded = 'iframe-loaded',
    }

    export type LoadedIframeMessageData = {
        [LoadedIframeMessageType.IframeLoaded]: {
            [IframeMessageDirectionEnum.FromChild]: string;
            [IframeMessageDirectionEnum.FromParent]: undefined;
        };
    };

    export const iframeMessenger = createIframeMessenger<LoadedIframeMessageData>();
    ```

2. Create a script for determining when a child iframe has loaded (this will be called by the child's HTML):

    ```typescript
    // child-iframe.script.ts
    import {LoadedIframeMessageType, iframeMessenger} from './iframe-message.js';

    iframeMessenger.listenForParentMessages({
        parentOrigin: window.location.origin,
        listener({type}) {
            if (type === LoadedIframeMessageType.IframeLoaded) {
                return window.location.pathname;
            }

            throw new Error(`Unexpected iframe message type: '${String(type)}'`);
        },
    });
    ```

3. Create a `blank.html` file (this will be loaded in the iframe to allow garbage collection):

    ```html
    <!-- blank.html -->
    <!doctype html>
    <html>
        <head>
            <script type="module" src="./child-iframe.script.ts"></script>
        </head>
        <body></body>
    </html>
    ```

4. Update your code that sets the new iframe URL to first set it to `blank.html`:

    ```typescript
    // update-iframe.ts
    import {LoadedIframeMessageType, iframeMessenger} from './iframe-message.js';

    export async function loadNewIframeUrl(newUrl: string) {
        iframeRef.src = '/blank.html';

        // Wait for the blank page to finish loading so the browser can garbage collect the last URL.
        await loadedIframeMessenger.sendMessageToChild({
            childOrigin: window.location.origin,
            data: undefined,
            iframeElement: iframeRef,
            type: LoadedIframeMessageType.IframeLoaded,
            verifyChildData(data: any) {
                return data === '/blank.html';
            },
            interval: {
                // This page should load very quickly so we want to check it as often as possible to
                // a minimal load time.
                milliseconds: 5,
            },
        });

        // Now we can finally set the new URL!
        iframeRef.src = newUrl;
    }
    ```
