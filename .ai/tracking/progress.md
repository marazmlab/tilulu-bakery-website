# Tilulu Bakery — Progress

Living document: **where you are now**. Update after every dev session (5 minutes).

Full checklist: [`roadmap.md`](./roadmap.md)

---

## STATUS (copy into planner chat — keep ≤15 lines)

```
Project: Tilulu Bakery (tilulu-bakery-website)
Phase: 1 — Bootstrap (Course 2x2)
Current step: | 1.9 | Tailwind CSS | `astro add tailwind`; styles entry wired |
Last session: 2026-06-15 — `.nvmrc` | File contains `22` |
Next: 1.9
Blockers: none
Workflow: Implement in Tilulu myself; web-dev-assistant = planner/mentor only
```

**Last updated:** 2026-06-15

---

## Quick Reference

| Item             | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| Repo             | `marazmlab/tilulu-bakery-website`                        |
| Sources of truth | `.ai/prd.md`, `.ai/mvp-definition.md`, `.ai/notebook.md` |
| Course / planner | `web-dev-assistant` (no app code commits there)          |
| Node             | >= 22.12.0 (`.nvmrc` not yet added)                      |

---

## Session Log

Append a short entry after each session. Max 5 bullets per entry.

### 2026-06-09 — Bootstrap fundamentals

- **Done:** React integration tested; ESLint + Prettier; `src/` structure; `shared.mdc` written
- **Learned:** Agents Window vs IDE sidebar; workspace split (planner vs implementation)
- **Decided:** Manual implementation first; agent edits code only on request in Tilulu repo
- **Next:** Finish `frontend.mdc` + `react.mdc`, then README / `.env.example`

---

### 2026-06-13 — Bootstrap fundamentals

- **Done:** rules for AI added; recreated `tech-stack.md` missing file, fixed and standardized `ai/` files.
- **Learned:** structure for ai rules documentation

---

### 2026-06-13 — Bootstrap fundamentals 1.8 -

- **Done** file .nvrmc added,

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
