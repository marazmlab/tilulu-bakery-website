# Tilulu Bakery — Development Roadmap

Static plan aligned with the 10xdevs course and `.ai/mvp-definition.md`.  
Update checkboxes here only when a step meets its **Definition of Done (DoD)**.

For current position and session notes, see [`progress.md`](./progress.md).

---

## Phase 0 — Planning

| Step | Status | Definition of Done |
|------|--------|-------------------|
| PRD finalized | [x] | `prd.md` exists and reflects agreed scope |
| MVP definition frozen | [x] | `mvp-definition.md` lists in/out of scope |
| Planning decisions captured | [x] | `notebook.md` documents key decisions |

---

## Phase 1 — Bootstrap (Course 2x2)

Foundation before MVP features. Implement in `tilulu-bakery-website`; use course repo as planner/mentor only.

| # | Step | Status | Definition of Done |
|---|------|--------|-------------------|
| 1.1 | Astro minimal bootstrap (project root) | [x] | `astro dev` and `astro build` succeed |
| 1.2 | TypeScript strict + Node 22 | [x] | `tsconfig.json` strict; `engines.node >= 22.12.0` |
| 1.3 | React integration | [x] | `@astrojs/react` configured; test component renders |
| 1.4 | ESLint + Prettier | [x] | `npm run lint` and `npm run format` work; Astro + React covered |
| 1.5 | Folder structure | [x] | `layouts/`, `components/`, `pages/api/`, `lib/`, `types/`, `styles/` exist |
| 1.6 | Cursor rules | [x] | `shared.mdc` complete; `frontend.mdc` + `react.mdc` filled in |
| 1.7 | Project docs + env template | [x] | Tilulu `README.md`, `.env.example`, sensible `package.json` name |
| 1.8 | `.nvmrc` | [x] | File contains `22` |
| 1.9 | Tailwind CSS | [ ] | `astro add tailwind`; styles entry wired |
| 1.10 | shadcn/ui init | [ ] | `components/ui/` ready; at least one component added |
| 1.11 | Walking skeleton | [ ] | `BaseLayout` with nav; real-ish `index.astro`; placeholder pages for all 5 routes |

**Phase 1 complete when:** steps 1.1–1.11 are checked; `npm run lint` + `npm run build` pass; all 5 routes open in browser.

---

## Phase 2 — Public Pages (Course 2x5)

| # | Step | Status | Definition of Done |
|---|------|--------|-------------------|
| 2.1 | UI architecture plan | [ ] | Optional: `.ai/ui-plan.md` or section in notebook |
| 2.2 | Home (`/`) | [ ] | Hero, description, product photos, CTA |
| 2.3 | Offer (`/oferta`) | [ ] | Gallery: cakes, pastries, cookies, alfajores; indicative prices |
| 2.4 | About (`/o-nas`) | [ ] | Story, values, owner/team photo |
| 2.5 | Contact (`/kontakt`) | [ ] | Contact details, social links |
| 2.6 | Shared layout polish | [ ] | Header nav, footer, responsive, Polish copy |
| 2.7 | Placeholder images | [ ] | Unsplash or similar until real assets |

**Phase 2 complete when:** all public pages match MVP definition; mobile + desktop OK; no console errors.

---

## Phase 3 — Order Form + Backend (Courses 2x3, 2x4)

| # | Step | Status | Definition of Done |
|---|------|--------|-------------------|
| 3.1 | Database plan + migrations | [ ] | Supabase schema; RLS (anon INSERT only on orders) |
| 3.2 | API plan | [ ] | Endpoint design documented (e.g. `.ai/api-plan.md`) |
| 3.3 | Order form (React) | [ ] | Category, details, pickup date (+48h), contact fields, optional photo |
| 3.4 | Client validation (UX) | [ ] | Required fields, email/phone format, date rules |
| 3.5 | API endpoint | [ ] | Astro route: Zod validation, rate limit 5/IP/h, save to Supabase |
| 3.6 | File upload | [ ] | Max 5 MB; MIME validation; Supabase Storage |
| 3.7 | Resend — owner email | [ ] | Full inquiry details to owner |
| 3.8 | Resend — customer confirmation | [ ] | Thank-you + summary + 24h response expectation |
| 3.9 | Orders page (`/zamowienia`) | [ ] | Form integrated; success/error states |

**Phase 3 complete when:** end-to-end inquiry works locally; emails send; order visible in Supabase Dashboard.

---

## Phase 4 — Polish + Go Live (Course 3x6)

| # | Step | Status | Definition of Done |
|---|------|--------|-------------------|
| 4.1 | SEO basics | [ ] | Titles, meta descriptions, sitemap if applicable |
| 4.2 | Cookie banner | [ ] | MVP-compliant consent if required |
| 4.3 | Lighthouse / performance | [ ] | Target: load <3s, score >80 where feasible |
| 4.4 | `.env` production setup | [ ] | Vercel env vars documented |
| 4.5 | Deploy to Vercel | [ ] | Production URL works; form works on prod |
| 4.6 | Domain (optional) | [ ] | tilulu.pl / .com / .eu when purchased |

**Phase 4 complete when:** MVP live; owner can receive real inquiries.

---

## Explicitly Out of Scope (Phase 2+)

Do not implement unless explicitly requested:

- SMS notifications (SMSAPI.pl)
- Shopping cart / multi-product orders
- 5-step cake builder
- Custom admin panel (owner uses Supabase Dashboard)
- Online payments
- Customer accounts / order history
- Language switcher (structure i18n-ready; Polish only in MVP)
- Blog, reviews, loyalty, coupons

---

## How to Use This File

1. Check off steps only when DoD is met (test locally).
2. After each work session, update [`progress.md`](./progress.md).
3. Start planner chats with the **STATUS** block from `progress.md`, not this full file.
