import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './ui';

export type BlogPost = CollectionEntry<'blog'>;

/** Derive lang from post.id path: "zh/<slug>" → zh, else en. */
export function postLang(post: BlogPost): Lang {
  return post.id.startsWith('zh/') ? 'zh' : 'en';
}

/** Derive the canonical slug (shared across translations). */
export function postSlug(post: BlogPost): string {
  return post.id.startsWith('zh/') ? post.id.slice(3) : post.id;
}

/** Build a post URL for its language. */
export function postUrl(post: BlogPost): string {
  const lang = postLang(post);
  const slug = postSlug(post);
  return lang === 'zh' ? `/zh/posts/${slug}/` : `/posts/${slug}/`;
}

/** Get posts for a given locale, excluding drafts, newest first. */
export async function postsForLang(lang: Lang): Promise<BlogPost[]> {
  const all = await getCollection('blog', ({ data }) => !data.draft);
  return all
    .filter((p) => postLang(p) === lang)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Find the translation counterpart of a post (returns undefined if none). */
export async function findTranslation(
  post: BlogPost,
  targetLang: Lang,
): Promise<BlogPost | undefined> {
  if (postLang(post) === targetLang) return post;
  const slug = postSlug(post);
  const all = await getCollection('blog');
  return all.find((p) => postLang(p) === targetLang && postSlug(p) === slug);
}
