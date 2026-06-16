# Tilulu Bakery — Development Roadmap

Static plan aligned with the 10xdevs course and `.ai/mvp-definition.md`.  
Update checkboxes here only when a step meets its **Definition of Done (DoD)**.

For current position and session notes, see [`progress.md`](./progress.md).

> **Naming note:** Roadmap **Phase 2+** = your build order. **PRD Faza 2** = cart + cake builder (explicitly out of scope below).

---

## Phase 0 — Planning

| Step                        | Status | Definition of Done                        |
| --------------------------- | ------ | ----------------------------------------- |
| PRD finalized               | [x]    | `prd.md` exists and reflects agreed scope |
| MVP definition frozen       | [x]    | `mvp-definition.md` lists in/out of scope |
| Planning decisions captured | [x]    | `notebook.md` documents key decisions     |

---

## Phase 1 — Bootstrap (Course 2x2)

Foundation before MVP features. Implement in `tilulu-bakery-website`; use course repo as planner/mentor only.

| #    | Step                                   | Status | Definition of Done                                                             |
| ---- | -------------------------------------- | ------ | ------------------------------------------------------------------------------ |
| 1.1  | Astro minimal bootstrap (project root) | [x]    | `astro dev` and `astro build` succeed                                          |
| 1.2  | TypeScript strict + Node 22            | [x]    | `tsconfig.json` strict; `engines.node >= 22.12.0`                              |
| 1.3  | React integration                      | [x]    | `@astrojs/react` configured; test component renders                            |
| 1.4  | ESLint + Prettier                      | [x]    | `npm run lint` and `npm run format` work; Astro + React covered                |
| 1.5  | Folder structure                       | [x]    | `layouts/`, `components/`, `pages/api/`, `lib/`, `types/`, `styles/` exist     |
| 1.6  | Cursor rules                           | [x]    | `shared.mdc` complete; `frontend.mdc` + `react.mdc` filled in                  |
| 1.7  | Project docs + env template            | [x]    | Tilulu `README.md`, `.env.example`, sensible `package.json` name               |
| 1.8  | `.nvmrc`                               | [x]    | File contains `22`                                                             |
| 1.9  | Tailwind CSS                           | [x]    | `astro add tailwind`; styles entry wired                                       |
| 1.10 | shadcn/ui init                         | [x]    | `components/ui/` ready; at least one component added                           |
| 1.11 | Walking skeleton                       | [x]    | `BaseLayout` with nav + footer; real-ish `index.astro`; stubs for 5 nav routes |

**Phase 1 complete when:** steps 1.1–1.11 are checked; `npm run lint` + `npm run build` pass; all 5 routes open in browser.

---

## Phase 2 — Data & API Planning (Courses 2x3, 2x4)

**Planning only** — documents in `.ai/`. No migrations or endpoint code yet.

| #   | Step                 | Status | Definition of Done                                                                                     |
| --- | -------------------- | ------ | ------------------------------------------------------------------------------------------------------ |
| 2.1 | DB planning session  | [ ]    | ≥2 Q&A rounds with reasoning model;                                                                    |
| 2.2 | Database plan        | [ ]    | `.ai/db-plan.md`: `orders` table, Storage bucket, RLS, indexes; OUT OF SCOPE for cart/products noted   |
| 2.3 | API planning session | [ ]    | Integration decisions documented (Astro API only, no direct Supabase from browser, upload strategy)    |
| 2.4 | API plan             | [ ]    | `.ai/api-plan.md`: `POST /api/orders` contract, HTTP codes, rate limit, env vars; aligned with db-plan |
| 2.5 | Plans cross-review   | [ ]    | Every form field in PRD maps to DB column + API field; RLS matches “server service_role via Astro API” |

**Phase 2 complete when:** `db-plan.md` and `api-plan.md` exist, reviewed, and consistent with PRD §3.2–3.3.

---

## Phase 3 — Public Pages (Course 2x5)

UI planning + static page implementation. Form stays a stub until Phase 4.

| #   | Step                        | Status | Definition of Done                                                                |
| --- | --------------------------- | ------ | --------------------------------------------------------------------------------- |
| 3.1 | UI architecture plan        | [ ]    | `.ai/ui-plan.md`: views, nav, component tree, Astro vs React; uses db- + api-plan |
| 3.2 | Shared layout polish        | [ ]    | Header nav (incl. mobile), footer with legal links, responsive, Polish copy       |
| 3.3 | Home (`/`)                  | [ ]    | Hero, description, gallery (≥3 photos), CTA to offer or orders                    |
| 3.4 | Offer (`/oferta`)           | [ ]    | 3 categories, product cards, badges, indicative prices, CTA to `/zamowienia`      |
| 3.5 | About (`/o-nas`)            | [ ]    | Story, values, owner/team photo, social links                                     |
| 3.6 | Contact (`/kontakt`)        | [ ]    | Email, phone, location (Szczecin), social links                                   |
| 3.7 | Legal pages                 | [ ]    | `/regulamin`, `/polityka-prywatnosci`; linked from footer and (later) order form  |
| 3.8 | Placeholder images          | [ ]    | Unsplash or similar until real assets; lazy loading where applicable              |
| 3.9 | Orders stub (`/zamowienia`) | [ ]    | Page shell only — “form coming in Phase 4”; no API integration yet                |

**Phase 3 complete when:** all public pages match MVP definition; mobile + desktop OK; no console errors; `/zamowienia` remains non-functional stub.
---

## Phase 4 — Order Form + Backend (Courses 2x3, 2x4 implementation)

Implement what was planned in Phase 2.

| #   | Step                           | Status | Definition of Done                                                                   |
| --- | ------------------------------ | ------ | ------------------------------------------------------------------------------------ |
| 4.1 | Supabase local + migrations    | [ ]    | `supabase init/start`; migration from db-plan applied; types generated               |
| 4.2 | DTO / command types            | [ ]    | Request/response types aligned with api-plan (Zod schemas + TS types)                |
| 4.3 | API endpoint                   | [ ]    | `POST /api/orders`: Zod validation, rate limit 5/IP/h, Supabase insert via server    |
| 4.4 | File upload                    | [ ]    | Max 5 MB; MIME validation; private Supabase Storage bucket                           |
| 4.5 | Order form (React)             | [ ]    | Category, details, pickup date (+48h), contact fields, optional photo, RODO checkbox |
| 4.6 | Client validation (UX)         | [ ]    | Required fields, email/phone format, date rules; Polish inline errors                |
| 4.7 | Resend — owner email           | [ ]    | Full inquiry details to owner                                                        |
| 4.8 | Resend — customer confirmation | [ ]    | Thank-you + summary + 24h response expectation                                       |
| 4.9 | Orders page integration        | [ ]    | Form on `/zamowienia`; success/error/loading states; duplicate-submit prevention     |

**Phase 4 complete when:** end-to-end inquiry works locally; emails send; order visible in Supabase Dashboard.

---

## Phase 5 — Polish + Go Live (Course 3x6)

| #   | Step                     | Status | Definition of Done                               |
| --- | ------------------------ | ------ | ------------------------------------------------ |
| 5.1 | SEO basics               | [ ]    | Titles, meta descriptions, sitemap if applicable |
| 5.2 | Cookie banner            | [ ]    | MVP-compliant consent if required                |
| 5.3 | Lighthouse / performance | [ ]    | Target: load <3s, score >80 where feasible       |
| 5.4 | `.env` production setup  | [ ]    | Vercel env vars documented                       |
| 5.5 | Deploy to Vercel         | [ ]    | Production URL works; form works on prod         |
| 5.6 | Domain (optional)        | [ ]    | tilulu.pl / .com / .eu when purchased            |

**Phase 5 complete when:** MVP live; owner can receive real inquiries.

---

## Explicitly Out of Scope (MVP)

Do not implement unless explicitly requested:

- SMS notifications (SMSAPI.pl) — deferred post-MVP
- Shopping cart / multi-product orders (PRD Faza 2)
- 5-step cake builder (PRD Faza 2)
- Custom admin panel (owner uses Supabase Dashboard)
- Online payments
- Customer accounts / order history
- Language switcher (structure i18n-ready; Polish only in MVP)
- Blog, reviews, loyalty, coupons
- Product catalog in database (hardcoded in code for MVP)

---

## How to Use This File

1. Check off steps only when DoD is met (test locally).
2. After each work session, update [`progress.md`](./progress.md).
3. Start planner chats with the **STATUS** block from `progress.md`, not this full file.
4. **Course order for planning:** 2x3 → 2x4 → 2x5 (Phase 2 → 3.1 → Phase 4 implementation).
