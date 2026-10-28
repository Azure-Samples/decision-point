// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL (the host, for the canonical URL) and SITE_BASE (the path, if not served from the root) are set at build
// time; every internal URL goes through withBase(), so the same source builds for any host.
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.SITE_BASE || '/',
  output: 'static',
  trailingSlash: 'ignore',
});
