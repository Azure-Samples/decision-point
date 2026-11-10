# Decision Point landing page

The landing page for **Decision Point**, a browser game where you're the lead engineer shipping an AI agent on Azure HorizonDB, powered by Azure and AMD. Players visit it before the game, and the game's end screen sends them back to it to build the agent for real.

- See how the game works, the badges you can earn, and the steps to build the agent on Azure HorizonDB.
- Start the game, or go straight to the build steps and the Azure free account.
- Find developer resources for Azure HorizonDB and Azure Database for PostgreSQL.

The page is a static site built with [Astro](https://astro.build) and TypeScript.

## Getting started

You need **Node.js 22.12 or later**.

```bash
npm ci
npm run dev   # http://localhost:4321
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the local dev server at `http://localhost:4321` |
| `npm run build` | Builds the static site into `dist/` |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run check` | Runs Astro's type and template checks |

## Where to change things

| To change… | Edit |
| --- | --- |
| The words on the page | [src/content/copy.ts](src/content/copy.ts) |
| Outbound links (the game, Azure, docs, resources) | [src/content/links.ts](src/content/links.ts) |
| Colours, type sizes, spacing and motion values | [src/styles/tokens.css](src/styles/tokens.css) |
| Shared text styles | [src/styles/global.css](src/styles/global.css) |
| A section of the page | [src/components/](src/components/), one component per section, in the order set by [src/pages/index.astro](src/pages/index.astro) |
| Images (badges, logos) | [src/assets/](src/assets/) |
| The hero's preview video and its poster | [public/video/](public/video/) |
| The game's sounds | [public/sounds/](public/sounds/) |
| Analytics names for buttons | [src/lib/cta.ts](src/lib/cta.ts) |

Players arriving from the game's end screen with `?from=game` land on the build steps (`#build-steps`).

## Build settings

Set these when you build. None are needed for local work.

| Variable | What it does |
| --- | --- |
| `SITE_URL` | The site's host, used for the canonical URL. Defaults to `http://localhost:4321` |
| `SITE_BASE` | The path the site is served from, if not the root (for example `/decision-point`). Defaults to `/` |
| `PUBLIC_CLARITY_ID` | A Microsoft Clarity project ID. When set, the page shows a consent banner and loads Clarity with consent denied until the visitor accepts. When unset, no analytics code is included |
| `PUBLIC_INDEX` | Set to `true` to allow search engines to index the site. By default every page is `noindex` |

For example:

```bash
SITE_URL=https://example.com SITE_BASE=/decision-point PUBLIC_INDEX=true npm run build
```

## Deployment

`npm run build` produces a self-contained static site in `dist/`. Serve that folder from any static host, and set `SITE_URL` and `SITE_BASE` to match where it's served.

### GitHub Pages

[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) builds and deploys the site to GitHub Pages on every push to `main`. You can also run it from the **Actions** tab.

1. In the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Push to `main`. The site is served at `https://<owner>.github.io/<repo>/`.

The workflow reads `SITE_URL` and `SITE_BASE` from the Pages configuration, so it also works with a custom domain. It builds with this project's Microsoft Clarity ID unless a `PUBLIC_CLARITY_ID` repository variable names another one. To allow indexing, add `PUBLIC_INDEX` with the value `true`. Repository variables are under **Settings → Secrets and variables → Actions → Variables**.

## Contributing

This project welcomes contributions and suggestions. See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](.github/CODE_OF_CONDUCT.md).

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general). Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship. Any use of third-party trademarks or logos are subject to those third-party's policies.

## License

[MIT](LICENSE.md)
