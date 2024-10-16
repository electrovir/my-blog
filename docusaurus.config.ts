import searchLocal from '@cmfcmf/docusaurus-search-local';
import {BlogPost} from '@docusaurus/plugin-content-blog';
import type * as Preset from '@docusaurus/preset-classic';
import type {Config} from '@docusaurus/types';

const config: Config = {
    title: ' ',
    tagline: "electrovir's technical blog",
    favicon: 'img/favicon.ico',
    url: 'https://electrovir.com',
    baseUrl: '/',
    titleDelimiter: ' ',
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    /**
     * Even if you don't use internationalization, you can use this field to set useful metadata
     * like html lang. For example, if your site is Chinese, you may want to replace "en" with
     * "zh-Hans".
     */
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },
    plugins: [
        [
            searchLocal,
            {
                indexDocs: false,
                indexPages: false,
            },
        ],
    ],
    presets: [
        [
            'classic',
            {
                docs: false,
                blog: {
                    blogDescription: "electrovir's technical blog",
                    archiveBasePath: 'all',
                    blogSidebarCount: 0,
                    blogSidebarTitle: ' ',
                    sortPosts: 'descending',
                    routeBasePath: '/',
                    showLastUpdateTime: false,
                    showReadingTime: false,
                    blogTitle: 'electrovir',
                    async processBlogPosts({blogPosts}) {
                        return blogPosts
                            .map((blogPost): BlogPost => {
                                const fixedLink = blogPost.metadata.permalink
                                    .replace(/\//g, '-')
                                    .replace(/^\-/, '/');

                                return {
                                    ...blogPost,
                                    metadata: {
                                        ...blogPost.metadata,
                                        permalink: fixedLink,
                                    },
                                };
                            })
                            .sort((a, b) =>
                                b.metadata.permalink.localeCompare(a.metadata.permalink),
                            );
                    },
                },
                theme: {
                    customCss: './static/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],
    headTags: [
        /** Favicon tags generated by https://realfavicongenerator.net */
        {
            tagName: 'link',
            attributes: {
                rel: 'apple-touch-icon',
                sizes: '180x180',
                href: '/apple-touch-icon.png',
            },
        },
        {
            tagName: 'link',
            attributes: {
                rel: 'icon',
                type: 'image/png',
                sizes: '32x32',
                href: '/favicon-32x32.png',
            },
        },
        {
            tagName: 'link',
            attributes: {
                rel: 'icon',
                type: 'image/png',
                sizes: '16x16',
                href: '/favicon-16x16.png',
            },
        },
        {
            tagName: 'link',
            attributes: {
                rel: 'manifest',
                href: '/site.webmanifest',
            },
        },
        {
            tagName: 'link',
            attributes: {
                rel: 'mask-icon',
                href: '/safari-pinned-tab.svg',
                color: '#33ccff',
            },
        },
        {
            tagName: 'meta',
            attributes: {
                name: 'msapplication-TileColor',
                content: '#2d89ef',
            },
        },
    ],
    themeConfig: {
        navbar: {
            title: 'electrovir',
            logo: {
                src: 'bolt.png',
                alt: 'logo',
            },
            hideOnScroll: false,
            items: [
                {to: '/tags', label: 'tags', position: 'left'},
                {to: '/all', label: 'history', position: 'left'},
                {
                    href: 'https://github.com/electrovir/my-blog',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        metadata: [
            {name: 'title', content: 'My Custom Title'},
        ],
        /** The footer is hidden with custom CSS. */
        footer: {},
        colorMode: {
            respectPrefersColorScheme: true,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
