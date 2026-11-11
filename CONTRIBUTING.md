# Contributing to X Toolkit

Thanks for your interest in improving X Toolkit! This project is a **single-file
Tampermonkey/Violentmonkey userscript** (`x-toolkit.user.js`) with **no build
step**. Please read this before opening a pull request.

## How the code is organised

Everything hangs off one global namespace, `window.XTK`, assembled from a series
of IIFE modules that run top-to-bottom in one file:

| Order | Module | Attaches |
|------:|--------|----------|
| 1 | i18n language packs | `TK.LANGS`, `TK.LANG`, `TK.t()`, `TK.setLang()` |
| 2 | Core runtime | `TK.GM`, `TK.settings`, `TK.toast`, `TK.tip`, `TK.X` (DOM helpers), `TK.onMutate/onNavigate/waitFor/realClick`, `TK.LABELS` |
| 3 | Settings panel | `TK.panel` |
| 4 | Clean & Optimize | `TK.clean` |
| 5 | Emoji Fix | `TK.emoji` |
| 6 | Thread Reader | `TK.thread` |
| 7 | Quick Block | `TK.block` |
| 8 | Media Downloader | `TK.media` |
| 9 | Export Markdown | `TK.markdown` |
| 10 | Entry point | boots enabled features, re-runs on DOM change / SPA navigation |

A new feature = a new IIFE that registers `TK.<name> = { id, apply() }`, plus one
entry in the `ORDER` / `SWITCH` tables in the entry-point module.

## Setting up a dev copy

1. Install a userscript manager: [Tampermonkey](https://www.tampermonkey.net/),
   [Violentmonkey](https://violentmonkey.github.io/), or Greasemonkey.
2. Create a new script and paste the contents of `x-toolkit.user.js`, **or** load
   the file "unpacked" from disk so edits reload with the page.
3. Open `https://x.com/` while logged in. Use the manager's menu
   **X Toolkit: Reload features** after editing, or just refresh the page.

## The one rule that matters most: selectors are evidence-based

X's front-end changes often and **removes `data-testid` attributes without
notice** (as of the 2026 redesign only `premium-signup-tab` survives). Every
selector in this project must be validated against the **real, logged-in DOM**,
not guessed.

When fixing a broken selector:

1. Open the affected page in X, **Save Page As → "Webpage, HTML only"**, and
   inspect that snapshot (it captures the rendered DOM).
2. Find a **language-independent, redesign-stable anchor**. Preferred, in order:
   - a stable `data-*` hook (e.g. `data-engagement-action`, `data-slot="xds-dock-window"`)
   - a stable class token (e.g. `[class*="sidebar-item"]`)
   - an SVG sprite id (`use[href="#icon-more-dots-hor"]`)
   - `[href$="/path"]` (ends-with, so it matches both `/path` and `https://x.com/path`)
   - `:has()` to scope a container by its child icon
3. **Keep old selectors as comma-separated fallbacks** so cached/older pages still work.
4. Prove it before claiming it works. This repo's convention is to run quick
   checks rather than hand-wave:
   - `node --check x-toolkit.user.js` — must stay clean.
   - A tiny `node` script that loads the saved HTML and asserts the new selector
     matches the intended element(s) and does **not** over-match. (See the
     note on Windows below.)

## Adding or changing a UI string (i18n)

There are **9 languages**: `en`, `zh-TW`, `zh-CN`, `ja`, `ko`, `es`, `fr`, `de`,
`pt-BR`.

- Every user-facing string lives in the `LANGS` map at the top of the file.
- **A new setting/label must be added to all 9 language objects**, or it will
  silently fall back to English. If you add a language, also add it to
  `LANG_NAMES` (native name) and it is picked up automatically.
- The settings panel and injected buttons re-localize live via `TK.onLangChange`
  — buttons keep a localized `aria-label`; hover tooltips are resolved live from
  `TK.t(...)` so they need no rebinding.

## Accessibility & injected-button conventions

- Injected icons are **decorative**: their `<svg>` must be `aria-hidden="true"`
  and contain **no `<title>`**. The accessible name comes from the button's
  localized `aria-label`; the visible tooltip is the shared capsule (`TK.tip`),
  so do **not** set a native `title` attribute on injected buttons.
- Never offer destructive actions (Block) on your own account — the code already
  guards this (post self-check + profile handle comparison); keep those guards.

## Pull request checklist

- [ ] `node --check x-toolkit.user.js` passes.
- [ ] New/changed selectors verified against a saved live DOM (state which page).
- [ ] New strings added to **all 9** languages.
- [ ] No new `@grant` / `@connect` permission added without explaining why in the PR.
- [ ] Tested on `x.com` in at least one non-English UI language if the change touches text matching.
- [ ] Description of what changed and how it was tested; screenshots/GIF for UI changes.

## Notes / gotchas

- **Windows + CJK in shell scripts:** piping a Node script through a PowerShell
  here-string can mangle non-ASCII. Write the `.js` to a file and run `node file.js`;
  write CJK check output to a UTF-8 file and read it back rather than trusting the
  console. Also note `$HOME` is a read-only variable in PowerShell.
- The Media Downloader resolves videos through the public
  `cdn.syndication.twimg.com` embed endpoint (the old hard-coded GraphQL query id
  returns 403). If it stops working, that endpoint/token is the first place to look.
- ZIP bundling relies on the `fflate` library loaded via `@require` from a CDN.

## Security & scope

Do not add anything that reads private data (DMs, protected posts) or performs
actions the user did not explicitly trigger. Quick Block simulates the block
action a user could perform by hand; it must not be extended to bulk/automated
account actions.

By contributing you agree your contributions are licensed under the project's
MIT license.
