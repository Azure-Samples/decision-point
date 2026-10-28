import type { APIRoute } from 'astro';
import { dotTile } from '../../lib/field';

// The dot field's two tiles, written to dist/ at build time: /field/dots.svg (at rest) and /field/dots-lit.svg (the
// pointer's lens). DotField.astro sets them as CSS backgrounds.
export function getStaticPaths() {
  return [{ params: { tile: 'dots' } }, { params: { tile: 'dots-lit' } }];
}

export const GET: APIRoute = ({ params }) =>
  new Response(dotTile(params.tile === 'dots-lit' ? 4 : 1), { headers: { 'Content-Type': 'image/svg+xml' } });
