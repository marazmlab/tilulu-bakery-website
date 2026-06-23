# Tilulu Bakery — Progress

Living document: **where you are now**. Update after every dev session (5 minutes).

Full checklist: [`roadmap.md`](./roadmap.md)

---

## STATUS (copy into planner chat — keep ≤15 lines)

```
Project: Tilulu Bakery (tilulu-bakery-website)
Phase 3 — Public Pages
Current step: 3.3 - Home (/)
Last session: 2026-06-23 — 3.2 shared layout complete (Header/Nav/Footer, i18n, legal stubs, kontakt)
Blockers: none
Workflow: Implement in Tilulu myself; web-dev-assistant = planner/mentor only
```

**Last updated:** 2026-06-23

---

## Quick Reference

| Item             | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| Repo             | `marazmlab/tilulu-bakery-website`                        |
| Sources of truth | `.ai/prd.md`, `.ai/mvp-definition.md`, `.ai/notebook.md` |
| Course / planner | `web-dev-assistant` (no app code commits there)          |
| Node             | >= 22.12.0 (`.nvmrc` → `22`)                             |

---

## Session Log

Append a short entry after each session. Max 5 bullets per entry.

### 2026-06-09 — Bootstrap fundamentals

- **Done:** React integration tested; ESLint + Prettier; `src/` structure; `shared.mdc` written
- **Learned:** Agents Window vs IDE sidebar; workspace split (planner vs implementation)
- **Decided:** Manual implementation first; agent edits code only on request in Tilulu repo
- **Next:** Finish `frontend.mdc` + `react.mdc`, then README / `.env.example`

---

### 2026-06-13 — Bootstrap docs + Cursor rules

- **Done:** Tilulu README; `.env.example`; `package.json` rename; recreated `tech-stack.md`; AI rules (`shared`, `frontend`, `react`, `astro`) aligned with PRD
- **Learned:** `.ai/` documentation structure as source of truth for agents
- **Next:** Tailwind CSS (1.9), then shadcn/ui and walking skeleton

---

### 2026-06-15 — Bootstrap 1.8–1.11

- **Done:** `.nvmrc`; Tailwind CSS 4 + `global.css`; shadcn/ui + `Button`; `BaseLayout` (nav, footer, active link); `index.astro` with hero and CTA; MVP stubs on `/oferta`, `/o-nas`, `/zamowienia`, `/kontakt`; Prettier disabled for `.astro`, walking skeleton builded
- **Verified:** `npm run lint` and `npm run build` pass; build outputs 5 pages
- **Next:** start Phase 2

---

### 2026-06-16 — Roadmap reorder (planning first)

- **Done:** Roadmap restructured — Phase 2 = DB/API planning (2x3, 2x4); Phase 3 = Public Pages (2x5); Phase 4 = backend implementation; Phase 5 = go-live
- **Decided:** Plan `db-plan.md` + `api-plan.md` before `ui-plan.md`; Phase 2 planning before public UI implementation
- **Next:** Step 2.1 — DB planning session (2 rounds, reasoning model)

---

### 2026-06-17 — DB/API plans draft (2.1–2.4)

- **Done:** DB + API planning sessions; `db-plan.md` (`orders` table, RLS, Storage); `api-plan.md` (`POST /api/orders`, HTTP codes, INSERT flow)
- **Decided:** RLS with no client policies; category ENUM as source of truth; writes only via Astro API
- **Next:** Cross-review consistency with PRD (2.5)

---

### 2026-06-18 — Plans cross-review (2.5) — Phase 2 closed

- **Done:** Consistency audit; D-01–D-07 in `notebook.md`; roadmap 2.5 `[x]`; PRD, env, and Cursor rules updated
- **Decided:** Best-effort email, 365-day pickup horizon, `inspirations` bucket, per-instance rate limit
- **Verified:** Every PRD §3.2 form field maps to DB column + API field; RLS matches server `service_role` via Astro API
- **Next:** Phase 3 — ui-plan + public pages

---

### 2026-06-19 — UI architecture plan (3.1) — Phase 3 started

- **Done:** `.ai/ui-plan.md` — 8 views, component tree, Astro vs React (OrderForm island), i18n-ready structure; roadmap 3.1 `[x]`
- **Decided:** Single write path (`POST /api/orders`); shared Zod + i18n labels; cookie banner as lightweight island (Phase 5)
- **Next:** Step 3.2 — shared layout polish (nav, footer, mobile)

---

### 2026-06-22 — Layout foundations + repo hygiene

- **Done:** `.editorconfig` + `.gitattributes` (LF repo-wide); `src/lib/site.ts` (contact, social, tagline); i18n scaffold — `t()` helper + `nav.json` / `footer.json` (initially under `src/i118n/`)
- **Next:** Split `BaseLayout` into components; mobile nav; legal stubs

---

### 2026-06-23 — Shared layout polish (3.2) — Phase 3 layout closed

- **Done:** `Header`, `Nav` (desktop + mobile `<details>`), `Footer`, `SocialLinks`; `BaseLayout` as flex shell; i18n moved to `src/i18n/`; Vite `@` alias; stub `/regulamin` + `/polityka-prywatnosci` (footer links); `/kontakt` wired to `site.ts`; `scrollbar-gutter: stable`
- **Verified:** `npm run dev` — nav, footer, and legal pages work responsively
- **Next:** Step 3.3 — Home (`/`) hero, description, gallery (≥3 photos), CTA

## Planner Chat Template

Paste at the start of a new conversation in `web-dev-assistant`:

```
Mode: mentor/planner. Do not implement Tilulu app code.

[paste STATUS block from above]

Question: Guide me through the current step. I implement myself in tilulu-bakery-website.
What is the order of tasks, how do I verify done, and what mistakes should I avoid?

```

## When to Start a New Planner Conversation

- Phase changes (e.g. Bootstrap → Public UI)
- Major step changes (e.g. rules → Tailwind)
- Chat feels long or confused (~15+ exchanges)
- Always paste fresh **STATUS** block — do not rely on chat memory
