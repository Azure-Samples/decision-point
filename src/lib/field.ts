/**
 * The Game edition's dot field, drawn at build time from fixed seeds so every build is identical.
 *   - dotTile: one 360px square of dots on a 15px grid, each at its own faint opacity, with brighter runs and the odd
 *     cyan or violet node. Served as /field/dots.svg and, every dot brighter by the same factor, /field/dots-lit.svg
 *     (src/pages/field/[tile].svg.ts), so the pointer's lit copy lines up with the resting one dot for dot.
 *   - twinkles: a few dots on the same grid that slowly brighten and fade, kept to the outer columns, clear of the copy.
 */

export const FIELD_STEP = 15; // px between dots
export const FIELD_TILE = FIELD_STEP * 24; // the tile's side, in px
const SEED = 20261023;

const random = (seed: number) => {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};

/** The tile as an SVG document; gain lifts every dot's opacity by the same factor (the lit copy uses 4) */
export function dotTile(gain = 1): string {
  const rnd = random(SEED);
  const n = FIELD_TILE / FIELD_STEP;
  let out = '';
  for (let y = 0; y < n; y++) {
    let run = 0;
    for (let x = 0; x < n; x++) {
      let a = 0.03 + rnd() * 0.05, fill = '170,200,235', r = 1;
      if (run === 0 && rnd() < 0.03) run = 3 + Math.floor(rnd() * 5);
      if (run > 0) {
        a = 0.2 + rnd() * 0.22;
        r = 1.3;
        run--;
      } else if (rnd() < 0.05) a = 0.16 + rnd() * 0.16;
      else if (rnd() < 0.5) continue; // half the resting dots drop out
      const c = rnd();
      if (c < 0.01) {
        fill = '80,230,255';
        a = 0.75;
        r = 1.6;
      } else if (c < 0.014) {
        fill = '150,130,255';
        a = 0.7;
        r = 1.8;
      }
      const cx = x * FIELD_STEP + FIELD_STEP / 2, cy = y * FIELD_STEP + FIELD_STEP / 2;
      out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgb(${fill})" fill-opacity="${Math.min(1, a * gain).toFixed(2)}"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${FIELD_TILE}" height="${FIELD_TILE}">${out}</svg>`;
}

/** Twinkle positions and timings (left/top in px from the host's top left, duration and offset in s) */
export function twinkles(seed: number, count: number) {
  const rnd = random(seed);
  return Array.from({ length: count }, () => {
    const x = Math.floor(rnd() * 70), y = Math.floor(rnd() * 34);
    const col = rnd() < 0.5 ? x % 18 : 52 + (x % 18);
    return {
      left: col * FIELD_STEP + FIELD_STEP / 2,
      top: y * FIELD_STEP + FIELD_STEP / 2,
      dur: (4 + rnd() * 5).toFixed(1),
      offset: (-rnd() * 8).toFixed(1),
    };
  });
}
