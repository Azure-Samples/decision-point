/**
 * Analytics names for every CTA: each click is sent twice, once as its group ("azure-free") so every
 * copy of a button counts as one, and once as group @ placement ("azure-free @ build-steps") for the drill-down. Keyed by the
 * control's data-cta. The flip cards and the sound switch count too: each card's two sides, and the switch as the action
 * it just took (mute or unmute).
 */
const CTA: Record<string, [group: string, placement: string]> = {
  'launch-hero': ['launch-game', 'hero'],
  'launch-how': ['launch-game', '60-seconds'],
  'build-hero': ['build-agent', 'hero'],
  'step-1': ['azure-free', 'build-steps'],
  'step-2': ['clone-repo', 'build-steps'],
  'step-3': ['walkthrough', 'build-steps'],
  'flip-1': ['flip-card', 'mixed-query'],
  'flip-2': ['flip-card', 'ghost-product'],
  'flip-3': ['flip-card', 'p95-surge'],
  'flip-back-1': ['flip-back', 'mixed-query'],
  'flip-back-2': ['flip-back', 'ghost-product'],
  'flip-back-3': ['flip-back', 'p95-surge'],
  mute: ['mute', 'header'],
  unmute: ['unmute', 'header'],
};

/** [group, placement] for a data-cta; resources are one group, placed by which resource; anything new keeps its id. */
export function ctaNames(id: string): [string, string] {
  if (CTA[id]) return CTA[id];
  if (id.startsWith('resource-')) return ['resource', id.slice('resource-'.length)];
  return [id, 'page'];
}
