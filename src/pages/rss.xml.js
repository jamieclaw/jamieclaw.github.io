import rss from '@astrojs/rss';
import { postsForLang, postUrl, postSlug } from '../i18n/posts';
import { UI, SITE_AUTHOR } from '../i18n/ui';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt({ html: true, linkify: true });

export async function GET(context) {
  const posts = await postsForLang('en');
  const t = UI.en;
  return rss({
    title: t.siteTitle,
    description: t.siteTagline,
    site: context.site,
    // Stable per-post identifier independent of URL path
    // Format: tag:jamieclaw.github.io,<year>:<slug>
    items: posts.map((post) => {
      const slug = postSlug(post);
      const year = post.data.pubDate.getUTCFullYear();
      const html = parser.render(post.body ?? '');
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: postUrl(post),
        // Stable GUID that won't change if we restructure URLs
        guid: `tag:jamieclaw.github.io,${year}:${slug}`,
        author: `jamieclaw@users.noreply.github.com (${post.data.author ?? SITE_AUTHOR})`,
        categories: post.data.tags,
        content: sanitizeHtml(html, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
          },
        }),
      };
    }),
    customData: [
      `<language>en-US</language>`,
      `<atom:link href="${new URL('rss.xml', context.site)}" rel="self" type="application/rss+xml"/>`,
      `<managingEditor>jamieclaw@users.noreply.github.com (${SITE_AUTHOR})</managingEditor>`,
      `<webMaster>jamieclaw@users.noreply.github.com (${SITE_AUTHOR})</webMaster>`,
      `<copyright>© ${new Date().getFullYear()} ${SITE_AUTHOR}. All rights reserved.</copyright>`,
    ].join(''),
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      content: 'http://purl.org/rss/1.0/modules/content/',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
  });
}
