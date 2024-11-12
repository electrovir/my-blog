---
title: Some Frontend Basics
tags: [dev, web, auth, JavaScript]
---

-   Authentication through the authorization header, cookies, and JWTs.
-   CORS
-   Vite basics.

<!-- truncate -->

## Authentication

Frontend authentication can be done in many ways, here I'll talk about cookies, the authentication header, and JWTs.

### Cookies

Cookies are, put very simply, little chunks of data that are included in every request to a specific domain. For the authentication use case, a cookie typically includes a session id so that a user can visit different web pages without having to login on each page. Here's how they work:

1. a user logs in on the frontend
2. the backend verifies the login information (username + password combo)
3. if the login is valid, the backend sets some data in a "cookie" and then sends this cookie to the browser in the login response
4. the browser receives the response and saves the cookie
5. the browser (by default) includes that saved cookie with all requests sent to the domain it was configured for
6. the backend receives that cookie in all requests and uses it to verify that the request came from an already-logged-in user

Cookies used in requests and responses can be inspected on a per-request basis in the network tab of your browser's dev tools. You can see details for Chrome's dev tools here: https://developer.chrome.com/docs/devtools/network#details, though they are generally applicable to all browsers. You'll see cookies set by the backend in `Set-Cookie` headers under the Response object and cookies included in requests in the `Cookie` header under the Request object.

You can dive into more details about cookies here: https://developer.mozilla.org/docs/Web/HTTP/Cookies

Also note that cookies get a bad rep because of how they've been used for tracking users across multiple sites. Cookies are not inherently bad, and when used simply for authentication there's nothing invasive about them. To read more about how cookies are abused, see https://developer.mozilla.org/docs/Web/Privacy/Third-party_cookies

### Authorization Header

In reality, request headers are arbitrary, you can set any headers you want even if nobody else has ever heard of them. As long as your backend knows the headers names that it needs to read, you can name them anything you want. The "Authorization" header is simply a standardized header that can be used to attach authorization / authentication information to a request. Besides the fact that this header name is standardized, it's just a normal header.

You can read more about this header here: https://developer.mozilla.org/docs/Web/HTTP/Headers/Authorization

### JWTs

JWT stands for JSON Web Token. JWTs are simply chunks of JSON that have been encrypted to a string in a standard way. They receive no special treatment from browsers, requests, or responses, but they can be used to embed verifiable information (sometimes auth information such as a session header) into a request or response.

## CORS

CORS stands for Cross-Origin Resource Sharing. It is a standard way for backends to restrict the browser URLs that can access them. Basically what happens is a backend sets various CORS related headers in a response and then browsers restrict or fail requests sent to that backend based on those CORS headers. This is used by browsers to help prevent a variety of attacks, such as a fraudulent website designed to look like a legitimate website that sends requests to the legitimate backend.

Typically CORS causes annoyances in dev because you have remember to set them up in your backend or browsers will freak out and drop requests.

Note that while CORS makes a huge difference because of major-browser market share, someone could simply send command line requests (which typically don't do anything with CORS) or use a different browser that lacks a CORS implementation. CORS is for users to protect themselves more than for your backend to protect itself. Don't rely on CORS to keep your backend safe since it is easy to circumvent.

You can read more about CORS here: https://developer.mozilla.org/docs/Web/HTTP/CORS

## Vite

Vite is simply a dev server and build tool that, imo, is the best in its field. It supports TypeScript out of the box, is very popular, and has lots of plugin support. Vite is meant for static frontends, meaning frontends that aren't generated on-the-fly by a backend (they're just a collection of HTML, CSS, JS maybe some images, etc. that are served directly to the users' browser).

Typically you only need to know about two Vite flows:

1. Starting the dev server: `npx vite` (that's it)
    - this starts up the dev web server, serves up your `index.html` file, and automatically transpiles all TypeScript into JavaScript so your browser can actually run it.
2. Building your frontend for production deployment: `npx vite build`
    - this uses Rollup under the hood to compile your TypeScript into JavaScript and bundle it together for a production deployment

There are other advanced things you can do with Vite but those two above commands are usually all I need to use.
