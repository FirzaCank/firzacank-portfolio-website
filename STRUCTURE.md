# Project structure

Conventions used across the codebase.

```
app/                        Next.js App Router (routes only)
  layout.tsx                Root layout, fonts, nav + footer shell
  page.tsx                  Homepage composition
  [route]/page.tsx          Each route group

components/
  layout/                   App shell: Nav, MobileMenu, Footer
  sections/                 Page section blocks composed of UI + data
  ui/                       Reusable primitives (Button, Pill, etc.)

content/                    MDX content (project case studies, Phase 6+)
  projects/[slug].mdx

data/                       Static data sources + co-located types
  nav.ts                    NavItem type, NAV_ITEMS, SOCIAL_LINKS, CV_URL
  experience.ts             Role type, ROLES array
  projects.ts               Project type, ProjectCategory, PROJECTS, helpers

lib/                        Pure utility functions (no JSX, no data)
  utils.ts                  cn() className merger

public/                     Static assets served at root
  firza-cv.pdf
  images/                   Photos, OG images

styles/
  globals.css               Tailwind directives + base styles
```

## Import conventions

Use the `@/*` path alias (configured in `tsconfig.json`):

```ts
import Nav from "@/components/layout/Nav";          // layout shell
import Hero from "@/components/sections/Hero";       // page sections
import { ROLES } from "@/data/experience";           // static data
import { cn } from "@/lib/utils";                    // utilities
import "@/styles/globals.css";                       // global styles
```

## Rules of thumb

- Data arrays and their types live together in `data/*.ts`. No separate `types/` folder.
- Components in `sections/` are page-level blocks. They are not meant to be reused across radically different contexts.
- Reusable primitives go in `components/ui/` once they emerge from real use (avoid premature abstraction).
- `lib/` is for stateless utility functions. No React, no data.
- All MDX project case studies live under `content/projects/` and are loaded by the catch-all route in `app/projects/[slug]/page.tsx`.
