// Build-time OG image generator using Satori + Resvg.
//
// Route: /og/<lang>/<slug>.png
// - One image per blog post, per language
// - Rendered from a React-like JSX tree (no React dep — we use plain object trees)
// - Satori → SVG, Resvg → PNG
//
// Font files live in src/assets/fonts/ and are loaded once per build.

import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import { postLang, postSlug } from '../../../i18n/posts';
import { SITE_AUTHOR } from '../../../i18n/ui';

const FONTS_DIR = path.resolve(process.cwd(), 'src/assets/fonts');
const fraunces = fs.readFileSync(path.join(FONTS_DIR, 'Fraunces-Bold.ttf'));
const inter = fs.readFileSync(path.join(FONTS_DIR, 'Inter-Medium.ttf'));
const notoHK = fs.readFileSync(path.join(FONTS_DIR, 'NotoSerifHK-Bold.ttf'));

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: {
      lang: postLang(post),
      slug: postSlug(post),
    },
    props: { post },
  }));
}

// Simple JSX-less tree builder for Satori
type Node = {
  type: string;
  props: Record<string, any> & { children?: any };
};
function h(type: string, props: any = {}, ...children: any[]): Node {
  return { type, props: { ...props, children: children.length <= 1 ? children[0] : children } };
}

export const GET: APIRoute = async ({ props }) => {
  const post = (props as any).post as CollectionEntry<'blog'>;
  const lang = postLang(post);
  const isZh = lang === 'zh';
  const title = post.data.title;
  const description = post.data.description;
  const dateStr = post.data.pubDate.toLocaleDateString(
    isZh ? 'zh-HK' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const titleFont = isZh ? 'NotoSerifHK' : 'Fraunces';
  const bodyFont = isZh ? 'NotoSerifHK' : 'Inter';

  // Color tokens matching site light theme
  const BG = '#f7f5f2';
  const BG_SOFT = '#efece7';
  const FG = '#07080b';
  const FG_DIM = '#4a4f5a';
  const ACCENT = '#5a4bd8';

  const svgTree = h(
    'div',
    {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        background: BG,
        padding: '72px 80px',
        fontFamily: bodyFont,
        position: 'relative',
      },
    },
    // Decorative gradient stripe (top)
    h('div', {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '8px',
        background: `linear-gradient(90deg, ${ACCENT} 0%, ${FG} 100%)`,
        display: 'flex',
      },
    }),
    // Header: site wordmark
    h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          color: FG_DIM,
          fontSize: '24px',
          fontWeight: 500,
          letterSpacing: '0.02em',
        },
      },
      h(
        'span',
        { style: { fontFamily: 'Fraunces', color: FG, fontSize: '28px', fontWeight: 700 } },
        'JamClaw'
      ),
      h('span', { style: { color: FG_DIM } }, '·'),
      h('span', { style: {} }, isZh ? '世界大事分析札記' : 'Notes on the news')
    ),
    // Spacer
    h('div', { style: { flex: 1, display: 'flex' } }),
    // Title block
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '28px' } },
      h(
        'div',
        {
          style: {
            fontFamily: titleFont,
            fontSize: title.length > 60 ? '56px' : title.length > 40 ? '66px' : '76px',
            fontWeight: 700,
            lineHeight: 1.15,
            color: FG,
            letterSpacing: '-0.02em',
            display: 'flex',
          },
        },
        title
      ),
      h(
        'div',
        {
          style: {
            fontSize: '26px',
            lineHeight: 1.5,
            color: FG_DIM,
            display: 'flex',
            // Clamp long descriptions
            maxWidth: '1040px',
          },
        },
        description.length > 160 ? description.slice(0, 157) + '…' : description
      )
    ),
    // Footer bar
    h(
      'div',
      {
        style: {
          marginTop: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `1px solid ${BG_SOFT}`,
          paddingTop: '24px',
          fontSize: '22px',
          color: FG_DIM,
        },
      },
      h(
        'div',
        { style: { display: 'flex', gap: '16px', alignItems: 'center' } },
        h('span', { style: { color: FG, fontWeight: 600 } }, post.data.author ?? SITE_AUTHOR),
        h('span', {}, '·'),
        h('span', {}, dateStr)
      ),
      h(
        'div',
        { style: { display: 'flex' } },
        h('span', { style: { color: ACCENT, fontWeight: 600 } }, isZh ? '廣東話' : 'EN')
      )
    )
  );

  const svg = await satori(svgTree as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Fraunces', data: fraunces, weight: 700, style: 'normal' },
      { name: 'Inter', data: inter, weight: 500, style: 'normal' },
      { name: 'NotoSerifHK', data: notoHK, weight: 700, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  })
    .render()
    .asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
