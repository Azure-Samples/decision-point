export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Microsoft Clarity project ID. Set PUBLIC_CLARITY_ID at build time to turn analytics on: the consent banner, the
 * Clarity tag and the CTA events all depend on it. Unset (the default), none of them is rendered. The pattern keeps
 * anything but a plain ID out of the script URL.
 */
const clarityId = String(import.meta.env.PUBLIC_CLARITY_ID ?? '').trim();
export const CLARITY_ID = /^[a-z0-9]{6,16}$/i.test(clarityId) ? clarityId : '';

/** The consent banner and its footer control render only when analytics is on. */
export const ANALYTICS_UI = CLARITY_ID !== '';

/** Prefix an internal path with the configured base, so it works when the site is served from a sub-path. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/** Escape the text and set one phrase in the accent (words unchanged). */
export function emphasise(text: string, phrase: string): string {
  return escapeHtml(text).replace(escapeHtml(phrase), `<span class="key">${escapeHtml(phrase)}</span>`);
}

/**
 * A two-part title's halves: the setup before the copy's `[[…]]` marker and the payoff inside it. The page sets
 * the setup in white and the payoff in the titles' blue. Titles without a marker come back as ['', text].
 */
export function titleParts(text: string): [string, string] {
  const m = text.match(/^(.*?)\s*\[\[([^\]]+)\]\]\s*$/);
  return m ? [m[1], m[2]] : ['', text];
}
