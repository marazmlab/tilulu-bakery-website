# Tilulu Bakery — Progress

Living document: **where you are now**. Update after every dev session (5 minutes).

Full checklist: [`roadmap.md`](./roadmap.md)

---

## STATUS (copy into planner chat — keep ≤15 lines)

```
Project: Tilulu Bakery (tilulu-bakery-website)
Phase: 1 — Bootstrap (Course 2x2)
Current step: 1.6 — Cursor rules (shared done; frontend + react pending)
Last session: 2026-06-09 — React, ESLint/Prettier, folder structure, shared.mdc
Next tasks:
  1. Complete .cursor/rules/frontend.mdc and react.mdc
  2. README + .env.example + fix package.json name
  3. npx astro add tailwind
Blockers: none
Workflow: Implement in Tilulu myself; web-dev-assistant = planner/mentor only
```

**Last updated:** 2026-06-09

---

## Quick Reference

| Item | Value |
|------|-------|
| Repo | `marazmlab/tilulu-bakery-website` |
| Sources of truth | `.ai/prd.md`, `.ai/mvp-definition.md`, `.ai/notebook.md` |
| Course / planner | `web-dev-assistant` (no app code commits there) |
| Node | >= 22.12.0 (`.nvmrc` not yet added) |

---

## Completed So Far

- [x] Phase 0 — Planning (PRD, MVP, notebook)
- [x] Astro 6 minimal bootstrap in repo root
- [x] TypeScript strict; `npm run dev` / `npm run build` OK
- [x] React 19 + `@astrojs/react`; smoke test (`Counter.tsx`)
- [x] ESLint + Prettier configured
- [x] Folder structure: `layouts/`, `components/`, `pages/api/`, `lib/`, `types/`, `styles/`
- [x] `BaseLayout.astro`, `index.astro`
- [x] `.cursor/rules/shared.mdc` (complete)

---

## In Progress

- [~] **Step 1.6** — Cursor rules: `frontend.mdc` and `react.mdc` are placeholders

---

## Not Started (next up)

- [ ] Step 1.7 — README, `.env.example`, rename `package.json` from `afraid-satellite`
- [ ] Step 1.8 — `.nvmrc`
- [ ] Step 1.9 — Tailwind
- [ ] Step 1.10 — shadcn/ui
- [ ] Step 1.11 — Walking skeleton + 4 placeholder routes (`oferta`, `o-nas`, `zamowienia`, `kontakt`)

---

## Session Log

Append a short entry after each session. Max 5 bullets per entry.

### 2026-06-09 — Bootstrap fundamentals

- **Done:** React integration tested; ESLint + Prettier; `src/` structure; `shared.mdc` written
- **Learned:** Agents Window vs IDE sidebar; workspace split (planner vs implementation)
- **Decided:** Manual implementation first; agent edits code only on request in Tilulu repo
- **Next:** Finish `frontend.mdc` + `react.mdc`, then README / `.env.example`

---

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
