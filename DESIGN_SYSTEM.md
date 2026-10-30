# Design System — Abdullah Portfolio

**Status:** Extracted from existing codebase (documentation only).  
**Visual direction:** Midnight indigo-purple developer portfolio — preserved, not reinvented.  
**Goal:** Formalize what already exists so future changes feel like *personal refinement*, not a template swap.

---

## Principles

1. **Dark workspace atmosphere** — near-black navy canvas, soft borders, colored glow over flat elevation.
2. **Purple-first interactions** — electric violet for focus; indigo/cyan/pink gradients only where already established.
3. **Motion with purpose** — entrance, hover reveal, scroll feedback; not decoration for its own sake.
4. **Personal proof** — real projects, real links, real identity outweigh component showcase.
5. **Coherence over novelty** — unify inconsistent tokens; do not add trendy AI-portfolio patterns.

---

## Design Tokens

### Colors

Resolved palette: keep **purple as primary accent**, treat **indigo as secondary atmospheric accent** (projects/footer chip), converge **background darks** toward two levels (page vs card).

| Token | Value | Purpose | Existing source | Recommended usage |
|-------|--------|---------|-------------------|-------------------|
| `background-primary` | `#000319` | Page shell, nav fill, hero base | `--black-100` in `app/globals.css`, `Hero.tsx`, `floating-navbar.tsx`, `page.tsx` | `main`, fixed nav, full-bleed sections |
| `background-elevated` | `#060010` | Bento / deep card wells | `MagicBento.tsx` `--background-dark`, card `color` | Interactive card surfaces in about grid |
| `background-card` | `rgb(4, 7, 29)` → `#0c0e23` (gradient end) | Raised cards, testimonials, experience | Inline styles in `WorkExperience.tsx`, `infinite-moving-cards.tsx` | Testimonial cards, experience cards, any “panel on page” |
| `background-gradient-section` | `linear-gradient(90deg, #161a31 0%, #06091f 100%)` | Optional section depth | `.black-gradient` in `globals.css` | Section bands if needed; prefer sparingly |
| `border-subtle` | `rgba(255, 255, 255, 0.2)` / `border-white/[0.2]` | Quiet separation on dark | `Approach.tsx`, nav `border-white/[0.3]` | Approach cards, decorative frames |
| `border-strong` | `#392e4e` / `slate-800` | Card outlines | Bento `--border-color`; testimonial/experience `border-slate-800` | Bento, marquee cards, experience |
| `border-muted` | `gray-600/40` | Project card frame | `ProjectsCards.tsx` | Project grid outer border |
| `text-primary` | `#ffffff` / `text-white` | Headlines, body on dark | Global pattern | All primary copy |
| `text-secondary` | `text-blue-100` | Hero eyebrow, cool secondary | `Hero.tsx` kicker | Short labels, eyebrows only |
| `text-muted` | `#9ca3af` (`gray-400`) | Supporting copy | `Footer.tsx` | Subheads, helper text |
| `text-muted-soft` | `#e4ecff` | Long copy on hover panels | Inline in `Approach.tsx` | Approach descriptions |
| `accent-primary` | `#9333ea` (`purple-600`) | Headline accents, footer chip | Hero, Footer, SparklesText | Primary brand accent (Tailwind purple-600) |
| `accent-primary-soft` | `#9b3cc7` | CV button, personal signature | `CVBUTTON.module.css` `--color` | CV control only (signature) |
| `accent-primary-glow` | `rgb(132, 0, 255)` / `#8400ff` | Bento glow, particles | `MagicBento.tsx` `DEFAULT_GLOW_COLOR` | About grid interactions |
| `accent-secondary` | `#6366f1`–`#7c3aed` (indigo–violet) | Project overlays, shadows | `ProjectsCards.tsx`, scroll bar `#7c3aed` | Project hover state, progress bar — **secondary** to purple-600 |
| `accent-gradient-text` | `#06b6d4` → `#7c3aed` → `#ef44ca` → `#0021b6` | Animated headline fills | `.gradient-animated` in `globals.css` | One phrase per section max (e.g. clients heading) |
| `accent-gradient-highlight` | `from-blue-500 to-purple-600` | In-view highlight pill | `animate-ui/text/highlight.tsx` | Section heading highlighted span |
| `accent-conic-border` | `#E2CBFF`, `#393BB2` | Spinning border on magic controls | `MagicButton.tsx`, `Approach.tsx` AceternityIcon | Footer CTA, phase pills |
| `accent-active-press` | `#3a0ca3` | CV button active state | `CVBUTTON.module.css` | CV `:active` only |
| `success` / `error` | — | Not used in UI | — | **Do not introduce** until forms/alerts exist |

**Purple vs indigo resolution (for future code, not yet applied):**

- **Primary interactive accent:** `purple-600` / `#9b3cc7` (CV) / bento `#8400ff` → document as one family; new UI should pick **one default** (`purple-600`) and reserve bento glow for about section only.
- **Secondary depth accent:** indigo/violet on **project cards only** until unified — then gently shift project overlay toward `violet-700` + `purple-700` to match sitewide purple.

---

### Typography

**Personality:** Mostly **Inter** (intended) with **system-ui fallback**; **serif only on CV button** — keep that contrast as a signature.

**Loading note:** `globals.css` sets `font-family: 'Inter'…` but `app/layout.tsx` only preconnects Google Fonts — Inter may not load for all users. Future fix: load Inter explicitly; do not change scale.

| Role | Size / weight / tracking | Classes / source | Usage |
|------|---------------------------|------------------|--------|
| Hero eyebrow | `12px`, uppercase, normal | `text-xs uppercase text-blue-100` + `GradualSpacing` | Single line above hero title |
| Hero heading | `text-3xl` → `md:5xl` → `lg:6xl`, bold, `tracking-tighter` | `Hero.tsx` | Name/value proposition lines |
| Hero accent line | Same scale, `purple-600` | `Hero.tsx` | One emphasized word/phrase in hero |
| Hero body | `text-md` → `lg:text-xl`, `tracking-tighter` | `Hero.tsx` | Personal intro (keep human, not marketing) |
| Section heading | `text-4xl` → `md:5xl`, bold, centered, white | `.heading` in `globals.css` | All section H1s |
| Section highlighted text | Inherits heading size; effect varies | See Section Heading System | One highlighted fragment per section |
| Card title (bento) | `text-base`, normal | `MagicBento.tsx` | Bento card titles |
| Card body (bento) | `text-xs`, `leading-5`, ~90% opacity | `MagicBento.tsx` | Bento descriptions |
| Card title (project) | `1.7rem`–`2.5rem`, bold | `ProjectsCards.tsx` | On-image project name |
| Card body (project) | `0.9rem`–`1.1rem` | `ProjectsCards.tsx` | Tagline on card |
| Card detail (project) | `0.9rem`–`1rem`, medium | Hover panel | Feature lines |
| Navigation | `text-sm` | `floating-navbar.tsx` | Nav links |
| Button text (magic) | `text-sm`, medium | `MagicButton.tsx` | Footer CTA |
| Button text (CV) | `17px`, bold, serif | `CVBUTTON.module.css` | Download CV |
| Button text (project) | `0.9rem`–`1rem`, semibold, uppercase | `ProjectsCards.tsx` | View Project |
| Metadata / legal | `text-sm`–`md:text-base`, light/normal | `Footer.tsx` | Copyright |
| Testimonial quote | `text-sm` → `md:text-lg`, normal | `infinite-moving-cards.tsx` | Quote body |
| Testimonial name | `text-xl`, bold | `infinite-moving-cards.tsx` | Attribution |

**Type scale (normalized target — maps to existing, not a SaaS mega-scale):**

| Step | Size | Use |
|------|------|-----|
| xs | 12px | Eyebrow |
| sm | 14px | Nav, magic button, small UI |
| base | 16px | Bento title, default body |
| lg | 18px | Hero body (md+) |
| xl | 20px | Experience card titles (start) |
| 2xl–3xl | 24–30px | Approach card titles |
| 4xl–5xl | 36–48px | Section headings |
| 6xl | 60px | Hero (lg) |

---

### Spacing

Extracted rhythm; **normalize toward this scale** without changing layout feel.

| Token | Value | Source | Use |
|-------|--------|--------|-----|
| `page-px-mobile` | `1.25rem` (`px-5`) | `page.tsx` | Main horizontal padding |
| `page-px-desktop` | `2.5rem` (`sm:px-10`) | `page.tsx` | ≥ sm breakpoint |
| `section-py` | `5rem` (`py-20`) | Projects, Clients, Experience, Approach | Between major sections |
| `section-header-gap` | `5rem` (`mt-20`) | `RecentProjects.tsx` | Heading → content (projects) |
| `section-header-gap-alt` | `3rem` (`mt-12`) | `WorkExperience.tsx` | Heading → grid (experience) |
| `block-gap-lg` | `2.5rem` (`gap-10`) | Experience grid | Large card grids |
| `block-gap-md` | `2rem` (`gap-8`) | Projects grid | Two-column projects |
| `block-gap-sm` | `1rem` (`gap-4`) | Approach row, company logos | Tighter groups |
| `card-padding-lg` | `p-16` (md) / `p-5` (mobile) | Testimonials | Marquee cards |
| `card-padding-md` | `p-6` | Bento | Bento inner |
| `card-padding-project` | `30px` / `25px`–`40px` | Projects overlay | Prefer `1.875rem` / `2.5rem` when unifying |
| `hero-pt` | `9rem` (`pt-36`) | Hero | Top breathing room |
| `hero-pb` | `5rem` (`pb-20`) | Hero | Bottom |
| `container-max` | `1500px` | `page.tsx` | Content max width |

**Avoid:** stacking redundant horizontal padding (`main` + section inner `px-4/6/8`) — future consolidation only.

---

### Radius

| Token | Value | Use |
|-------|--------|-----|
| `radius-sm` | `6px` | CV button |
| `radius-md` | `8px` (`rounded-lg`) | Magic button, highlight pill, footer rotator chip |
| `radius-lg` | `12px` (`rounded-xl`) | Project card shell |
| `radius-xl` | `16px` (`rounded-2xl`) | Testimonials, project hover panel |
| `radius-2xl` | `24px` (`rounded-3xl` / `rounded-[24px]`) | Approach cards, bento cards |
| `radius-pill` | `9999px` / `20px`–`30px` | Nav, badges, project CTA |
| `radius-full` | `50%` | Social icons, spin borders |

**Rule:** Pills for nav and small chips; **md** for buttons; **xl+** for cards; do not pill-wrap section containers.

---

### Shadows & Glow

Prefer **colored atmospheric glow** over neutral drop shadows.

| Token | Definition | Source | Use |
|-------|------------|--------|-----|
| `glow-nav` | `0px 2px 3px -1px rgba(0,0,0,0.1), …` | `floating-navbar.tsx` | Floating nav only |
| `glow-card-subtle` | `0 0 20px rgba(0,0,0,0.1)` | Experience cards | Resting elevation hint |
| `glow-purple-soft` | `0 4px 20px rgba(46,24,78,0.4), 0 0 30px rgba(132,0,255,0.2)` | Bento hover | About grid |
| `glow-indigo-project` | `shadow-2xl shadow-indigo-500/30` | Project wrapper | Project cards — migrate toward purple family later |
| `glow-depth` | `0 15px 35px rgba(0,0,0,0.2)` | Project card hover | Depth on interaction |
| `glow-border-chase` | Radial blur on moving border | `MovingBorders.tsx` | Experience cards |
| `glow-text` | `drop-shadow` on project titles | `ProjectsCards.tsx` | Legibility on images |

**Avoid:** stacking multiple glows on one element; no full-page neon blobs.

---

## Component System (visual rules)

See `COMPONENT_MAP.md` for file locations and props.

### Button system (variants — do not merge visually yet)

| Variant | Role | Visual | Signature? |
|---------|------|--------|--------------|
| **CV** | Primary hero action | Serif, `#9b3cc7` outline, circle fill hover | **Yes — keep distinctive** |
| **Magic (primary)** | Main CTA (contact) | Conic spinning border, `slate-950` fill, `rounded-lg` | Shared with tutorial lineage — keep but limit count |
| **Project** | Per-card CTA | White pill, uppercase, indigo text | Scoped to project hover panel |
| **Ghost / phase** | Approach phase label | Conic full-radius pill | Decorative control, not global CTA |

Future unification: same **height (~48px)** and **focus behavior**; colors stay variant-specific.

### Card variants

| Variant | Interaction | Notes |
|---------|-------------|--------|
| Bento | Particles, glow border, magnetism | About section only |
| Project | 3D tilt, slide-over panel | Real screenshots — core portfolio proof |
| Testimonial | Marquee, static layout | Content needs personalization |
| Experience | Moving border glow | Icon + title + description |
| Approach | Canvas reveal on hover | Phase colors: emerald / pink-purple / sky |

### Badge

- Project tech tags: `rounded-[20px]`, `bg-white/20`, `px-3 py-1`, `text-[0.8rem]`, backdrop blur.
- Use for **tech stack only**, not generic labels.

### Navigation

- Fixed pill, `bg #000319`, scroll-up reveal, hash links.
- `text-sm`, horizontal `space-x-4`, generous `px-10 py-5`.

### Container

- `max-w-[1500px] w-full` centered inside `main` with page padding.
- Testimonials intentionally break out `w-screen` with edge mask — pattern for **horizontal marquee only**.

### Section

- Standard: `py-20` + centered `.heading` + content block.
- IDs: `#about`, `#projects`, `#testimonials`, `#contact` (experience/approach not in nav).

---

## Section Heading System

**Pattern (preserve):** `[Plain title text]` + `[one highlighted / animated phrase]`.

Formal API (documentation target for future refactor):

```
SectionHeading
  title: string | ReactNode      // e.g. "A small selection of"
  highlighted: string            // e.g. "recent Projects"
  highlightVariant: "gradient" | "shimmer" | "sparkle" | "highlight" | "animated-gradient"
```

| Variant | Implementation | Current section |
|---------|----------------|-----------------|
| `highlight` | Blue→purple pill, width grow in view | Projects (`HighlightText`) |
| `animated-gradient` | `.gradient-animated` pan | Clients (“satisfied clients”) |
| `sparkle` | `SparklesText` purple | Experience (“work experience”) |
| `shimmer` | `TextShimmer` purple/gray | Approach (“approach”), footer copyright |

**Rules:**

- One effect per section heading — already followed.
- Plain text stays **white**, **bold**, **centered** (`.heading`).
- Do not add new effect types without strong reason.

---

## Motion System

### Entrance

| Pattern | Duration / delay | Source | Purpose |
|---------|------------------|--------|---------|
| Staggered letters | `duration` ~0.8s, `delay` 0.025s/char | `Gradual-spacing.tsx` | Hero readability, drama |
| Fade + slide | 0.2–0.95s | Hero CV wrapper, Approach card | Draw attention to CTA / content |
| Highlight grow | ~1.2s easeInOut | `HighlightText` | Section title focus when scrolled into view |
| In-view once | `useInView` `{ once: true }` | Multiple | Avoid repeating entrance noise |

### Hover

| Pattern | Duration | Source | Purpose |
|---------|----------|--------|---------|
| 3D tilt | `perspective(1000px)`, small rotate | `ProjectsCards.tsx` | Explore project |
| Panel slide | 500ms cubic-bezier | Projects hover overlay | Reveal details |
| Border / glow chase | 5–10s+ loop | `MovingBorders.tsx` | Living card edge |
| Canvas fill | Speed 3–5.1 | `CanvasRevealEffect` | Approach phase mood |
| Bento particles / magnetism | GSAP 0.1–0.3s | `MagicBento.tsx` | About section delight |

### Scroll

| Pattern | Behavior | Source |
|---------|----------|--------|
| Nav show/hide | Scroll up → visible; near top → hidden | `floating-navbar.tsx` |
| Progress bar | `scaleX` progress, 180ms linear | `ScrollProgressBar.tsx` |

### Ambient

| Pattern | Timing | Source |
|---------|--------|--------|
| Gradient pan | 6s linear infinite | `.gradient-animated` |
| Text shimmer | 2–3s repeat | `TextShimmerComponent` |
| Sparkles | 0.8s repeat | `SparklesText` |
| Conic spin | 2s linear infinite | Magic button border |

### Principles

- **Duration ranges:** micro 0.1–0.2s (hover state), standard 0.3–0.5s (panels), entrance 0.8–1.2s, ambient 2–8s loops, slow marquee 70s.
- **Easing:** `easeInOut`, `cubic-bezier(0.23, 1, 0.32, 1)` for slides; spring for CV tap and rotator.
- **Reduced motion:** `ScrollProgressBar` checks `prefers-reduced-motion`; bento disables on `<768px`. **Future:** global respect for reduced motion on shimmer/infinite loops.

**Do not** add animation to elements that already compete (hero + bento + marquee + canvas).

---

## Personalization Opportunities

Content flagged as template-like — **do not rewrite in this phase**; replace later with personal voice.

| Item | Location | Why it feels generic | Personal replacement direction |
|------|----------|----------------------|--------------------------------|
| “Dynamic Web Magic with Next.js” | `Hero.tsx` | Common tutorial hero kicker | Short factual line: role, stack, or what you build |
| “Transforming Concepts into Seamless User Experience” | `Hero.tsx` | Stock portfolio headline | One clear sentence about your work or who you help |
| Identical testimonial ×5 | `data/index.ts` | Placeholder “Michael Johnson / AlphaStream” | Real quotes, or remove section until you have them |
| Company logo strip | `data/index.ts` + `Clients.tsx` | Default JS Mastery / tutorial logos | Tools you **actually** use, or “Built with” from your projects |
| “Discover {projectName}” | `ProjectsCards.tsx` | Travel-card template copy | “About this project” or project-specific hook |
| Default `buttonText` “Plan Your Journey” | `ProjectsCards.tsx` | Travel template default | Already overridden to “View Project” — remove dead default when coding |
| Generic metadata description | `layout.tsx` | “Your professional portfolio website” | Your name + role + location/stack one-liner |
| Experience job copy | `data/index.ts` | Reads like template résumé filler | Your real roles, dates, and outcomes |
| Emoji feature bullets | `RecentProjects.tsx` | AI/tutorial list style | Short plain sentences; optional single icon set |
| `Link href="."` contact | `Footer.tsx` | Non-action | `mailto:`, Cal.com, or `#contact` form |
| Nav “Testimonials” vs fake quotes | Nav + data | Trust mismatch | Rename nav or replace content |
| Missing nav icons on mobile | `floating-navbar.tsx` + `data` | Incomplete tutorial port | Add icons or always show labels |

---

## Theme & Dark Mode

- `ThemeProvider` + `.dark` CSS variables in `globals.css` exist but homepage is **hard-coded dark** (`bg-black-100`).
- **Recommendation:** Treat site as dark-only until light surfaces are designed; do not half-enable light theme.

---

## Files of Record

| Concern | Primary files |
|---------|----------------|
| Global tokens & utilities | `app/globals.css` |
| Layout shell | `app/layout.tsx`, `app/page.tsx` |
| Data / copy | `data/index.ts` |
| UI primitives | `components/ui/*` |
| Sections | `components/Hero.tsx`, `BentoGrid.tsx`, `RecentProjects.tsx`, `Clients.tsx`, `WorkExperience.tsx`, `Approach.tsx`, `Footer.tsx` |

---

*Next step after approval: implement tokens in CSS/Tailwind incrementally — not a visual redesign.*
