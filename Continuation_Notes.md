# Project Status & Continuation Notes

## Hard rules for this project
1. **Never report a file as edited unless you actually called a file-write tool.** 2. **Never report a feature as "verified" or "working" without showing literal proof** — a `git diff` output.
3. **After every edit, run `git diff` and include the literal output.**
4. **One task per request.** 5. **Read the current file from disk before editing it, every time.** 6. **Do not remove existing `<script>`, `<link>`, or `<meta>` tags** unless explicitly told to.
7. **State the literal file path(s) changed at the end of every response.**

## Design & Technical Standards
- **Frameworks:** Plain HTML + Tailwind CSS (CDN), Vanilla JS (no frameworks/bundlers).
- **Navigation:** Apple-style global navigation. 
    - **Mega-Menu:** Must feature expansive dropdown panels with structured content/icons.
    - **Behavior:** Blurred background (`backdrop-filter`), accessible ARIA patterns (`aria-expanded`, `aria-hidden`), focus trapping, and mobile drawer support.
- **Chatbot:** - **Positioning:** Sticky (viewport-fixed, bottom-right).
    - **State:** Stateless (no `sessionStorage` for now; resets on page reload).
- **Code Standards:** Semantic HTML5, WCAG 2.1 AA accessibility compliance, and performance-first loading to minimize layout shifts.

## Remaining work
1. **Re-verify current file state:** ✅ DONE — verified via `git log`, `git status`, `read` on all target files.
2. **Rebuild Navigation:** ✅ DONE.
   - `partials/nav.html`: Apple-style navbar with mega-menu panels, mobile drawer, backdrop blur, ARIA attributes.
   - `js/nav.js`: Deferred init (MutationObserver), mega-menu (click + hover), drawer toggle, focus trap, Escape key, event delegation.
   - `index.html`: References `js/nav.js`, inline `<style>` for mega-menu opacity transitions.
   - **Async loading fix:** Mobile accordion triggers and drawer link handlers now use event delegation on `#nav-mobile-drawer` instead of direct `querySelectorAll` binding. This ensures triggers work when `partials/nav.html` is injected asynchronously via `fetch()`.
   - **Chevron rotation:** Updated from `rotate-90` to `rotate-180` for Apple-style upward chevron when expanded.
3. **Chatbot Widget:** Build sticky floating shell (expandable panel, chat history UI, input area).
4. **Hero & Assets:** Port p5.js particle background and custom cursor from `defb14f`.
5. **Core Pages:** Rebuild `index.html`, `apps.html`, `gallery.html`, `flashcard-app.html`, and `msa.html` (dark theme, fix localStorage key namespaces as per original rules).
6. **Final QA:** Console check, mobile view, accessibility audit.

---

## First message to send the new agent
Before doing anything else: run `git log --oneline -10`, `git status`, and read the current contents of [the file in question] directly from disk. Report what you find. Do not assume anything from prior conversation history is still accurate.