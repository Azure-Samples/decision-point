/**
 * Tabler outline icons, inlined at build time (no icon font, no runtime JS).
 * Add a name to the glob and to IconName to make it available to <Icon name="…" />.
 */
const files = import.meta.glob<string>(
  '/node_modules/@tabler/icons/icons/outline/{player-play,player-pause,chevron-left,chevron-right,arrow-up-right,check,refresh,brand-linkedin,brand-x,brand-github,server,clock,sparkles,terminal-2,book,tools,users,link,volume,volume-3,trophy}.svg',
  { query: '?raw', import: 'default', eager: true },
);

export type IconName =
  | 'player-play'
  | 'player-pause'
  | 'chevron-left'
  | 'chevron-right'
  | 'arrow-up-right'
  | 'check'
  | 'refresh'
  | 'brand-linkedin'
  | 'brand-x'
  | 'brand-github'
  | 'server'
  | 'clock'
  | 'sparkles'
  | 'terminal-2'
  | 'book'
  | 'tools'
  | 'users'
  | 'link'
  | 'volume'
  | 'volume-3'
  | 'trophy';

const byName = new Map(
  Object.entries(files).map(([path, svg]) => [path.split('/').pop()!.replace('.svg', ''), svg]),
);

/** Inner SVG markup (paths only) for an icon; the <svg> wrapper is rendered by Icon.astro. */
export function iconBody(name: IconName): string {
  const svg = byName.get(name);
  if (!svg) throw new Error(`Unknown icon: ${name}`);
  return svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
}
