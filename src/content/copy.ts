/**
 * Every word on the page, in one place. Components never hold copy.
 *
 * Source: the client brief's landing page copy, as rewritten in the "Updated" copy pass and then edited by the
 * customer's review (2026-10-27).
 *
 * `[[…]]` marks the payoff of a two-part heading (titleParts() in src/lib/inline.ts): the part before it is set in white
 * and the payoff in the titles' blue. Only the tone split is ours.
 *
 * The game is called Decision Point: every "Postgres Protocol" in the brief reads "Decision Point" here, and the
 * hashtag is #DecisionPoint.
 */

export const meta = {
  title: 'Decision Point: play the game, ship the agent',
  description:
    'A 10–15 minute browser game about shipping an AI agent on Azure HorizonDB. Then build one for real, with $200 in free Azure credit. Powered by Microsoft and AMD.',
} as const;

export const nav = {
  brand: 'Decision Point',
  // Each label is its section's title in short form, in page order (shortened to fit)
  links: [
    { label: 'How it works', href: '#how' },
    { label: 'Badges', href: '#badges' },
    { label: 'Build', href: '#build-steps' },
    { label: 'Resources', href: '#resources' },
  ],
  // The header's sound switch: one name, its pressed state says it is muted
  mute: 'Mute sound',
} as const;

export const hero = {
  titleLine1: 'Play the game.',
  titleLine2: 'Ship the agent.',
  subhead:
    "A 10–15 minute browser game: you're the lead engineer as Basket IQ races to launch. Make real architecture calls, watch your Launch Readiness score move, then take your build to a real repo on Azure HorizonDB.",
  primary: 'Play Decision Point',
  // The hero's secondary button
  build: '▶ Build the agent',
  // The brief's ribbon as three facts, and the slot for the client's preview animation
  facts: ['No install', 'No sign-up', 'Runs in Chrome, Edge, Safari and Firefox'],
  artSlot: 'Client asset: preview animation',
  artSlotNote: 'placeholder',
  artLabel: 'Relational rows stream out and become embeddings, which an index joins into one ranked path.',
  pause: 'Pause animation',
  play: 'Play animation',
} as const;

export const how = {
  title: 'Every decision [[counts]]',
  // The brief's body, its sentences each placed where they do their job
  lead: "Decision Point puts you in charge of launching Basket IQ, Contoso's new AI shopping agent.",
  leadKey: 'Basket IQ',
  cardsIn: 'Fix three engineering incidents before the app ships.',
  cardsInKey: 'three engineering incidents',
  // The stepper: a title over a body per step, rewriting the brief's last sentence
  steps: [
    { title: 'Three meters', body: 'Your calls impact search relevance, reliability and responsiveness.' },
    { title: 'One score', body: 'The meters roll up into your Launch Readiness score.' },
    { title: 'The leaderboard', body: 'Your score earns your place on the leaderboard.' },
  ],
  flipBack: 'Back to the incident',
  learnLabel: "What you'll learn",
  incidents: [
    {
      incident: 'Executive demo misses a mixed query',
      learn: 'BM25 + DiskANN + RRF fusion + azure_ai.rank() semantic reranking',
    },
    {
      incident: 'Agent recommends a ghost product',
      learn: 'Durable AI pipelines with ai.create_pipeline() and on_change triggers',
    },
    {
      incident: 'Traffic surge breaks p95',
      learn: 'DiskANN SQ, Advanced Filtering push-down, read scale-out',
    },
  ],
  // The leaderboard lives in the game: this opens the game's entry page (customer, 2026-10-27)
  cta: 'View the leaderboard',
} as const;

export const badges = {
  title: 'Six badges. [[Six ways to play.]]',
  items: [
    { name: 'Precision Pathfinder' },
    { name: 'Grounding Guardian' },
    { name: 'AMD Transaction Titan' },
    { name: 'Decisive Diplomat' },
    { name: 'Go-live General' },
    { name: 'SQL Savant' },
  ],
  intro: 'Badges reward how you play, not just your score.',
  titan: 'Maxing out the Responsiveness meter.',
  // How to earn each badge, in badge order (the customer's wording, 2026-10-27); the Transaction Titan's line is
  // `titan`, above.
  earn: [
    'Prioritizing accurate, relevant search results.',
    'Keeping the agent grounded in fresh data.',
    null,
    'Balancing all three meters without letting one slip.',
    'Making it to the top of the leaderboard.',
    'Completing the mission on Hard Mode.',
  ],
} as const;

export const build = {
  // The Build panel's headline, moved onto the steps (customer, 2026-10-27: the panel itself is cut)
  stepsTitle: 'You shipped it in the sim. [[Now ship it for real.]]',
  stepsIntro:
    'The same shape as Basket IQ: hybrid search, an AI pipeline that keeps data fresh, and a working agent on your own Azure account. New Azure customers can sign up for an Azure free account with up to $200 credit for 30 days plus free monthly amounts on 60+ services.',
  steps: [
    {
      title: 'Start Azure free.',
      body: 'Free credit for 30 days, plus 12 months of free monthly amounts on 60+ services. New Azure customers only.',
      button: 'Start Azure free — $200 credit',
      link: 'azureFree',
      helper: 'No card charge unless you upgrade. Spending protection is on by default.',
    },
    {
      title: 'Clone the GitHub repo',
      body: '',
      button: 'Open the repo on GitHub',
      link: 'repo',
      helper: '',
    },
    {
      title: 'Build in VS Code.',
      body: 'Plan on 60–90 minutes of hands-on time.',
      button: 'Read the walkthrough',
      link: 'walkthrough',
      helper: 'Uses the VS Code PostgreSQL extension with GitHub Copilot Agent mode for schema and query authoring.',
    },
  ],
} as const;

export const guidance = {
  title: 'Stay inside the $200',
  items: [
    { lead: 'Provision a 2-vCore cluster.', body: "It's the smallest HorizonDB size and costs ~$0.44/hour." },
    {
      lead: 'Run the cluster in short sessions.',
      body: 'Delete the cluster between build sessions; storage costs a few cents per GiB per month.',
    },
    {
      lead: 'Use the default AI models.',
      body: 'Azure HorizonDB provisions text-embedding-3-small, gpt-5.4, and Cohere-rerank-v4.0-fast — you pay Foundry rates only for what you call.',
    },
  ],
} as const;

export const resources = {
  title: 'Developer [[Resources]]',
  pending: 'Link coming soon',
  columns: [
    {
      heading: 'Learn',
      items: [
        { label: 'Azure HorizonDB docs', link: 'horizonDbDocs' },
        { label: 'AI capabilities in HorizonDB', link: 'aiCapabilities' },
        { label: 'Azure Database for PostgreSQL learning path', link: 'learningPath' },
      ],
    },
    {
      heading: 'Build',
      items: [
        { label: 'The GitHub repo', link: 'repo' },
        { label: 'Microsoft PostgreSQL extension for VS Code', link: 'vscodeExtension' },
        { label: 'Azure free account', link: 'azureFreeAccount' },
      ],
    },
    {
      heading: 'Community',
      items: [
        { label: 'PostgreSQL Hub', link: 'postgresHub' },
        { label: 'Azure PostgreSQL Tech Community', link: 'techCommunity' },
        { label: 'GitHub Discussions on postgres-hub', link: 'discussions' },
      ],
    },
  ],
} as const;

export const amd = {
  eyebrow: 'Powered by',
  lead: 'Real hardware [[behind the scenes.]]',
  body: 'Azure Database for PostgreSQL and Azure HorizonDB run on Azure infrastructure powered by AMD processors.',
  // Alt texts for the official Microsoft and AMD logos
  microsoftLogoAlt: 'Microsoft',
  amdLogoAlt: 'AMD',
} as const;

export const footer = {
  line: 'Decision Point · A Microsoft Azure × AMD developer experience',
  links: [
    { label: 'PostgreSQL Hub', link: 'postgresHub' },
    { label: 'Azure HorizonDB docs', link: 'horizonDbDocs' },
    { label: 'Azure Database for PostgreSQL docs', link: 'azurePostgresDocs' },
    { label: 'Contribute on GitHub', link: 'contribute' },
    { label: 'Privacy', link: 'privacy' },
    { label: 'Trademarks', link: 'trademarks' },
  ],
  // Shown only when analytics is on (reopens the consent banner)
  cookies: 'Cookie settings',
  // Small legal text is TBD in the brief: hidden until supplied
  legal: '{{legal}}',
} as const;

export const assets = {
  newTab: '(opens in a new tab)',
  skip: 'Skip to content',
  navLabel: 'Main',
} as const;

/** The analytics consent banner (approved wording; it never names the analytics product). Rendered when PUBLIC_CLARITY_ID is set, or in the Dev preview build. */
export const consent = {
  title: 'Analytics cookies',
  body: 'This site uses optional analytics cookies to understand how visitors use the page. If you decline, only cookie-free measurement is used. You can change your selection at any time under Cookie settings.',
  privacy: 'Privacy Statement',
  accept: 'Accept',
  decline: 'Decline',
} as const;
