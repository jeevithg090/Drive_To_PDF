# Google Drive PDF Downloader

A small, privacy-friendly web app that turns a Google Drive share link into a **direct download
link**. It can also turn a **Google Docs, Sheets or Slides** link into a **PDF export** link. Paste
a link, click Convert, and download the file without going through Drive's preview page.

All conversion happens in your browser. The app has no backend, makes no network requests of its
own and stores nothing.

## Features

- **Drive files → direct download.** Supports the common share-link formats:
  - `drive.google.com/file/d/<id>/view?usp=sharing` (also `/preview`, `/edit` and multi-account `/file/u/0/d/<id>`)
  - `drive.google.com/open?id=<id>` and `drive.google.com/uc?id=<id>`
  - `drive.usercontent.google.com/download?id=<id>`
  - legacy `docs.google.com/file/d/<id>`
- **Google Workspace → PDF.** `docs.google.com/document/…`, `/spreadsheets/…` and
  `/presentation/…` links become their PDF export URLs.
- **Keeps `resourcekey`.** Older shared files need this parameter to download, so it is carried over.
- **Clear validation.** Empty input, non-URLs, non-Google hosts (including look-alike domains),
  folder links and links without a file ID each get their own message.
- **Copy to clipboard**, plus a Download button that opens the link in a new tab.
- **Accessible and responsive.** Labelled input, `aria-invalid`/`aria-describedby` error wiring,
  live regions for results and copy status, visible focus rings, light/dark mode that follows the
  OS, reduced-motion support, and a layout that works at phone width.

> **Note:** the file must be shared as _"Anyone with the link"_. Google shows a virus-scan
> confirmation page instead of starting the download for large files (about 100 MB and up). That
> page comes from Google and this app cannot skip it.

## Tech stack

| Area    | Tools                                               |
| ------- | --------------------------------------------------- |
| UI      | React 19, TypeScript (strict)                       |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`)           |
| Build   | Vite 6                                              |
| Testing | Vitest, Testing Library, jsdom                      |
| Quality | ESLint 9 (typescript-eslint, react-hooks), Prettier |

## Architecture

```
 ┌──────────────┐  input string   ┌──────────────────────────┐
 │   App.tsx    │ ──────────────▶ │ lib/driveLink.ts          │
 │ (form + UI)  │ ◀────────────── │ convertDriveLink(input)   │
 └──────────────┘ ConversionResult│  - parse & normalise URL  │
        │                         │  - allow-list Google hosts│
        ▼                         │  - extract + validate ID  │
 CopyButton / Download link       │  - build download/PDF URL │
                                  └──────────────────────────┘
```

- `src/lib/driveLink.ts` holds all the logic. It is pure and has no React or DOM dependencies.
  `convertDriveLink` returns a discriminated union (`{ ok: true, value } | { ok: false, error }`),
  so the UI never has to catch exceptions.
- `src/App.tsx` holds the form state and renders either an error or the result.
- `src/components/` contains the copy button and the inline SVG icons.

## Getting started

**Prerequisites:** Node.js 20.19+ (22 LTS recommended; see `.nvmrc`) and npm.

```bash
npm install
npm run dev        # http://localhost:3000
```

### Environment variables

None. The app is fully static and needs no API keys or configuration.

## Scripts

| Command              | What it does                                    |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Start the Vite dev server on port 3000          |
| `npm run build`      | Type-check, then build to `dist/`               |
| `npm run preview`    | Serve the production build locally              |
| `npm test`           | Run the test suite once                         |
| `npm run test:watch` | Run tests in watch mode                         |
| `npm run lint`       | Lint with ESLint                                |
| `npm run typecheck`  | Type-check with `tsc`                           |
| `npm run format`     | Format with Prettier (`format:check` to verify) |

## Deployment

`npm run build` writes a static site to `dist/`. Any static host can serve it, for example GitHub
Pages, Netlify, Vercel, Cloudflare Pages or an S3 bucket. There are no server-side routes, so no
rewrite rules are needed. To serve the app from a sub-path such as GitHub Pages project sites, set
[`base`](https://vite.dev/config/shared-options.html#base) in `vite.config.ts`.

## Project structure

```
.
├── index.html               # HTML entry, page metadata
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx             # React root
│   ├── App.tsx              # Main UI
│   ├── App.test.tsx         # UI tests
│   ├── index.css            # Tailwind entry + animations
│   ├── components/          # CopyButton and SVG icons
│   ├── lib/
│   │   ├── driveLink.ts     # Link parsing & URL building (core logic)
│   │   └── driveLink.test.ts
│   └── test/setup.ts        # Vitest / jest-dom setup
├── eslint.config.js
├── vite.config.ts           # Vite + Vitest config
└── tsconfig.json
```

## Disclaimer

This project is not affiliated with or endorsed by Google. It only rewrites URLs. Access to files
is governed by the sharing settings that the file's owner chose in Google Drive.
