/**
 * Every outbound URL. `{{…}}` means we don't have it yet;
 * isResolved() keeps those from ever rendering as links.
 *
 * SELF-SOURCED: a public page we found ourselves (2026-10-28), not supplied by the customer. Each is to confirm with
 * them; to revert one, put its `{{…}}` placeholder back (shown in its comment). `grep SELF-SOURCED` lists them all.
 */
export const links = {
  game: 'https://azure.dev-stand.site/start', // the game's staging start page
  azureFree: 'https://azure.microsoft.com/free',
  repo: '{{repo_url}}',
  walkthrough: '{{repo_url}}#quickstart',
  horizonDbDocs: 'https://learn.microsoft.com/en-us/azure/horizondb/',
  aiCapabilities: 'https://learn.microsoft.com/en-us/azure/horizondb/ai/ai-overview', // SELF-SOURCED, was {{ai_capabilities_url}}
  // SELF-SOURCED, was {{learning_path_url}}. The AI path; the general one is /training/paths/microsoft-learn-azure-database-for-postgresql/
  learningPath: 'https://learn.microsoft.com/en-us/training/paths/develop-ai-solutions-azure-database-postgresql/',
  // The two the customer supplied in their review (2026-10-27)
  vscodeExtension: 'https://marketplace.visualstudio.com/items?itemName=ms-ossdata.vscode-pgsql',
  azureFreeAccount:
    'https://go.microsoft.com/fwlink/?linkid=2227353&clcid=0x409&l=en-us&ref=azure.microsoft.com&hasfullconsent=true&icid=products_horizondb',
  // In the brief; still to confirm
  postgresHub: 'https://azure-samples.github.io/postgres-hub/',
  techCommunity: 'https://techcommunity.microsoft.com/category/azuredatabases/blog/adforpostgresql', // SELF-SOURCED, was {{tech_community_url}}
  discussions: 'https://github.com/Azure-Samples/postgres-hub/discussions', // SELF-SOURCED, was {{discussions_url}}
  azurePostgresDocs: 'https://learn.microsoft.com/en-us/azure/postgresql/',
  contribute: 'https://github.com/Azure-Samples/postgres-hub/blob/main/Contributing.md', // SELF-SOURCED, was {{contribute_url}}
  // Microsoft's standard privacy statement and trademarks pages, as on the sister site (PostgreSQL Like a Pro)
  privacy: 'https://go.microsoft.com/fwlink/?LinkId=521839',
  trademarks: 'https://www.microsoft.com/legal/intellectualproperty/trademarks',
} as const;

export type LinkKey = keyof typeof links;
