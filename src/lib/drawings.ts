/**
 * The page's isometric drawings, all from the one projection in iso.ts.
 * Decorative only: every component renders them aria-hidden. No data, no labels other than the p95 tag.
 *
 * Faces are classed `it` (top), `il` (left, the +y face) and `ir` (right, the +x face); the group class picks the
 * ink (see the illustration CSS in HowItWorks.astro and the inks in tokens.css).
 */
import { fitIso, makeIso, piece, type Iso, type P3, type Piece } from './iso';

export const STAGE = { w: 320, h: 200 };
type Box = [number, number, number, number, number, number];
const corners = (b: Box): P3[] => makeIso(0, 0, 1).corners(...b);
const pts = (...bs: Box[]) => bs.flatMap(corners);

export interface Scene {
  back: string;
  front: string;
  pieces: Piece[];
}

/* ---------- 1. Executive demo misses a mixed query: keyword rows and vectors fuse into one ranked answer ----------
   Packets rise out of the keyword table and out of the vector pool, travel the indexed path and sink into the fusion
   slab (BM25 + DiskANN → RRF). Two packets per route, half a loop apart. */
export function sceneHybrid(): Scene {
  const P = 0.7; // packet size
  const stack: Box[] = [0, 0.9, 1.8].map((z) => [0, 7, z, 4.5, 3, 0.6]);
  const pool: Box = [8, 0, 0, 4, 4, 0.3];
  const fusion: Box = [7.4, 7, 0, 3.6, 3.6, 0.5];
  const vecs: P3[] = [[8.4, 0.5, 2.6], [10.2, 0.3, 3.4], [11.2, 1.6, 2.5], [9.1, 1.7, 3.7], [10.7, 2.9, 3.0], [8.5, 3.1, 2.4], [11.3, 0.1, 4.1]];
  // The fused, reranked answer leaves the fusion slab as a short ranked list (longest = first), the top row lit
  const ranked: Box[] = [[12.2, 6.9, 0, 3.0, 0.8, 0.3], [12.2, 7.95, 0, 2.2, 0.8, 0.3], [12.2, 9.0, 0, 1.5, 0.8, 0.3]];
  const iso = fitIso([...pts(...stack, pool, fusion, ...ranked), ...vecs.flatMap((v) => corners([...v, 0.7, 0.7, 0.7] as Box)), [2.6, 8.35, 3.8], [8.6, 8.35, 3.8]], STAGE, 14);

  let back = '';
  // The indexed paths: drawn under the packets, at the packets' running height
  const a0: P3 = [2.6, 8.35, 2.4], a1: P3 = [2.6, 8.35, 3.6], a2: P3 = [8.6, 8.35, 3.6], a3: P3 = [8.6, 8.35, 0.5];
  const b0: P3 = [9.7, 3, 0.3], b1: P3 = [9.7, 3, 1.4], b2: P3 = [9.7, 9, 1.4], b3: P3 = [9.7, 9, 0.5];
  back += iso.box(...pool, 'slab');
  for (const v of vecs) back += iso.box(...v, 0.7, 0.7, 0.7, 'vec');
  back += iso.line([b0, b1, b2, b3], 'wire');
  for (const [i, s] of stack.entries()) {
    back += iso.box(...s, 'slab');
    // Row cells on each slab's front-left face
    for (const [u0, u1] of [[0.4, 1.4], [1.7, 3.0], [3.3, 4.1]]) back += iso.poly([[u0, 10, s[2] + 0.2], [u1, 10, s[2] + 0.2], [u1, 10, s[2] + 0.4], [u0, 10, s[2] + 0.4]], i === 2 ? 'cell hot-cell' : 'cell');
  }
  back += iso.line([[11, 8.8, 0.25], [12.2, 8.8, 0.15]], 'wire');
  for (const [i, r] of ranked.entries()) back += iso.box(...r, i === 0 ? 'hot' : 'slab');
  back += iso.box(...fusion, 'hot');
  back += iso.line([a0, a1, a2, a3], 'wire');
  for (const n of [a1, a2, b1, b2]) {
    const [x, y] = iso.pt(...n);
    back += `<circle class="joint" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6"/>`;
  }

  const packet = (cx: number, cy: number, z: number) => iso.box(cx - P / 2, cy - P / 2, z, P, P, P, 'pk');
  const body = (cx: number, cy: number, z: number) => corners([cx - P / 2, cy - P / 2, z, P, P, P]);
  const pieces: Piece[] = [];
  const routeA: [number, number, number, number][] = [[0, 0, 0, 0], [14, 0, 0, 1.9], [64, 6, 0, 1.9], [80, 6, 0, -2.0], [100, 6, 0, -2.0]];
  const routeB: [number, number, number, number][] = [[0, 0, 0, 0], [14, 0, 0, 2.0], [64, 0, 6, 2.0], [80, 0, 6, 0.3], [100, 0, 6, 0.3]];
  pieces.push(piece(iso, STAGE, 'ill-a', packet(2.6, 8.35, 1.7), body(2.6, 8.35, 1.7), routeA, { notches: [[2.25, 8, P, P, 2.4], [8.25, 8, P, P, 0.5]], still: 40 }));
  pieces.push(piece(iso, STAGE, 'ill-b', packet(9.7, 3, -0.6), body(9.7, 3, -0.6), routeB, { notches: [[9.35, 2.65, P, P, 0.3], [9.35, 8.65, P, P, 0.5]], still: 52 }));
  // The second packet on each route reuses the keyframes, half a loop later
  pieces.push({ html: pieces[0].html.replace('mv ill-a', 'mv ill-a late'), css: '' });
  pieces.push({ html: pieces[1].html.replace('mv ill-b', 'mv ill-b late'), css: '' });
  return { back, front: '', pieces };
}

/* ---------- 2. Agent recommends a ghost product ----------
   The bug: a product was deleted from the catalog, but its stale embedding is still in the vector index, so the agent
   (the lit cube) reaches straight for a ghost (the hollow cube in the index). The fix the card teaches: an on_change
   trigger on the catalog feeds a durable pipeline. Motion: a change event rises out of the deleted product's empty slot,
   runs the pipeline into the index and lands on the ghost, which drops out of the index; then the loop resets. */
export function sceneGhost(): Scene {
  const P = 0.7; // the change event
  const C = 1.3; // a product
  const V = 0.8; // a vector
  const catalog: Box = [0, 5, 0, 7.6, 3, 0.6];
  const index: Box = [9, -1, 0, 5, 5, 0.3];
  const agent: Box = [10.85, 6.2, 0, C, C, C];
  const ghostAt: [number, number] = [11.1, 2.6];
  const vecs: [number, number][] = [];
  for (const y of [-0.4, 1.1, 2.6]) for (const x of [9.6, 11.1, 12.6]) if (x !== ghostAt[0] || y !== ghostAt[1]) vecs.push([x, y]);
  const slot: [number, number] = [5.8, 5.85]; // the deleted product's empty footprint
  const run = 2.2; // the pipeline's height
  const sx = slot[0] + C / 2, sy = slot[1] + C / 2; // the event's start (the slot's centre)
  const gx = ghostAt[0] + V / 2, gy = ghostAt[1] + V / 2; // its end (the ghost's centre)
  const iso = fitIso(
    [...pts(catalog, index, agent, [sx - P / 2, gy - P / 2, run, P, P, P]), ...vecs.flatMap(([x, y]) => corners([x, y, 0.3, V, V, V]))],
    STAGE,
    16,
  );

  let back = '';
  // The vector index: a pool of embeddings; the ghost among them is a moving piece
  back += iso.box(...index, 'slab');
  for (const [x, y] of vecs) back += iso.box(x, y, 0.3, V, V, V, 'vec');
  // The pipeline: up out of the catalog, back along y, across to the index and down onto the ghost
  back += iso.line([[sx, sy, 0.6], [sx, sy, run], [sx, gy, run], [gx, gy, run], [gx, gy, 1.1]], 'wire');
  for (const n of [[sx, sy, run], [sx, gy, run], [gx, gy, run]] as P3[]) {
    const [x, y] = iso.pt(...n);
    back += `<circle class="joint" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6"/>`;
  }
  // The catalog: products on a table, and the empty footprint where the deleted one stood
  back += iso.box(...catalog, 'slab');
  back += iso.poly([[slot[0], slot[1], 0.6], [slot[0] + C, slot[1], 0.6], [slot[0] + C, slot[1] + C, 0.6], [slot[0], slot[1] + C, 0.6]], 'gap');
  for (const x of [0.4, 2.2, 4.0]) back += iso.box(x, slot[1], 0.6, C, C, C, 'prod');

  // The agent, in front of the index, reaching for the ghost
  let front = iso.line([[gx, 6.2, 0], [gx, 4, 0], [gx, 4, 0.3], [gx, ghostAt[1] + V, 0.3]], 'wire hi');
  const [ex, ey] = iso.pt(gx, ghostAt[1] + V, 0.3);
  front += `<circle class="joint hi" cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="3"/>`;
  front += iso.box(...agent, 'hot');

  const pieces: Piece[] = [];
  // The change event: rises out of the empty slot, runs the pipeline, sinks into the index on the ghost
  const dx = gx - sx, dy = gy - sy;
  const route: [number, number, number, number][] = [
    [0, 0, 0, 0],
    [14, 0, 0, run + 0.7],
    [34, 0, dy, run + 0.7],
    [56, dx, dy, run + 0.7],
    [70, dx, dy, -0.4],
    [100, dx, dy, -0.4],
  ];
  pieces.push(
    piece(iso, STAGE, 'ill-e', iso.box(sx - P / 2, sy - P / 2, -0.7, P, P, P, 'pk'), corners([sx - P / 2, sy - P / 2, -0.7, P, P, P]), route, {
      notches: [[slot[0], slot[1], C, C, 0.6], [gx - P / 2, gy - P / 2, P, P, 0.3]],
      still: 40,
    }),
  );
  // The ghost: drops out of the index just after the event lands, and is back for the next loop
  const ghost: Box = [ghostAt[0], ghostAt[1], 0.3, V, V, V];
  const gRoute: [number, number, number, number][] = [[0, 0, 0, 0], [70, 0, 0, 0], [80, 0, 0, -1.1], [92, 0, 0, -1.1], [100, 0, 0, 0]];
  pieces.push(piece(iso, STAGE, 'ill-gh', iso.box(...ghost, 'ghost'), corners(ghost), gRoute, { notches: [[ghostAt[0], ghostAt[1], V, V, 0.3]], still: 0 }));
  return { back, front, pieces };
}

/* ---------- 3. Traffic surge breaks p95: the bars surge through the p95 plane in a wave, then settle under it ---------- */
const P95_LABEL = 'p95';
export function sceneSurge(): Scene {
  const base: Box = [0, 0, 0, 14.2, 3.6, 0.3];
  const H = 6.4, Z95 = 4.4, W = 1.1, D = 1.6, Y = 1.0;
  const rest = [1.4, 1.8, 2.2, 2.0, 2.6, 2.8, 2.4, 3.0];
  const peak = [2.6, 3.2, 4.4, 5.0, 5.8, 6.2, 5.4, 6.0];
  const xs = rest.map((_, i) => 0.6 + i * 1.65);
  const plane: P3[] = [[-0.4, 0.4, Z95], [14.6, 0.4, Z95], [14.6, 3.2, Z95], [-0.4, 3.2, Z95]];
  const iso = fitIso([...pts(base), ...xs.flatMap((x) => corners([x, Y, 0.3, W, D, 6.2])), ...plane], STAGE, 11);

  let back = iso.box(...base, 'slab');
  back += iso.line([plane[3], plane[0], plane[1], plane[2]], 'limit');
  const [tx, ty] = iso.pt(-0.4, 3.2, Z95);
  back += `<text class="tag" x="${(tx - 6).toFixed(1)}" y="${(ty + 4).toFixed(1)}" text-anchor="end">${P95_LABEL}</text>`;
  const front = iso.line([plane[2], plane[3]], 'limit');

  const pieces = xs.map((x, i) => {
    const down = (h: number) => h - H;
    const route: [number, number, number, number][] = [[0, 0, 0, down(rest[i])], [30, 0, 0, down(peak[i])], [58, 0, 0, down(rest[i])], [100, 0, 0, down(rest[i])]];
    const p = piece(iso, STAGE, `ill-s${i}`, iso.box(x, Y, 0.3, W, D, H, 'bar'), corners([x, Y, 0.3, W, D, H]), route, {
      notches: [[x, Y, W, D, 0.3]],
      style: `--i:${i}`,
    });
    return p;
  });
  return { back, front, pieces };
}

/* ---------- Static pieces ---------- */

/** A faint fragment: stepped slab outlines and an indexed path ending in a node. */
export function fragment(): { svg: string; viewBox: string; w: number } {
  const iso: Iso = makeIso(150, 40, 14);
  let s = '';
  const node = (p: P3, r = 2.4) => {
    const [x, y] = iso.pt(...p);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"/>`;
  };
  s += iso.box(0, 0, 0, 6, 6, 0.6) + iso.box(0.8, 0.8, 1.2, 4.4, 4.4, 0.6) + iso.box(1.6, 1.6, 2.4, 2.8, 2.8, 0.6);
  s += iso.line([[6, 3, 0], [9, 3, 0]]) + node([9, 3, 0], 3.2);
  // Crop the stage to the drawing, so a host can size and anchor the drawing itself (its edge, its fade)
  const nums = [...s.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)|cx="(-?[\d.]+)" cy="(-?[\d.]+)"/g)].map((m) => [Number(m[1] ?? m[3]), Number(m[2] ?? m[4])]);
  const xs = nums.map((n) => n[0]), ys = nums.map((n) => n[1]);
  const pad = 4;
  const x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad;
  const w = Math.max(...xs) + pad - x0, h = Math.max(...ys) + pad - y0;
  return { svg: s, viewBox: `${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`, w };
}
