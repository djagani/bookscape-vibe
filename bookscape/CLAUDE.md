@AGENTS.md

# BookScape — CLAUDE.md
> This file is the single source of truth for all design, architecture, and implementation decisions.
> Read this entire file before writing any code or making any UI decisions.

---

## 1. Project Overview

BookScape transforms books into immersive cinematic "worlds." The experience is not a reading app or book tracker — it is an atmospheric world you *enter*. Every UI decision must serve immersion first.

**Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase, 21st.dev components

---

## 2. The Non-Negotiable Design Vision

### Overall Aesthetic
- **Dark, cinematic, glass-morphism UI** throughout — no light mode, no white backgrounds
- Full-bleed atmospheric visuals behind every major view
- All UI panels float as frosted glass layers over the background
- The feeling: you are *inside* the book's world, not looking at a webpage about it
- Reference: Yoru app (yoru-sandy.vercel.app) — full-bleed background, frosted glass controls at bottom, minimal floating UI

### Glass UI Rules (apply everywhere)
```css
/* Standard glass panel */
background: rgba(10, 10, 15, 0.55);
backdrop-filter: blur(18px) saturate(1.4);
-webkit-backdrop-filter: blur(18px) saturate(1.4);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 16px;

/* Lighter glass for smaller elements */
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.06);

/* Glass hover state */
background: rgba(255, 255, 255, 0.09);
border-color: rgba(255, 255, 255, 0.14);
```

### Global Color System
```css
:root {
  --bg-void: #05050a;           /* deepest background */
  --glass-dark: rgba(10, 10, 15, 0.55);
  --glass-light: rgba(255,255,255,0.05);
  --glass-border: rgba(255,255,255,0.08);
  --glass-border-hover: rgba(255,255,255,0.14);
  --text-primary: rgba(255,255,255,0.92);
  --text-secondary: rgba(255,255,255,0.55);
  --text-muted: rgba(255,255,255,0.3);
  --accent-white: rgba(255,255,255,0.85);
}
```

---

## 3. Genre Theme System

### Genre Definitions

#### Romance
- **Visual mood:** Warm cherry blossom light rays, rose garden cathedral, golden soft sunlight through pink petals, stained glass light, doves in flight
- **Color palette:** `#f9e4e8` rose blush, `#c8956b` warm amber, `#7a3b3b` deep rose, `#fff0ec` cream
- **CSS accent vars:** `--theme-primary: #c8956b; --theme-glow: rgba(200,149,107,0.3);`
- **Font pairing:** Display — `Cormorant Garamond` (italic, 500); Body — `Lora`
- **Overlay:** `linear-gradient(to top, rgba(80,20,20,0.7) 0%, rgba(120,60,40,0.2) 60%, transparent 100%)`
- **Ambient sound:** Soft piano, string quartet, birdsong layer

#### Fantasy
- **Visual mood:** Elven castle on cliffside, waterfalls, golden-lit towers reflected in teal lake, lush ancient forests
- **Color palette:** `#0d1f2d` deep midnight, `#2a9d8f` teal, `#e9c46a` gold, `#a8dadc` silver-blue
- **CSS accent vars:** `--theme-primary: #e9c46a; --theme-glow: rgba(233,196,106,0.25);`
- **Font pairing:** Display — `Cinzel`; Body — `Crimson Text`
- **Overlay:** `linear-gradient(to top, rgba(5,15,30,0.75) 0%, rgba(10,30,50,0.3) 60%, transparent 100%)`
- **Ambient sound:** Celtic harp, orchestral swells, wind through trees

#### Thriller / Mystery
- **Visual mood:** Gothic moonlit cathedral, rain-slicked stone, bats against full moon, dramatic storm clouds, single lantern in darkness
- **Color palette:** `#0a0a12` near-black, `#1a1a2e` dark navy, `#e63946` blood red, `#adb5bd` cold gray
- **CSS accent vars:** `--theme-primary: #e63946; --theme-glow: rgba(230,57,70,0.25);`
- **Font pairing:** Display — `Playfair Display` (bold); Body — `Source Serif 4`
- **Overlay:** `linear-gradient(to top, rgba(5,5,15,0.85) 0%, rgba(10,10,25,0.5) 60%, transparent 100%)`
- **Ambient sound:** Low cello drones, distant thunder, staccato strings

#### Dystopian
- **Visual mood:** Neon-soaked megacity in acid rain, toxic green fog, overcrowded streets with billboard propaganda, cyberpunk urban decay
- **Color palette:** `#080c0a` near-black green, `#39ff14` toxic neon green, `#ff6b00` warning orange, `#1a1a1a` concrete
- **CSS accent vars:** `--theme-primary: #39ff14; --theme-glow: rgba(57,255,20,0.2);`
- **Font pairing:** Display — `Share Tech Mono` or `Orbitron`; Body — `IBM Plex Mono`
- **Overlay:** `linear-gradient(to top, rgba(0,10,0,0.88) 0%, rgba(0,15,5,0.5) 60%, transparent 100%)`
- **Ambient sound:** Industrial drones, distant sirens, glitchy electronic hum

#### Historical / Mythological
- **Visual mood:** Oil painting golden-hour London Thames, horse carriages, gaslit streets, impressionist brushstroke quality, amber and ochre warmth
- **Color palette:** `#1a0f00` dark sepia, `#c9a84c` aged gold, `#8b4513` rich brown, `#f5deb3` parchment
- **CSS accent vars:** `--theme-primary: #c9a84c; --theme-glow: rgba(201,168,76,0.3);`
- **Font pairing:** Display — `IM Fell English` (italic); Body — `Spectral`
- **Overlay:** `linear-gradient(to top, rgba(20,10,0,0.8) 0%, rgba(40,20,5,0.3) 60%, transparent 100%)`
- **Ambient sound:** Period instruments, orchestral fanfare, quill-on-parchment ambiance

#### Melancholic
- **Visual mood:** Lone figure in rain at a crumbling cafe, birds scattering over a foggy city, a single warm light in cold darkness, wet cobblestones
- **Color palette:** `#0d1117` dark slate, `#4a5568` fog gray, `#7c8fa6` muted blue, `#d4a574` faded amber
- **CSS accent vars:** `--theme-primary: #7c8fa6; --theme-glow: rgba(124,143,166,0.2);`
- **Font pairing:** Display — `Libre Baskerville` (italic); Body — `Merriweather`
- **Overlay:** `linear-gradient(to top, rgba(5,8,12,0.85) 0%, rgba(10,15,20,0.45) 60%, transparent 100%)`
- **Ambient sound:** Slow piano, soft rain, distant cello

---

## 4. Component Library

### Primary: 21st.dev
**Always check 21st.dev first before building any UI component from scratch.**

Use 21st.dev components for: buttons, inputs, modals, cards, navigation, dropdowns, tabs, badges, tooltips, loaders.

When importing from 21st.dev, always adapt to use the BookScape glass aesthetic:
- Override background colors to use glass vars
- Override border colors to `--glass-border`
- Override text colors to `--text-primary` / `--text-secondary`
- Keep the component's structural logic, replace its surface styling

### Component Rules

**Buttons**
```tsx
// Primary action button
className="px-6 py-3 rounded-xl font-medium text-sm
           bg-white/10 hover:bg-white/16 active:bg-white/8
           border border-white/10 hover:border-white/20
           backdrop-blur-md text-white/90
           transition-all duration-200"

// Accent button (theme-colored)
className="px-6 py-3 rounded-xl font-medium text-sm
           border border-[var(--theme-primary)]/30
           bg-[var(--theme-primary)]/10
           hover:bg-[var(--theme-primary)]/20
           text-[var(--theme-primary)]
           transition-all duration-200"
```

**Input fields**
```tsx
className="w-full px-4 py-3 rounded-xl
           bg-white/5 border border-white/8
           hover:border-white/14 focus:border-white/25
           text-white/90 placeholder-white/30
           backdrop-blur-sm outline-none
           transition-all duration-200"
```

**Cards / Panels**
```tsx
className="rounded-2xl p-6
           bg-black/55 backdrop-blur-[18px]
           border border-white/8
           hover:border-white/14
           transition-all duration-300"
```

**Navbar**
```tsx
// Floating, not full-width bar
className="fixed top-4 left-1/2 -translate-x-1/2
           flex items-center gap-6 px-6 py-3
           rounded-2xl backdrop-blur-xl
           bg-black/50 border border-white/8
           z-50"
```

---

## 5. Page-by-Page Specs

### Landing / Search Page
- Full-bleed background: dark gradient (`#05050a` → `#0d0d1a`) with subtle noise texture overlay
- Centered layout, generous vertical space
- Large display headline, muted subheadline
- Search bar: glass input, prominent, centered
- Book results: horizontal scroll row of glass cards with cover image, title, author
- Each card: hover lifts 4px with subtle glow matching theme

### World Generation (loading state)
- Background begins as dark base
- Animated particle system or CSS shimmer while generating
- Progress text fades in: "Mapping the world...", "Feeling the mood...", "Opening the portal..."
- Do NOT use a spinner — use atmospheric loading

### World View (the hero moment)
- **Full-bleed background** — genre image or video loop fills 100vw 100vh, object-fit cover
- Dark overlay gradient from bottom (see genre specs above)
- All UI floats over this as glass panels
- Layout: content centered, editorial width (~680px max), vertically stacked
- Book title: large display font in genre's display face, white/90
- Mood badge: pill with `--theme-primary` border and tint
- Themes/motifs: small glass pills, horizontal wrap
- Summary: body font, white/70, generous line-height 1.8
- Soundtrack section: glass panel at bottom with music genre keywords + ambient sound player
- Save button: pinned bottom right, glass style
- **Entry animation:** background fades in 800ms, then content stagger-reveals top-to-bottom at 100ms intervals

### Library Page
- Dark base background (no book-specific theme here)
- Grid: 3 columns responsive, gap 16px
- Each world card shows: cover thumbnail, book title, mood badge, mini color swatch strip of the world's palette
- Hover: card lifts, thumbnail zooms slightly inside clip

---

## 6. Typography System

Load all fonts from Google Fonts. Each genre uses its own pairing — defined in genre specs above.

**Base (non-themed) typography:**
- UI labels, nav, metadata: `font-family: 'Inter', sans-serif` — the only place Inter is allowed
- Default body (pre-world): `font-family: 'Lora', serif`

**Apply genre fonts when theme is active:**
```ts
// In ThemeWrapper — apply data attribute, target with CSS
document.body.setAttribute('data-theme', genre)
```
```css
[data-theme="romance"] .display-text { font-family: 'Cormorant Garamond', serif; }
[data-theme="dystopian"] .display-text { font-family: 'Orbitron', sans-serif; }
/* etc */
```

---

## 7. Animation Principles

- **Theme transition:** When world loads, `transition: background 800ms ease, color 600ms ease` on body
- **Stagger reveals:** Content blocks animate in with `animation-delay: 100ms, 200ms, 300ms...` using `fadeInUp` keyframe (translateY 16px → 0, opacity 0 → 1, 400ms ease)
- **Glass hover:** All interactive glass elements use `transition: all 200ms ease`
- **No looping animations** on library/search pages — motion is reserved for the world view moment
- **Reduced motion:** Respect `prefers-reduced-motion` — wrap all decorative animations in media query

---

## 8. File & Folder Conventions

```
/app
  /page.tsx              ← landing + search
  /world/[id]/page.tsx   ← world view
  /library/page.tsx      ← saved worlds
  /api/generate-world/   ← AI classification + world generation
  /api/search-books/     ← Google Books API
  /api/save-world/       ← Supabase write
  /api/get-worlds/       ← Supabase read

/components
  /ui/                   ← 21st.dev + custom base components
  BookSearch.tsx
  BookCard.tsx
  WorldView.tsx
  ThemeWrapper.tsx
  LibraryGrid.tsx
  WorldCard.tsx
  AmbientPlayer.tsx
  Navbar.tsx
  GenerationLoader.tsx

/lib
  /themes.ts             ← genre definitions, asset paths, CSS vars
  /worldGen.ts           ← generation logic
  /supabase.ts

/public/themes/          ← curated images and video loops per genre
```

---

## 9. World Generation Logic

The AI call should return a **strict typed object** — no freeform text:

```ts
type BookWorld = {
  genre: 'romance' | 'fantasy' | 'thriller' | 'dystopian' | 'historical' | 'melancholic'
  mood: string           // 2-4 words, e.g. "wistful and longing"
  themes: string[]       // 3-5 items
  motifs: string[]       // 3-5 items
  summary: string        // 3-4 sentences, atmospheric, second-person ("You enter a world where...")
  soundtrack: {
    genre: string
    keywords: string[]
    ambientSuggestion: string
  }
  visualTheme: {
    background: string   // CSS color
    accent: string       // CSS color
    text: string         // CSS color
  }
}
```

Prompt the AI to classify genre strictly into one of the 6 options. Do not allow freeform genre names.

---

## 10. UX Principles — Non-Negotiable

1. **Every state has a visual:** No blank screens. Loading, error, empty library — all have designed states.
2. **One primary action per screen:** Search on landing, Generate on book detail, Save on world view.
3. **Feedback is instant:** Button press → immediate visual feedback (scale 0.97, opacity change) before async resolves.
4. **Errors are human:** Never show raw API errors. "This world couldn't be reached. Try another book."
5. **Mobile is not an afterthought:** All glass panels must work at 375px width. Test every component.
6. **Accessibility:** All interactive elements have focus-visible styles. Color is never the only indicator. ARIA labels on icon-only buttons.
7. **Performance:** Images use `next/image` with blur placeholder. Video loops have `preload="none"` until world is entered.

---

## 11. What NOT to Do

- Do NOT use white or light backgrounds anywhere
- Do NOT use Unsplash API or AI image generation for world backgrounds — use curated asset pool
- Do NOT build generic-looking components — check 21st.dev first
- Do NOT use Inter for display text or headings
- Do NOT add looping animations outside the world view
- Do NOT show raw loading spinners — design the loading state
- Do NOT hardcode colors — always use CSS variables
- Do NOT skip the ThemeWrapper — every genre must apply its full visual identity

## LANDING PAGE — Additional requirements

### Hero background
- Use a full-bleed static background image for the landing page (before any book is searched)
- Source a dark, atmospheric, painterly/illustrated image from Unsplash using this query: "dark mystical forest night painting atmospheric"
- Apply a dark overlay: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.75) 100%)
- The image should cover 100vh 100vw, object-fit cover, fixed or scroll

### App name typography
- Font: "Cinzel Decorative" from Google Fonts (import weight 400 and 700)
- "BookScape" — display large, centered, white, font-size clamp(3rem, 8vw, 7rem)
- Letter-spacing: 0.05em
- Apply a very subtle text-shadow: 0 0 60px rgba(255,255,255,0.15) — gives it a soft glow without looking cheap
- Tagline below: "Cormorant Garamond" italic, white/60, font-size 1.2rem, letter-spacing 0.02em
- Tagline text: "Discover the world within every book"

### Search bar
- Single unified glass pill: input + icon button combined
- Width: min(680px, 90vw), centered
- Height: 56px
- bg: rgba(255,255,255,0.08), backdrop-blur-xl
- border: 1px solid rgba(255,255,255,0.15)
- border-radius: 999px (full pill)
- On focus: border-color rgba(255,255,255,0.35), bg rgba(255,255,255,0.12)
- Placeholder: "Search for a book, author, or quote..." white/35
- Search icon button: right side of pill, no border, bg transparent, icon white/60, hover white/90
- No separate Search button below — the icon inside the pill IS the submit button
- Press Enter also submits

### Layout
- Vertically centered in viewport: flex flex-col items-center justify-center min-h-screen gap-8
- Order: AppName → Tagline → SearchBar → (results appear below search bar)
- No navbar on the landing page — keep it minimal and immersive like LofiLab
- Add navbar only after user is searching/inside the app

### Subtle animation
- On page load: AppName fades in (opacity 0 → 1, translateY 12px → 0, 800ms ease)
- Tagline fades in with 200ms delay
- Search bar fades in with 400ms delay
- Use CSS keyframes, respect prefers-reduced-motion

Read CLAUDE.md fully before starting.

I want a complete UI overhaul across all pages. The target aesthetic is Yoru (yoru-sandy.vercel.app) — full-bleed atmospheric backgrounds, frosted glass panels floating over them, minimal chrome, cinematic immersion. Here's what to fix on each page:

---

## LANDING PAGE
- Add a full-bleed background: deep dark base (#05050a) with a very subtle animated radial gradient that slowly shifts — creates atmosphere without being distracting
- Add a noise/grain texture overlay (CSS, not an image) for depth
- Combine the search input and button into ONE element: input on the left, search icon button on the right, all inside a single glass pill (backdrop-blur-xl, bg-white/5, border border-white/8)
- The headline font should be a display serif (Cormorant Garamond or Playfair Display), large, elegant — not bold sans
- Subtitle should be white/40, lighter weight
- Navbar: make it a floating centered pill (not full-width bar) — fixed top-4, centered, backdrop-blur-xl, bg-black/40, border border-white/8, rounded-2xl
- Book search results: horizontal scroll row of glass cards below the search bar, each card has cover image (use Google Books cover), title, author — glass background, hover lifts

### Hero background
- Use a full-bleed static background image for the landing page (before any book is searched)
- Source a dark, atmospheric, painterly/illustrated image from Unsplash using this query: "dark mystical forest night painting atmospheric"
- Apply a dark overlay: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.75) 100%)
- The image should cover 100vh 100vw, object-fit cover, fixed or scroll

### App name typography
- Font: "Cinzel Decorative" from Google Fonts (import weight 400 and 700)
- "BookScape" — display large, centered, white, font-size clamp(3rem, 8vw, 7rem)
- Letter-spacing: 0.05em
- Apply a very subtle text-shadow: 0 0 60px rgba(255,255,255,0.15) — gives it a soft glow without looking cheap
- Tagline below: "Cormorant Garamond" italic, white/60, font-size 1.2rem, letter-spacing 0.02em
- Tagline text: "Discover the world within every book"

### Search bar
- Single unified glass pill: input + icon button combined
- Width: min(680px, 90vw), centered
- Height: 56px
- bg: rgba(255,255,255,0.08), backdrop-blur-xl
- border: 1px solid rgba(255,255,255,0.15)
- border-radius: 999px (full pill)
- On focus: border-color rgba(255,255,255,0.35), bg rgba(255,255,255,0.12)
- Placeholder: "Search for a book, author, or quote..." white/35
- Search icon button: right side of pill, no border, bg transparent, icon white/60, hover white/90
- No separate Search button below — the icon inside the pill IS the submit button
- Press Enter also submits

### Layout
- Vertically centered in viewport: flex flex-col items-center justify-center min-h-screen gap-8
- Order: AppName → Tagline → SearchBar → (results appear below search bar)
- No navbar on the landing page — keep it minimal and immersive like LofiLab
- Add navbar only after user is searching/inside the app

### Subtle animation
- On page load: AppName fades in (opacity 0 → 1, translateY 12px → 0, 800ms ease)
- Tagline fades in with 200ms delay
- Search bar fades in with 400ms delay
- Use CSS keyframes, respect prefers-reduced-motion

## LIBRARY PAGE  
- Full-bleed dark background matching landing page (consistent base)
- Each world card MUST show the book cover image from Google Books API — no icons
- Card: glass style (bg-black/40 backdrop-blur-xl border border-white/8 rounded-2xl)
- Bottom strip of each card shows a thin color swatch bar using that genre's accent color (e.g. gold for fantasy, rose for romance)
- Genre badge: small pill using theme accent color with matching tint background
- "Enter World" button: glass style inside the card, not a solid dark block
- 3-column grid, responsive to 1-col on mobile

## WORLD VIEW (the enter world page — both the cinematic entry and the info page)
- The cinematic background image from Unsplash/Grok stays as-is for now
- The info panel (book title, themes, emotions, atmosphere, interpretation) must be a glass panel:
  - bg: rgba(0, 0, 0, 0.45)
  - backdrop-filter: blur(20px) saturate(1.3)
  - border: 1px solid rgba(255, 255, 255, 0.10)
  - border-radius: 20px
  - NOT a solid black box
- Accessibility: all text must meet WCAG AA contrast (4.5:1 minimum)
  - Main title: white (rgba(255,255,255,0.95)) — always passes on dark glass
  - Author: rgba(255,255,255,0.70)
  - Section labels (Themes, Emotions etc): rgba(255,255,255,0.50), uppercase, 11px, letter-spacing 0.1em
  - Body text: rgba(255,255,255,0.85) — passes AA on the dark glass bg
  - Theme/motif pills: bg rgba(255,255,255,0.08), border rgba(255,255,255,0.12), text rgba(255,255,255,0.80)
- Remove the solid emoji icons (✨🎯) — replace with small colored dots matching genre accent color
- "Save This World" and "Enter World" buttons: glass style — bg rgba(255,255,255,0.08), border rgba(255,255,255,0.15), hover bg rgba(255,255,255,0.14)
- Back button: integrate into the floating navbar pill, not a separate floating block in the corner
- Volume/mute button: small glass pill, fixed bottom-right
- The gradient background overlay on the world view: should be a strong dark vignette from the bottom, not just a flat teal/green gradient. Use: linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.50) 40%, rgba(0,0,0,0.10) 100%)

## NAVBAR (global)
- Replace the current rectangular bordered navbar with a floating centered pill
- Fixed, top-4, left-50%, transform -translate-x-1/2
- backdrop-blur-xl, bg-black/40, border border-white/8, rounded-2xl
- px-6 py-3, flex items-center gap-8
- BookScape logo left, nav links center-right
- On world view pages, show a Back arrow as the leftmost item in this same pill — don't use a separate Back button

## FONTS
- Load from Google Fonts: Cormorant Garamond (display), Lora (body)
- Apply Cormorant Garamond to all page headlines and book titles
- Keep Inter only for UI labels, nav items, badges

## GENERAL
- Every page must have the same dark atmospheric base background — no pure black, no light backgrounds
- All interactive elements: transition-all duration-200
- Focus-visible styles on all buttons and inputs (outline: 2px solid rgba(255,255,255,0.4), outline-offset: 2px)
- No solid-color buttons anywhere — everything is glass or ghost style




Read CLAUDE.md fully before starting.

## PART 1: Smarter Image Generation for Book Worlds

The current Unsplash/Grok image generation is too generic — searching "Harry Potter" 
just returns random castle photos. I want a system that generates highly specific, 
atmospheric image prompts based on the actual book world data we already have.

### New image prompt generation system

In /lib/worldGen.ts, create a function called `buildImagePrompt(world: BookWorld): string`

This function takes the generated world object and constructs a detailed visual prompt 
using ALL available data:

```ts
function buildImagePrompt(world: BookWorld): string {
  // Combine: genre visual mood + themes + motifs + mood words + atmosphere
  // Output: a single detailed string optimized for image search or AI generation
}
```

Example output for Harry Potter (Fantasy):
"ancient magical castle at twilight, glowing amber windows, enchanted forest, 
floating candles, mystical starlit sky, painterly illustration style, 
cinematic lighting, teal and gold color palette, wonder and discovery atmosphere"

Example output for 1984 (Dystopian):
"brutalist concrete megacity at night, toxic green neon signs, acid rain, 
surveillance cameras on every wall, oppressive fog, lone figure in crowd, 
cinematic noir, cold industrial color palette"

### Rules for buildImagePrompt:
- Always include: genre visual keywords + 2-3 theme words + mood + color palette 
  from the genre definition in CLAUDE.md + art style ("painterly", "cinematic", 
  "atmospheric", "moody illustration")
- Never include: the book title, author name, or character names 
  (copyright issues with image APIs)
- Always end with: lighting style + color palette + one emotion word
- Keep under 120 characters for Unsplash compatibility, 
  full length for AI generation

### Dual image source strategy

Try in this order:

1. **Unsplash** (free, fast) — use the constructed prompt as the search query
   - Use collections: nature, architecture, dark, moody
   - Filter: orientation=landscape, min resolution 1920x1080
   - If result relevance score < threshold → fall back to option 2

2. **Pollinations.ai** (free AI image generation, no API key needed)
   - Endpoint: https://image.pollinations.ai/prompt/{encodedPrompt}
   - Add to prompt: "?width=1920&height=1080&nologo=true&enhance=true"
   - This generates actual AI images from the detailed prompt
   - Use this as the primary fallback when Unsplash is too generic
   - Show a loading state while it generates (it takes 3-8 seconds)

In /api/generate-world/route.ts:
- After generating the world object, call buildImagePrompt()
- Try Unsplash first with the constructed prompt
- Return imageUrl in the world response
- Store imageUrl in the saved_worlds table in Supabase

---

## PART 2: World View Layout Redesign

The current layout stacks everything vertically in a centered box. 
Redesign it as a cinematic split layout:

### Layout structure
- Full viewport: position relative, overflow hidden
- Background image: absolute, full bleed, object-fit cover, with genre overlay gradient
- Content layer: absolute inset-0, display grid, grid-template-columns: 1fr 420px, 
  align-items: end, padding: 2rem 2.5rem, gap: 2rem

### Left side (1fr) — cinematic space
- Mostly empty — lets the background breathe
- Bottom-left: book title (large, display font, genre-specific), 
  author name below it, genre badge
- This text sits directly over the background with a subtle 
  text-shadow for legibility
- Title: font-size clamp(2rem, 4vw, 3.5rem), Cormorant Garamond, white/95
- Author: white/60, Lora italic
- Genre badge: glass pill with genre accent color

### Right side (420px) — glass info panel
Fixed height: calc(100vh - 4rem), scrollable inside if content overflows

Glass panel styles:
  background: rgba(0, 0, 0, 0.45)
  backdrop-filter: blur(24px) saturate(1.4)
  -webkit-backdrop-filter: blur(24px) saturate(1.4)
  border: 1px solid rgba(255, 255, 255, 0.10)
  border-radius: 20px
  padding: 2rem
  display: flex, flex-direction: column, gap: 1.5rem
  overflow-y: auto
  scrollbar-width: none (hide scrollbar visually)

### Inside the right glass panel (top to bottom):

1. Mood line
   - Label: "MOOD" — 10px, white/40, uppercase, letter-spacing 0.12em
   - Value: genre accent color, 15px, font-weight 500

2. Themes
   - Label: "THEMES" — same label style
   - Pills: flex wrap, gap 6px
   - Each pill: bg rgba(255,255,255,0.07), border rgba(255,255,255,0.10), 
     text white/75, font-size 12px, px-3 py-1, rounded-full

3. Motifs  
   - Same structure as themes
   - Pills use genre accent color at 15% opacity as background

4. Atmosphere / Summary
   - Label: "ATMOSPHERE"
   - Text: white/80, Lora italic, font-size 14px, line-height 1.8

5. Interpretation
   - Label: "THE WORLD"
   - Text: white/85, Lora, font-size 14px, line-height 1.8

6. Soundtrack
   - Label: "SOUNDTRACK"  
   - Genre keyword pills in a row
   - Small ambient player if audio file exists for this genre theme

7. Action buttons at the bottom of the panel
   - "Save This World" — glass button full width
   - "Enter World" (if there's a deeper experience) — accent-tinted glass button

### Accessibility on the glass panel
All text must meet WCAG AA (4.5:1 contrast ratio on the dark glass bg):
- white/95 = passes (contrast ~18:1)
- white/85 = passes (~12:1)  
- white/75 = passes (~8:1)
- white/60 = passes on dark glass (~5.5:1) — use only for secondary text
- white/40 = use only for labels/metadata, never for readable body text
- Genre accent colors: if used for text, ensure they are light enough — 
  test each one, darken background or lighten text if needed

### Mobile (below 768px)
- Switch to single column
- Background image top half (50vh), glass panel below
- Panel: border-radius top only (20px 20px 0 0), full width
- Title overlays the image at the bottom of the image half

### Transition animation
When the world loads:
- Background image fades in: opacity 0 → 1, 800ms ease
- Left side title: slides up from 20px, 600ms, delay 400ms
- Right panel: slides in from right (translateX 30px → 0), 
  opacity 0 → 1, 600ms, delay 300ms
- Panel content items stagger: each section fades in with 80ms delay between them