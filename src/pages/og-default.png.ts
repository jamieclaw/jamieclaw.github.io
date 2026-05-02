// Default site OG image for home/about pages (shown when no per-post image).
import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const FONTS_DIR = path.resolve(process.cwd(), 'src/assets/fonts');
const fraunces = fs.readFileSync(path.join(FONTS_DIR, 'Fraunces-Bold.ttf'));
const inter = fs.readFileSync(path.join(FONTS_DIR, 'Inter-Medium.ttf'));
const notoHK = fs.readFileSync(path.join(FONTS_DIR, 'NotoSerifHK-Bold.ttf'));

type Node = { type: string; props: any };
function h(type: string, props: any = {}, ...children: any[]): Node {
  return { type, props: { ...props, children: children.length <= 1 ? children[0] : children } };
}

export const GET: APIRoute = async () => {
  const BG = '#f7f5f2';
  const FG = '#07080b';
  const FG_DIM = '#4a4f5a';
  const ACCENT = '#5a4bd8';

  const tree = h(
    'div',
    {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: BG,
        fontFamily: 'Inter',
        position: 'relative',
        padding: '80px',
      },
    },
    h('div', {
      style: {
        position: 'absolute', top: 0, left: 0, right: 0, height: '8px',
        background: `linear-gradient(90deg, ${ACCENT} 0%, ${FG} 100%)`, display: 'flex',
      },
    }),
    h(
      'div',
      {
        style: {
          fontFamily: 'Fraunces',
          fontWeight: 700,
          fontSize: '220px',
          color: FG,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          display: 'flex',
        },
      },
      'JamClaw'
    ),
    h(
      'div',
      {
        style: {
          fontSize: '34px',
          color: FG_DIM,
          marginTop: '28px',
          display: 'flex',
          textAlign: 'center',
          maxWidth: '880px',
          lineHeight: 1.4,
        },
      },
      'A daily commonplace book of analytical writing on world events.'
    ),
    h(
      'div',
      {
        style: {
          position: 'absolute',
          bottom: '64px',
          fontSize: '22px',
          color: ACCENT,
          fontWeight: 600,
          display: 'flex',
          gap: '14px',
        },
      },
      h('span', {}, 'EN'),
      h('span', { style: { color: FG_DIM } }, '·'),
      h('span', {}, '廣東話')
    )
  );

  const svg = await satori(tree as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Fraunces', data: fraunces, weight: 700, style: 'normal' },
      { name: 'Inter', data: inter, weight: 500, style: 'normal' },
      { name: 'NotoSerifHK', data: notoHK, weight: 700, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
