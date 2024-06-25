---
title: How I Created This Blog
tags: [web, dev, guide, Docusaurus]
---

This blog is built using [Docusaurus](https://docusaurus.io) in [blog-only mode](https://docusaurus.io/docs/blog#blog-only-mode). Here's how I did it:

<!-- truncate -->

1. First I followed the default Docusaurus initialization guide: https://docusaurus.io/docs/installation

    1. `npm i -D docusaurus`

        Docusaurus does not mention actually installing dependencies, so it expects you to globally install it. I don't like globally installing packages, so I started with installing Docusaurus to my repo. I also added my own `.gitignore` file.

    2. `npm init docusaurus`

        I chose the common theme and the TypeScript language.

        You can see the changes from this step in commit [808a9aa](https://github.com/electrovir/my-blog/commit/808a9aa9e995dec46cea0622d702d9c798f7cf80).

2. Then I added spellchecking, formatting, and some standard config files through my automation package [virmator](https://npmsjs.com/package/virmator).

    This happened in commit [8b585bc](https://github.com/electrovir/my-blog/commit/8b585bceca5b71a7ba8e490c0b62fdeaa9c3f7e1).

3. Then I customized it to my liking.

    1. To setup blog-only mode, I deleted the `src` and `docs` directories and set `docs` to `false` in [`docusaurus.config.ts`](https://github.com/electrovir/my-blog/blob/b85d12f32225617a90fd4a54425828bbf9cb48fa/docusaurus.config.ts).
    2. I added custom fonts, favicons, and app icons.
    3. I wrote a bunch of custom files in [`static/custom.css`](https://github.com/electrovir/my-blog/blob/b85d12f32225617a90fd4a54425828bbf9cb48fa/static/custom.css), mostly to remove parts of the Docusaurus that I didn't want.

    You can see the changes from this step in commit [b85d12f](https://github.com/electrovir/my-blog/commit/b85d12f32225617a90fd4a54425828bbf9cb48fa).

4. Lastly I pushed everything to GitHub and hooked it up to Netlify on this domain.

Ultimately I'm slightly disappointed in how hard it was to shoehorn my desired results into Docusaurus, but it's serving my purposes for now. I like building sites for the heck of it, so maybe someday I'll build my own version of a blog generator. (It would all be client-side too, no build process!)
