/**
 * True isometric drawing: every 2.5D drawing on the page uses this one projection, so the
 * angles always agree. Ground axes run at 30° either side of horizontal, z is straight up, one unit is the same length
 * on all three axes.
 *
 *   screen X = ox + (x − y) · cos30 · s
 *   screen Y = oy + (x + y) · sin30 · s − z · s
 *
 * One light, from the upper left, on every face: the top is the lightest, the +y face (facing lower left) the middle
 * tone, the +x face (facing lower right) the darkest. Components colour the classes `it`, `il` and `ir`.
 * Output is SVG markup strings, rendered at build time (no runtime script).
 */

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;

export type P3 = [number, number, number];

export interface Iso {
  /** A 3D point to screen [X, Y] */
  pt: (x: number, y: number, z?: number) => [number, number];
  /** A box from its back corner (x, y, z), w along x, d along y, h up */
  box: (x: number, y: number, z: number, w: number, d: number, h: number, cls?: string, style?: string) => string;
  /** A flat polygon through 3D points (outlines on a plane, cells on a top face) */
  poly: (pts: P3[], cls?: string) => string;
  /** An open polyline through 3D points (paths, rails, edges) */
  line: (pts: P3[], cls?: string) => string;
  /** Screen bounding box of 3D points, padded */
  bbox: (pts: P3[], pad?: number) => { x: number; y: number; w: number; h: number };
  /** The eight corners of a box (for bounding boxes) */
  corners: (x: number, y: number, z: number, w: number, d: number, h: number) => P3[];
  /** A screen offset for a move of (dx, dy, dz) in iso units */
  delta: (dx: number, dy: number, dz?: number) => [number, number];
  s: number;
}

const f = (n: number) => Math.round(n * 100) / 100;

export function makeIso(ox: number, oy: number, s: number): Iso {
  const pt = (x: number, y: number, z = 0): [number, number] => [ox + (x - y) * COS30 * s, oy + (x + y) * SIN30 * s - z * s];
  const d = (pts: P3[], close: boolean) =>
    pts.map((p, i) => `${i ? 'L' : 'M'}${pt(...p).map(f).join(' ')}`).join('') + (close ? 'Z' : '');
  const poly = (pts: P3[], cls = '') => `<path class="${cls}" d="${d(pts, true)}"/>`;
  const line = (pts: P3[], cls = '') => `<path class="${cls}" d="${d(pts, false)}"/>`;
  const box = (x: number, y: number, z: number, w: number, dd: number, h: number, cls = '', style = '') => {
    const t = z + h;
    const top = poly([[x, y, t], [x + w, y, t], [x + w, y + dd, t], [x, y + dd, t]], 'it');
    const left = poly([[x, y + dd, z], [x + w, y + dd, z], [x + w, y + dd, t], [x, y + dd, t]], 'il');
    const right = poly([[x + w, y, z], [x + w, y + dd, z], [x + w, y + dd, t], [x + w, y, t]], 'ir');
    return `<g class="${cls}"${style ? ` style="${style}"` : ''}>${left}${right}${top}</g>`;
  };
  const corners = (x: number, y: number, z: number, w: number, dd: number, h: number): P3[] =>
    [0, 1].flatMap((i) => [0, 1].flatMap((j) => [0, 1].map((k) => [x + i * w, y + j * dd, z + k * h] as P3)));
  const bbox = (pts: P3[], pad = 2) => {
    const xy = pts.map((p) => pt(...p));
    const xs = xy.map((p) => p[0]), ys = xy.map((p) => p[1]);
    const x = Math.min(...xs) - pad, y = Math.min(...ys) - pad;
    return { x: f(x), y: f(y), w: f(Math.max(...xs) + pad - x), h: f(Math.max(...ys) + pad - y) };
  };
  const delta = (dx: number, dy: number, dz = 0): [number, number] => [(dx - dy) * COS30 * s, (dx + dy) * SIN30 * s - dz * s];
  return { pt, box, poly, line, bbox, corners, delta, s };
}

/**
 * Fit a scene into a W×H stage: returns an Iso whose scale and origin centre the given points with a margin.
 */
export function fitIso(points: P3[], stage: { w: number; h: number }, margin = 14, maxScale = 40): Iso {
  const unit = makeIso(0, 0, 1);
  const xy = points.map((p) => unit.pt(...p));
  const xs = xy.map((p) => p[0]), ys = xy.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const s = Math.min((stage.w - 2 * margin) / (x1 - x0), (stage.h - 2 * margin) / (y1 - y0), maxScale);
  return makeIso(stage.w / 2 - (s * (x0 + x1)) / 2, stage.h / 2 - (s * (y0 + y1)) / 2, s);
}

/**
 * A moving piece for an illustration window: its own small SVG in a wrapper positioned in % of the W×H stage, so the
 * browser moves it as a composited layer (transform only).
 * - `body` is the piece's 3D extent at rest (its corners); `route` lists [percent, dx, dy, dz] waypoints in iso units.
 * - The wrapper covers the whole route; the waypoints become a keyframes block with translate values in % of that box
 *   (exact at any size, no custom properties in the keyframes).
 * - `notches` are footprints [x, y, w, d, z] the piece sinks into or rises out of: the wrapper's static clip-path hides
 *   everything below each footprint's front edges, so a piece passes through a top face like a real solid.
 */
export interface Piece {
  html: string;
  css: string;
}

export function piece(
  iso: Iso,
  stage: { w: number; h: number },
  name: string,
  markup: string,
  body: P3[],
  route: [number, number, number, number][],
  opts: { notches?: [number, number, number, number, number][]; style?: string; still?: number } = {},
): Piece {
  const extent = route.length ? route.flatMap(([, dx, dy, dz]) => body.map(([x, y, z]) => [x + dx, y + dy, z + dz] as P3)) : body;
  const b = iso.bbox(extent, 2);
  const pos = `left:${f((b.x / stage.w) * 100)}%;top:${f((b.y / stage.h) * 100)}%;width:${f((b.w / stage.w) * 100)}%;height:${f((b.h / stage.h) * 100)}%`;
  const svg = `<svg class="mv ${name}" viewBox="${b.x} ${b.y} ${b.w} ${b.h}" aria-hidden="true" focusable="false">${markup}</svg>`;
  const clip = opts.notches?.length ? notchClip(iso, b, opts.notches) : '';
  const wrapStyle = `${pos}${clip ? `;clip-path:${clip}` : ''}${opts.style ? `;${opts.style}` : ''}`;
  const html = `<span class="pc" style="${wrapStyle}">${svg}</span>`;
  const tr = (dx: number, dy: number, dz: number) => {
    const [X, Y] = iso.delta(dx, dy, dz);
    return `translate(${f((X / b.w) * 100)}%,${f((Y / b.h) * 100)}%)`;
  };
  const frames = route.map(([p, dx, dy, dz]) => `${p}%{transform:${tr(dx, dy, dz)}}`).join('');
  // The still: where the piece rests with no animation (reduced motion, or before the loop starts), interpolated
  // linearly between the waypoints around `still` percent
  let css = route.length ? `@keyframes ${name}{${frames}}` : '';
  if (route.length) {
    const at = opts.still ?? 0;
    const k = Math.max(0, route.findIndex(([p]) => p >= at));
    const [p1, ...v1] = route[k], [p0, ...v0] = route[Math.max(0, k - 1)];
    const u = p1 === p0 ? 1 : (at - p0) / (p1 - p0);
    const v = v0.map((a, i) => a + (v1[i] - a) * u) as [number, number, number];
    css += `.mv.${name}{transform:${tr(...v)}}`;
  }
  return { html, css };
}

/**
 * A clip-path polygon (in % of box b) that keeps the whole box except a pocket under each footprint: the region below
 * the footprint's two front edges at height z, down to the box's foot. Footprints must not overlap on screen.
 */
function notchClip(iso: Iso, b: { x: number; y: number; w: number; h: number }, notches: [number, number, number, number, number][]) {
  const px = (X: number) => f(((X - b.x) / b.w) * 100);
  const py = (Y: number) => f(((Y - b.y) / b.h) * 100);
  // Each pocket: left corner (x, y+d), front corner (x+w, y+d), right corner (x+w, y), at height z
  const pockets = notches
    // Widened by a stroke's width at the sides, so a sunk piece's outer edges never peek out under the footprint
    .map(([x, y, w, d, z]) => {
      const L = iso.pt(x, y + d, z), F = iso.pt(x + w, y + d, z), R = iso.pt(x + w, y, z);
      return { L: [L[0] - 1.5, L[1]] as [number, number], F, R: [R[0] + 1.5, R[1]] as [number, number] };
    })
    .sort((a, c) => c.L[0] - a.L[0]); // walk the foot from right to left
  const pts: string[] = ['0% 0%', '100% 0%', '100% 100%'];
  for (const { L, F, R } of pockets) {
    pts.push(`${px(R[0])}% 100%`, `${px(R[0])}% ${py(R[1])}%`, `${px(F[0])}% ${py(F[1])}%`, `${px(L[0])}% ${py(L[1])}%`, `${px(L[0])}% 100%`);
  }
  pts.push('0% 100%');
  return `polygon(${pts.join(',')})`;
}
