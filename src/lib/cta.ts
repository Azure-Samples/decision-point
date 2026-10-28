/**
 * Analytics names for every CTA: each click is sent twice, once as its group ("azure-free") so every
 * copy of a button counts as one, and once as group @ placement ("azure-free @ build-steps") for the drill-down. Keyed by the
 * control's data-cta.
 */
const CTA: Record<string, [group: string, placement: string]> = {
  'launch-hero': ['launch-game', 'hero'],
  'launch-how': ['launch-game', '60-seconds'],
  'build-hero': ['build-agent', 'hero'],
  'step-1': ['azure-free', 'build-steps'],
  'step-2': ['clone-repo', 'build-steps'],
  'step-3': ['walkthrough', 'build-steps'],
};

/** [group, placement] for a data-cta; resources are one group, placed by which resource; anything new keeps its id. */
export function ctaNames(id: string): [string, string] {
  if (CTA[id]) return CTA[id];
  if (id.startsWith('resource-')) return ['resource', id.slice('resource-'.length)];
  return [id, 'page'];
}
