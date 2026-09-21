import {assert} from '@augment-vir/assert';
import {describe, it, testWeb} from '@augment-vir/test';
import {MyBlog} from './my-blog.element.js';

describe(MyBlog.tagName, () => {
    it('renders', async () => {
        assert.instanceOf(await testWeb.renderElement(MyBlog), MyBlog);
    });
});
