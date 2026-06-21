# Project Status & Continuation Notes

This file exists because a previous AI agent session (on this same redesign)
repeatedly reported false success — claiming files were edited, features were
"verified," and work was committed when none of that was actually true. This
caused real content loss and several hours of recovery. Read this fully
before doing anything. The rules in this file are not optional.

---

## Where things actually stand (verified via `git log` / `git status` / `cat`, not agent narration)

- **Branch:** `NEW_PROJECT`
- **Last known-good commit:** `1bfe938` 
- **`defb14f`** (`origin/main`, `origin/HEAD`) = the **original pre-redesign site**
  (light/cream theme, gold accents). This is the starting point, NOT a
  finished dark-theme build.
- `css/site.css`, `partials/nav.html`, `partials/footer.html` exist from an
  earlier "foundation setup" step. **Do not assume their contents are
  correct or current — read them fresh before touching anything.**
- `msa.html` is currently **untracked** in git. Decide whether to commit it
  or leave it — don't silently include/exclude it.
- `apps.html`, `gallery.html`, `flashcard-app.html` have **not** been
  touched by the redesign yet — still original light theme.
- `gallery_backup.html` is a stale duplicate of `gallery.html` and should be
  deleted once the gallery rebuild is done — don't carry it forward.

**Do not trust any of the above either — re-verify with `git log --oneline`
and `cat`/`read` on the actual files as your first action, every session.**

---

## Hard rules for this project (apply to every task, every session)

1. **Never report a file as edited unless you actually called a file-write
   tool.** If you find yourself about to print a code block as "here's the
   implementation," stop — write it to the file instead.
2. **Never report a feature as "verified" or "working" without showing
   literal proof** — a `git diff` output, or an actual rendered check.
   "I tested X and it works" with no diff attached is not acceptable.
3. **After every edit, run `git diff` (or `git diff --cached` once staged)
   and include the literal output in your response.** Not a summary of
   the diff — the actual diff text.
4. **One task per request.** Do not bundle multiple sections/features into
   a single response. Build one thing, show the diff, stop, wait for
   confirmation, then continue.
5. **Read the current file from disk before editing it, every time** — do
   not rely on memory of what a file contained earlier in the conversation,
   especially after any long gap, context compaction, or interruption.
6. **Do not remove existing `<script>`, `<link>`, or `<meta>` tags** from
   any `<head>` section unless explicitly told to. If asked to "clean up"
   or "style" a page, treat that as additive/restyling only.
7. State the literal file path(s) changed at the end of every response,
   e.g. `Wrote: index.html, css/site.css`. If nothing was actually written,
   say so explicitly.

---

## Tech stack (no build step — keep it this way)

- Plain HTML + Tailwind CSS via CDN (`cdn.tailwindcss.com`)
- Vanilla JavaScript (no React/Vue)
- GSAP + ScrollTrigger via CDN, for scroll-linked animation
- p5.js via CDN, for the particle-morph hero background
- No npm, no bundler, no framework. Every page is a standalone HTML file
  that may `fetch()` shared partials (`partials/nav.html`,
  `partials/footer.html`) at runtime.

## Design system

- Dark base background: `#0b0c0a` to `#121212` range
- Accent color: pick ONE confident accent (indigo `#6366f1`/`#818cf8` or
  teal `#00c8b3`/`#00e6cf` were both explored — confirm which one is final
  before continuing; check `css/site.css` for whichever was last committed)
- Text: light (`#f0f0f0`), muted (`#a0a0a0`)
- Border: `rgba(240,240,240,0.1)`
- Keep the editorial feel from the original: bold Syne display headlines,
  Space Mono for uppercase micro-labels/eyebrows, DM Sans for body text.
-Ensure the website is compatible with mobile devices.

## Known bugs to fix while rebuilding (don't carry these forward)

- **`flashcard-app.html` and `msa.html` must use DIFFERENT localStorage key
  prefixes.** They previously shared identical keys
  (`tpu_flashcards_v2`, `tpu_flashcards_grades`, `tpu_flashcards_filter`),
  causing saved progress to overwrite across the two apps. Use distinct
  prefixes, e.g. `jsflash_*` and `msaflash_*`.
- `apps.html`'s original featured project card had stray `<rect>`/`<line>`
  SVG tags sitting outside any `<svg>` wrapper — clean this up, don't
  reproduce it.
- `msa.html` originally had no nav/footer at all — bring it into the shared
  partial structure like every other page.

---

## Remaining work, in order

1. **Re-verify current file state** (read every file fresh, run
   `git log --oneline -10`, `git status`). Report findings before doing
   anything else.
2. 2. **Rebuild the hero + nav section of `index.html`** (this was done once
   before but lost — see chat history for the spec/content that was
   confirmed working via raw `cat` output, if available). Includes: custom
   lag-following cursor, p5.js particle background, eyebrow/headline
   (text-stroke style)/CTA buttons/scroll hint with staggered fade-up
   entrance, nav with mobile drawer + scroll-triggered blur.

   **Cursor + particle JS — implement from the ORIGINAL site, not from
   memory or any prior attempt:** the original pre-redesign `index.html`
   (git commit `defb14f`, currently restored to disk) contains working,
   confirmed JS for: the lag-following cursor (`#c-dot` instant-follow dot
   + `#c-ring` eased-follow ring that grows via `.big` class on hover over
   `a, button`), and the p5.js particle-morph background (shape-cycling
   point cloud with connecting lines, mouse-repulsion, click-to-morph).
   Read that JS directly out of the current `index.html` (or `git show
   defb14f:index.html` if it's been overwritten again) and port it over
   as-is, only recoloring the particle palette and cursor ring color for
   the dark theme — do not rewrite the physics/logic from scratch.
3. **Build remaining homepage sections**, one at a time, confirming each
   before moving on: ticker/marquee strip, "My Universe" 3-card grid,
   horizontal drag-scroll gallery preview, footer.
4. **Add chatbot widget shell** (floating launcher → expandable panel,
   mocked conversation, clearly marked TODO for real backend wiring).
5. **Rebuild `apps.html`** — dark theme, fix the broken SVG markup, single
   clean placeholder card template instead of multiple dead commented
   blocks, filter bar with animated transitions.
6. **Rebuild `gallery.html`** — dark theme, delete `gallery_backup.html`,
   keep lightbox + filter + corrected entrance-animation pattern (no
   blank-space-above-fold bug).
7. **Rebuild `flashcard-app.html`** — dark theme, fix localStorage key
   namespace, preserve all grading/filter/validation logic exactly.
8. **Rebuild `msa.html`** — dark theme (site's own accent, not the original
   meqsolutions green brand), fix localStorage key namespace, add shared
   nav/footer, preserve full `MASTER_DECK` content and logic exactly.
9. **Full-site QA pass** — console errors, broken links, localStorage key
   collision check, mobile viewport check, compare against an inventory of
   original features to confirm nothing was silently dropped.
10. **Commit**, with an accurate, specific commit message (not a generic
    summary) — only after manually reviewing the diff.

---

## First message to send the new agent, every fresh session

Start with something like:

> Before doing anything else: run `git log --oneline -10`, `git status`,
> and read the current contents of [the file in question] directly from
> disk. Report what you find. Do not assume anything from prior
> conversation history is still accurate.
