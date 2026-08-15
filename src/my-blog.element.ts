import {VirBlog} from 'blog-vir/dist/ui/elements/vir-blog.element.js';
import {css, defineElement, html} from 'element-vir';
import {createSizedIcon, lucideIcons, ViraIcon, ViraLink} from 'vira';

export const MyBlog = defineElement()({
    tagName: 'my-blog',
    styles: css`
        :host {
            display: block;
            font-family: 'Lexend', sans-serif;
            min-height: 100vh;
        }

        .brand {
            align-items: center;
            display: flex;
            font-size: 16px;
            gap: 8px;

            & img {
                filter: drop-shadow(0 1px 0 rgba(51, 204, 255, 0.8))
                    drop-shadow(0 -1px 0 rgba(51, 204, 255, 0.8))
                    drop-shadow(1px 0 0 rgba(51, 204, 255, 0.8))
                    drop-shadow(-1px 0 0 rgba(51, 204, 255, 0.8));
                height: 32px;
                width: 32px;
            }
        }

        .github-link {
            display: flex;
            gap: 2px;
        }
    `,
    render() {
        return html`
            <${VirBlog}>
                <div class="brand" slot=${VirBlog.slotNames['vir-blog-brand']}>
                    <img alt="electrovir logo" src="/bolt.png" />
                    electrovir
                </div>
                <${ViraLink.assign({
                    link: {
                        newTab: true,
                        url: 'https://github.com/electrovir/my-blog',
                    },
                })}
                    slot=${VirBlog.slotNames['vir-blog-right']}
                >
                <div class="github-link">
                    <!-- prettier-ignore -->
                    GitHub<${ViraIcon.assign({
                        icon: createSizedIcon(lucideIcons.ExternalLink, 16),
                    })}></${ViraIcon}>
                    </div>
                </${ViraLink}>
            </${VirBlog}>
        `;
    },
});
