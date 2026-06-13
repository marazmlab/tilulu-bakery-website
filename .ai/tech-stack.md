# Tech Stack — Tilulu Bakery

**Project:** Tilulu Bakery (tilulu-bakery-website)
**Phase:** 1 — MVP
**Last updated:** 2026-06-13
**Related docs:** .ai/prd.md

---

## Summary

Static marketing site + order inquiry form for a home bakery in Szczecin, Poland.
MVP = 5 public pages + simple form + email + Supabase storage. No admin panel, no payments, no user accounts.

---

## Core Stack

| Layer            | Technology              | Version (target) | Role                                        |
| ---------------- | ----------------------- | ---------------- | ------------------------------------------- |
| Framework        | Astro                   | 6.x              | SSG pages, API routes, islands architecture |
| UI (interactive) | React                   | 19.x             | Order form, gallery filters only            |
| Language         | TypeScript              | 5.x              | Type safety across frontend and API         |
| Styling          | Tailwind CSS            | 4.x              | Utility-first styling                       |
| Components       | shadcn/ui + Radix       | latest           | Accessible UI primitives                    |
| Validation       | Zod                     | latest           | Server-side (+ client) form validation      |
| Database         | Supabase (PostgreSQL)   | —                | Orders table, RLS policies                  |
| File storage     | Supabase Storage        | —                | Inspiration photo uploads (max 5 MB)        |
| Email            | Resend + React Email    | —                | Customer confirmation + owner notification  |
| Hosting          | Vercel                  | —                | Astro API endpoints + SSR/API support       |
| Analytics        | GA4 + Microsoft Clarity | —                | Load only after cookie consent              |
| Node.js          | Node                    | 22 LTS           | Local dev and CI                            |

---

## Architecture Decisions

### Astro vs React split

- Astro (.astro): static pages — Home, Products, About, Orders, Contact, Terms, Privacy Policy.
- React (.tsx): interactive islands only — order form, gallery filters.
- Do not use React for purely static content.

### API strategy

- All Supabase and Resend calls go through Astro API routes (src/pages/api/).
- No direct Supabase client calls from browser/React components.
- Server-side validation with Zod on every write endpoint.

### Security (MVP)

- Supabase RLS: anonymous INSERT only on orders; no public SELECT/UPDATE/DELETE.
- Rate limiting: max 5 inquiries per IP per hour.
- Upload validation: type, size (5 MB), server-side checks.
- Secrets in .env only — never commit .env.

### State management

- Phase 1: local component state + native form handling.
- Phase 2+: Zustand or Context API + localStorage (cart, builder draft).

---

## Phase Boundaries

### In MVP (Phase 1)

- 5 public pages + privacy policy
- Simple order form (textarea, no cart, no builder)
- 1 optional inspiration photo upload
- Email to customer + owner (Resend)
- Orders visible in Supabase Dashboard (no custom admin)
- Cookie banner, GA4, Clarity (after consent)
- Polish UI only (i18n-ready structure for future)

### Deferred to Phase 2

- SMS (SMSAPI.pl)
- Multi-product cart
- 5-step cake builder
- Multiple photo uploads (up to 3)
- Advanced error handling (localStorage draft, etc.)

### Deferred to Phase 3+

- Custom admin panel
- Customer accounts and order history

---

## Environment Variables

See .env.example in project root.

| Variable                  | Scope  | Purpose                           |
| ------------------------- | ------ | --------------------------------- |
| SUPABASE_URL              | server | Supabase project URL              |
| SUPABASE_SERVICE_ROLE_KEY | server | API routes (DB + storage)         |
| RESEND_API_KEY            | server | Transactional email               |
| RESEND_FROM_EMAIL         | server | Verified sender domain            |
| OWNER_EMAIL               | server | Owner notification recipient      |
| SITE_URL                  | server | Links in emails                   |
| PUBLIC_GA_MEASUREMENT_ID  | client | Google Analytics (after consent)  |
| PUBLIC_CLARITY_PROJECT_ID | client | Microsoft Clarity (after consent) |

---

## Project Structure (target)

src/
components/ Astro + React components
layouts/ Astro layouts
pages/ Astro pages
pages/api/ API endpoints
assets/ Internal static assets
public/ Public static files

---

## Selection Criteria

Why this stack for Tilulu MVP:

1. Speed to MVP — Astro SSG + shadcn/ui = fast static pages and forms.
2. Low backend complexity — Supabase BaaS, no custom admin in Phase 1.
3. Security — API layer hides keys; RLS on database.
4. AI-friendly — popular JS/TS stack; good LLM code generation quality.
5. Owner workflow — Supabase Dashboard is enough for ~3–4 orders/week.

---

## Risks and Mitigations

| Risk                                       | Mitigation                                                 |
| ------------------------------------------ | ---------------------------------------------------------- |
| Branding not ready (logo, colors)          | Placeholders + Tailwind theme tokens; easy swap later      |
| Vercel free tier limits for commercial use | Monitor usage; plan paid tier if needed                    |
| Email deliverability (Resend domain)       | Verify domain early in Resend dashboard                    |
| Over-using React                           | Enforced in Cursor rules: React only for interactive parts |
| PRD vs implementation drift                | Keep .ai/prd.md and this file in sync                      |

---

## Tooling and Quality

- Linting: ESLint
- Formatting: Prettier
- AI rules: .cursor/rules/ (shared, frontend, react, astro)
- Git: Conventional Commits
- Package manager: npm

---

## Deployment (planned)

- Platform: Vercel
- Domain: tilulu.pl / .com / .eu (TBD)
- CI/CD: Vercel Git integration (GitHub -> auto deploy)

Update this section after first production deploy (lesson 3x6).
