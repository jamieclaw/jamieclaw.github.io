import rss from '@astrojs/rss';
import { postsForLang, postUrl } from '../../i18n/posts';
import { UI } from '../../i18n/ui';

export async function GET(context) {
  const posts = await postsForLang('zh');
  const t = UI.zh;
  return rss({
    title: t.siteTitle,
    description: t.siteTagline,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
    })),
  });
}
