const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** True once a link is real; `{{placeholder}}` hrefs are still waiting on the client. */
export const isResolved = (href: string) => /^https?:\/\//.test(href);

/**
 * Preview override; restore inactive styling before launch.
 * While true, every control whose URL is still a `{{placeholder}}` renders as a live control (full hover, focus and
 * press; no clock, no aria-disabled) with `href="#"` and `data-pending`, and the page script cancels its click.
 * Set it to false for the pending language (the solid edge, the clock, aria-disabled, no href).
 */
export const PREVIEW_PENDING_LIVE = true;

/**
 * Microsoft Clarity project ID. Set PUBLIC_CLARITY_ID at build time to turn analytics on: the consent
 * banner, the Clarity tag and the CTA events all depend on it. Unset (the default), none of them is rendered. The pattern
 * keeps anything but a plain ID out of the script URL.
 */
const clarityId = String(import.meta.env.PUBLIC_CLARITY_ID ?? '').trim();
export const CLARITY_ID = /^[a-z0-9]{6,16}$/i.test(clarityId) ? clarityId : '';

/**
 * Demo-only: the consent banner on the Dev build, with no analytics behind it. The deploy workflow sets
 * PUBLIC_CONSENT_PREVIEW=true for the /latest/ build only; Demo (the customer's version) never gets it. With it on and no
 * project ID, the banner and the footer's "Cookie settings" work and remember the choice, and nothing is loaded or sent.
 * Drop it once launch builds carry the real ID.
 */
const CONSENT_PREVIEW = import.meta.env.PUBLIC_CONSENT_PREVIEW === 'true';

/** The banner and its footer control render when analytics is on, or in the preview build. */
export const ANALYTICS_UI = CLARITY_ID !== '' || CONSENT_PREVIEW;

/** A control's href: the real URL once resolved; otherwise `#`, which the page script cancels. */
export const hrefFor = (href: string) => (isResolved(href) ? href : '#');

/** True when a control should render as live: its URL is real, or the preview override is on. */
export const looksLive = (href: string) => isResolved(href) || PREVIEW_PENDING_LIVE;

/** True once a copy value is real, not a `{{placeholder}}`. */
export const isFilled = (text: string) => !/^\{\{.*\}\}$/.test(text);

/** Prefix an internal path with the configured base, so it works when the site is served from a sub-path. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/** Escape the text and set one phrase in the accent (words unchanged). */
export function emphasise(text: string, phrase: string): string {
  return escapeHtml(text).replace(escapeHtml(phrase), `<span class="key">${escapeHtml(phrase)}</span>`);
}

/** Copy that carries a glyph (▶, ↓, →) the component draws as an icon: the words without the glyph. */
export const withoutGlyph = (text: string) => text.replace(/^[▶▸]\s*|\s*[↓→]$/g, '');

/**
 * A two-part title's halves: the setup before the copy's `[[…]]` marker and the payoff inside it. The page sets
 * the setup in white and the payoff in the titles' blue. Titles without a marker come back as ['', text].
 */
export function titleParts(text: string): [string, string] {
  const m = text.match(/^(.*?)\s*\[\[([^\]]+)\]\]\s*$/);
  return m ? [m[1], m[2]] : ['', text];
}
