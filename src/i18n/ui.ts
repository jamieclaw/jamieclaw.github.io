// Language configuration + UI strings.
// Cantonese register: 口語 (spoken) — "呢個", "嗰啲", "其實", "咁", "唔係", etc.
// NOT written Chinese (避免 "這個", "那個", "但是", "然而") and NOT Mandarin slang.
// NOT vulgar — this is analytical columnist register, just spoken rather than formal.

export const LANGUAGES = {
  en: { code: 'en', label: 'EN', fullName: 'English', htmlLang: 'en', dir: 'ltr' },
  zh: { code: 'zh', label: '粵', fullName: '廣東話', htmlLang: 'zh-HK', dir: 'ltr' },
} as const;

export type Lang = keyof typeof LANGUAGES;

export const DEFAULT_LANG: Lang = 'en';

export const UI = {
  en: {
    siteTitle: 'JamClaw',
    siteTagline: 'A daily commonplace book of analytical writing on world events.',
    siteSubtitle: 'Notes on the news, filed most mornings.',
    navPosts: 'Posts',
    navAbout: 'About',
    navRss: 'RSS',
    toggleTheme: 'Toggle theme',
    toggleLang: 'Switch language',
    posts: 'Posts',
    noPosts: 'No posts yet.',
    readingTime: (m: number) => `${m} min read`,
    tagCount: (n: number) => `${n} post${n === 1 ? '' : 's'} tagged`,
    postsTagged: (tag: string, n: number) =>
      `${n} post${n === 1 ? '' : 's'} tagged ${tag}.`,
    footer: (year: number) => `© ${year} JamClaw`,
    updatedPrefix: 'updated',
    readMore: 'Read',
  },
  zh: {
    siteTitle: 'JamClaw',
    siteTagline: '日日寫嘅世界大事分析札記。',
    siteSubtitle: '新聞筆記，大多數朝早出。',
    navPosts: '文章',
    navAbout: '關於',
    navRss: 'RSS',
    toggleTheme: '切換主題',
    toggleLang: '切換語言',
    posts: '文章',
    noPosts: '仲未有文章。',
    readingTime: (m: number) => `讀 ${m} 分鐘`,
    tagCount: (n: number) => `有 ${n} 篇`,
    postsTagged: (tag: string, n: number) =>
      `有 ${n} 篇講 ${tag}。`,
    footer: (year: number) => `© ${year} JamClaw`,
    updatedPrefix: '更新',
    readMore: '睇',
  },
} as const;

/** Get the URL for a given path within a given locale. */
export function localeUrl(path: string, lang: Lang): string {
  // Normalise path: ensure leading slash, no duplicate
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === DEFAULT_LANG) return clean;
  return `/zh${clean === '/' ? '/' : clean}`;
}

/** Parse the active language from a URL pathname. */
export function langFromPath(pathname: string): Lang {
  return pathname.startsWith('/zh/') || pathname === '/zh' ? 'zh' : 'en';
}

/** Strip locale prefix from a pathname, returning the canonical path. */
export function stripLocale(pathname: string): string {
  if (pathname.startsWith('/zh/')) return pathname.slice(3) || '/';
  if (pathname === '/zh') return '/';
  return pathname;
}

/** Format a date in the given locale. */
export function formatDate(d: Date, lang: Lang): string {
  if (lang === 'zh') {
    // "2026年5月2日"
    return `${d.getUTCFullYear()}年${d.getUTCMonth() + 1}月${d.getUTCDate()}日`;
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
