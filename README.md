# portfolio

Source for [jereenvalsson.com](https://jereenvalsson.com) — my personal site and résumé.

Built as a single-page app with a command palette, a WebGL hero scene, and keyboard-first
navigation, because a portfolio site is a reasonable place to over-engineer the details.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | Radix UI primitives, shadcn/ui conventions |
| 3D | React Three Fiber + drei |
| Animation | Framer Motion |
| Content | MDX via `react-markdown` + `gray-matter` |
| Theming | `next-themes`, system-aware dark/light |

## Notable pieces

- **`hero-scene.tsx`** — React Three Fiber scene rendered on the landing view.
- **`command-palette.tsx`** — `⌘K` palette for navigating the site without a mouse,
  with a `shortcuts-overlay` documenting the available bindings.
- **`network-graph.tsx`** — animated graph visual used as a section backdrop.
- **`resume-card.tsx`** — experience entries driven entirely by `src/data/resume.tsx`,
  so updating the résumé means editing one typed object rather than touching JSX.
- **`opengraph-image.tsx` / `sitemap.ts` / `robots.ts`** — generated OG images and SEO
  metadata handled at build time by the App Router.

## Running locally

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

```bash
pnpm build    # production build
pnpm start    # serve the build
pnpm lint     # eslint
```

## Structure

```
src/
├── app/          # routes, layout, metadata, OG image generation
├── components/   # UI components (ui/ and magicui/ are primitives)
├── data/         # resume.tsx — single source of truth for site content
└── lib/          # helpers
```

## License

MIT
