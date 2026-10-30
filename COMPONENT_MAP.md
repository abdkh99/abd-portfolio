# Component Map — Abdullah Portfolio

**Purpose:** Inventory of UI building blocks, where they live, what they do, and design-system role.  
**No code changes** — reference for refinement phase.

---

## Page composition

```
app/page.tsx
├── ScrollProgressBar          components/ui/ScrollProgressBar.tsx
└── main (bg-black-100)
    └── max-w-[1500px]
        ├── FloatingNav          components/ui/floating-navbar.tsx  ← data: navItems
        ├── Hero                 components/Hero.tsx
        ├── Grid (About)         components/BentoGrid.tsx → MagicBento
        ├── RecentProjects       components/RecentProjects.tsx → ProjectsCards
        ├── Clients              components/Clients.tsx → InfiniteMovingCards
        ├── Experience           components/WorkExperience.tsx → MovingBorders Button
        ├── Approach             components/Approach.tsx (local Card, AceternityIcon)
        └── Footer               components/Footer.tsx
```

**Shell:** `app/layout.tsx` → `ThemeProvider`, `globals.css`  
**Data:** `data/index.ts` — nav, testimonials, companies, workExperience  
**Utils:** `lib/utils.ts` — `cn()`

---

## Layout & global

| Component | File | Role | Design system |
|-----------|------|------|----------------|
| Root layout | `app/layout.tsx` | HTML shell, favicon, theme wrapper | Container N/A |
| Home page | `app/page.tsx` | Section order, page padding, max width | `Container`, `Section` orchestration |
| Global styles | `app/globals.css` | `--black-100`, `.heading`, `.gradient-animated`, social icons CSS | Tokens, `SectionHeading` base, `SocialIcon` |
| Theme provider | `components/theme-provider.tsx` | next-themes | Latent; site visually dark-only |

---

## Navigation

| Component | File | Props / data | Visual rules |
|-----------|------|--------------|--------------|
| **FloatingNav** | `components/ui/floating-navbar.tsx` | `navItems[]`: `name`, `link`, optional `icon` | Fixed pill, `#000319`, scroll-up reveal, `text-sm`, `rounded-full`, multi-layer shadow |

**Data source:** `data/index.ts` → `navItems` (no icons currently).

---

## Section components

| Section | File | ID | Heading variant | Child UI |
|---------|------|-----|-----------------|----------|
| Hero | `components/Hero.tsx` | — | GradualSpacing (custom, not SectionHeading) | Spotlight, GradualSpacing, CVButton |
| About | `components/BentoGrid.tsx` | `#about` | — (no section H1) | MagicBento |
| Projects | `components/RecentProjects.tsx` | `#projects` | `HighlightText` | ProjectsCards × N |
| Clients | `components/Clients.tsx` | `#testimonials` | `.gradient-animated` span | InfiniteMovingCards, company logos |
| Experience | `components/WorkExperience.tsx` | — | `SparklesText` | MovingBorders `Button` × N |
| Approach | `components/Approach.tsx` | — | `TextShimmer` | Local `Card`, `CanvasRevealEffect`, `AceternityIcon` |
| Footer | `components/Footer.tsx` | `#contact` | RotatingText + plain heading | MagicButton, SocialIcons, TextShimmer |

---

## Button components

| Name | File | Variant | Used in | Unify as |
|------|------|---------|---------|----------|
| **CVButton** | `components/ui/CVButton.tsx` + `CVBUTTON.module.css` | `cv` | Hero | Keep signature; optional `Button` variant `cv` |
| **MagicButton** | `components/ui/MagicButton.tsx` | `primary` (conic) | Footer | `Button` variant `primary` |
| **Project CTA** | Inline in `components/ui/ProjectsCards.tsx` | `project` | Each project card hover | `Button` variant `project` |
| **AceternityIcon** | `components/Approach.tsx` | `ghost` / decorative | Approach phase label | Not global CTA |
| **MovingBorders Button** | `components/ui/MovingBorders.tsx` | `card` wrapper | Experience | Card container, not text button |

**MagicButton props:** `title`, `icon`, `position` (`left`|`right`), `handleClick?`, `otherClasses?`

**CVButton props:** `href`, `downloadName`, `iconOnly`, `className`

---

## Card components

| Name | File | Type | Interaction |
|------|------|------|-------------|
| **MagicBento** / ParticleCard | `components/ui/MagicBento.tsx` | About bento | GSAP particles, glow, magnetism, ripple; mobile off |
| **ProjectsCards** (DestinationCard) | `components/ui/ProjectsCards.tsx` | Project | 3D tilt, hover slide panel, badges |
| **InfiniteMovingCards** item | `components/ui/infinite-moving-cards.tsx` | Testimonial | CSS scroll animation, duplicated DOM |
| **Experience card** | `WorkExperience.tsx` + MovingBorders | Experience | Animated border glow |
| **Approach Card** | `components/Approach.tsx` | Process | Hover/click canvas reveal |

**Duplicate file:** `components/ProjectsCards.tsx` (root) — verify unused vs `ui/ProjectsCards.tsx` before future edits.

---

## Typography & heading effects

| Component | File | Maps to `highlightVariant` |
|-----------|------|----------------------------|
| `.heading` | `globals.css` | Base section title |
| **GradualSpacing** | `components/ui/Gradual-spacing.tsx` | Hero entrance (letter stagger) |
| **HighlightText** | `components/animate-ui/text/highlight.tsx` | `highlight` |
| **SparklesText** | `components/ui/SparklesText.tsx` | `sparkle` |
| **TextShimmer** | `components/ui/TextShimmerComponent.tsx` | `shimmer` |
| `.gradient-animated` | `globals.css` | `animated-gradient` |
| **RotatingText** | `components/ui/RotatingText.tsx` | Footer special (word rotator) |

**Future `SectionHeading`:** composes `.heading` + one of the above.

---

## Atmosphere & effects

| Component | File | Section |
|-----------|------|---------|
| **Spotlight** | `components/ui/spotlight-new.tsx` | Hero |
| **ScrollProgressBar** | `components/ui/ScrollProgressBar.tsx` | Global fixed top |
| **CanvasRevealEffect** | `components/ui/CanvasRevealEffect.tsx` | Approach cards |
| Dot grid + mask | Inline `Hero.tsx` | Hero |

---

## Media & social

| Component | File | Notes |
|-----------|------|-------|
| **SocialIcons** | `components/ui/SocialIcons.tsx` | Uses `.example-2` styles from `globals.css`; real LinkedIn, GitHub, Instagram URLs |
| **next/image** | Hero (none), Footer grid, Experience thumbnails, Projects | — |

---

## Data-driven content

| Export | File | Feeds |
|--------|------|-------|
| `navItems` | `data/index.ts` | FloatingNav |
| `testimonials` | `data/index.ts` | InfiniteMovingCards |
| `companies` | `data/index.ts` | Clients logo row |
| `workExperience` | `data/index.ts` | WorkExperience |
| Project cards | Inline in `RecentProjects.tsx` | ProjectsCards props (not centralized in data yet) |

---

## Badge pattern

**Not a standalone component** — inline in `ProjectsCards.tsx`:

- `rounded-[20px] bg-white/20 px-3 py-1 text-[0.8rem] backdrop-blur-[5px]`
- Maps to design token: **tech stack badge**

---

## Container & section patterns

| Pattern | Implementation |
|---------|----------------|
| **Container** | `main` → child `div.max-w-[1500px].w-full` |
| **Section spacing** | `py-20` on most sections |
| **Section heading** | `h1.heading` + effect child |
| **Full-bleed exception** | Testimonials scroller `w-screen` |

---

## Dependency graph (motion)

```
Framer Motion / motion/react
  → Hero, Footer, Approach, ProjectsCards, FloatingNav, GradualSpacing,
     HighlightText, TextShimmer, SparklesText, RotatingText, MovingBorders

GSAP
  → MagicBento (particles, tilt, spotlight, ripples)
```

---

## Third-party / tutorial lineage (for awareness)

| File | Lineage |
|------|---------|
| `MagicButton.tsx` | Aceternity UI (documented in comment) |
| `floating-navbar.tsx` | Aceternity-style |
| `MovingBorders.tsx` | Aceternity-style |
| `infinite-moving-cards.tsx` | Aceternity-style |
| `spotlight-new.tsx` | Aceternity-style defaults (hero overrides gradients) |
| `MagicBento.tsx` | Community bento pattern (large inline CSS) |

**Strategy:** Keep components; reduce **visible template signals** via tokens, copy, and content — not wholesale removal.

---

## Suggested future component abstractions (post-approval)

| Abstraction | Composes |
|-------------|----------|
| `Section` | `id`, `className`, `py-20` |
| `Container` | `max-w-[1500px] w-full` |
| `SectionHeading` | `.heading` + highlight variant |
| `Button` | variants: `cv`, `primary`, `project`, `ghost` |
| `Badge` | tech stack chip from project card |

---

*Cross-reference: tokens and rules in `DESIGN_SYSTEM.md`; issues and priorities in `UI_AUDIT.md`.*
