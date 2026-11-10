/**
 * Analytics names for every CTA: each click is sent twice, once as its group ("azure-free") so every copy of a button
 * counts as one, and once as group @ placement ("azure-free @ build-steps") for the drill-down. Keyed by the control's
 * data-cta. The flip cards and the sound switch count too: each card's two sides, and the switch as the action it just
 * took (mute or unmute).
 *
 * The hero video sends one name per click and no placement, to keep Clarity's smart events few: play and pause are one
 * event, fullscreen the other. Its skip and sound controls carry no data-cta, so they send nothing.
 *
 * These names are what the Clarity project has already recorded: renaming one splits its history.
 */
const CTA: Record<string, [group: string, placement: string | null]> = {
  'launch-hero': ['launch-game', 'hero'],
  'launch-how': ['launch-game', '60-seconds'],
  'build-hero': ['build-agent', 'hero'],
  'step-1': ['azure-free', 'build-steps'],
  'step-2': ['clone-repo', 'build-steps'],
  'step-3': ['vscode-extension', 'build-steps'],
  'video-play-pause': ['video-play-pause', null],
  'video-fullscreen': ['video-fullscreen', null],
  'flip-1': ['flip-card', 'mixed-query'],
  'flip-2': ['flip-card', 'ghost-product'],
  'flip-3': ['flip-card', 'p95-surge'],
  'flip-back-1': ['flip-back', 'mixed-query'],
  'flip-back-2': ['flip-back', 'ghost-product'],
  'flip-back-3': ['flip-back', 'p95-surge'],
  mute: ['mute', 'header'],
  unmute: ['unmute', 'header'],
};

/** [group, placement] for a data-cta (no placement: the group alone is sent); resources are one group, placed by which
 *  resource; anything new keeps its id. */
export function ctaNames(id: string): [string, string | null] {
  if (CTA[id]) return CTA[id];
  if (id.startsWith('resource-')) return ['resource', id.slice('resource-'.length)];
  return [id, 'page'];
}
