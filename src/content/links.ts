/** Every outbound URL on the page. */
export const links = {
  game: 'https://aka.ms/decision-point/play',
  azureFree: 'https://azure.microsoft.com/free', // the Build steps' "Start Azure free" button
  repo: 'https://aka.ms/decision-point/build-repo',
  horizonDbDocs: 'https://learn.microsoft.com/en-us/azure/horizondb/',
  aiCapabilities: 'https://learn.microsoft.com/en-us/azure/horizondb/ai/ai-overview',
  // The AI learning path; the general one is /training/paths/microsoft-learn-azure-database-for-postgresql/
  learningPath: 'https://learn.microsoft.com/en-us/training/paths/develop-ai-solutions-azure-database-postgresql/',
  vscodeExtension: 'https://marketplace.visualstudio.com/items?itemName=ms-ossdata.vscode-pgsql',
  // The Resources tile: the free-account sign-up, attributed to the HorizonDB product page
  azureFreeAccount:
    'https://go.microsoft.com/fwlink/?linkid=2227353&clcid=0x409&l=en-us&ref=azure.microsoft.com&hasfullconsent=true&icid=products_horizondb',
  postgresHub: 'https://azure-samples.github.io/postgres-hub/',
  techCommunity: 'https://techcommunity.microsoft.com/category/azuredatabases/blog/adforpostgresql',
  discussions: 'https://github.com/Azure-Samples/postgres-hub/discussions',
  azurePostgresDocs: 'https://learn.microsoft.com/en-us/azure/postgresql/',
  // Microsoft's standard privacy statement and trademarks pages
  privacy: 'https://go.microsoft.com/fwlink/?LinkId=521839',
  trademarks: 'https://www.microsoft.com/legal/intellectualproperty/trademarks',
} as const;
