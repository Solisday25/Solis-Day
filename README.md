# Solis Day Design Studio

Marketing site for Solis Day Design Studio, a landscape architecture studio serving Sacramento, Napa Valley, and the Bay Area.

Built with Vite (vanilla JS, no framework).

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is written to `dist/`.

## Environment variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |

`.env` is gitignored and will not be committed.

## Deployment (GitHub Pages)

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to GitHub Pages on every push to `main`.

### Setup

1. Push this repo to GitHub.
2. In the repo settings, go to **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. (Optional) Configure a custom domain under **Settings → Pages → Custom domain**.

### Custom domain

The site is configured for the custom domain `solisday.com`. The Vite `base` is set to `/` in `vite.config.js`. If hosting at a `username.github.io/repo-name` URL instead, update `base` to `"/repo-name/"`.
