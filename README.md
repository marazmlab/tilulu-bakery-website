# Tilulu Bakery Website

[![Node.js](https://img.shields.io/badge/node-%3E%3D22.12.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Astro](https://img.shields.io/badge/Astro-6.x-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Phase](<https://img.shields.io/badge/phase-MVP%20(Phase%201)-orange>)](#project-status)

Website for **Tilulu Bakery** — a home bakery in Szczecin, Poland. The product serves as an online business card and a single channel for quote requests, replacing scattered communication through Instagram DM, WhatsApp, and phone.

Customers browse products with photos and indicative prices, then submit a quote request through a simple form. The owner receives email notifications for each inquiry and manages orders in the Supabase Dashboard. Every submission is a quote request — not an online purchase — and requires manual confirmation.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [Additional Documentation](#additional-documentation)
- [License](#license)

## Tech Stack

### Currently Installed

| Layer        | Technology | Version |
| ------------ | ---------- | ------- |
| Framework    | Astro      | 6.x     |
| UI (islands) | React      | 19.x    |
| Language     | TypeScript | 5.x     |
| Linting      | ESLint     | 9.x     |
| Formatting   | Prettier   | 3.x     |

### Planned for MVP (Phase 1)

| Layer        | Technology              | Role                                         |
| ------------ | ----------------------- | -------------------------------------------- |
| Styling      | Tailwind CSS 4          | Utility-first styling                        |
| Components   | shadcn/ui + Radix       | Accessible UI primitives                     |
| Validation   | Zod                     | Server-side (and client) form validation     |
| Database     | Supabase (PostgreSQL)   | Orders table with RLS policies               |
| File storage | Supabase Storage        | Inspiration photo uploads (max 5 MB)         |
| Email        | Resend + React Email    | Customer confirmation and owner notification |
| Hosting      | Vercel                  | Static site + Astro API endpoints            |
| Analytics    | GA4 + Microsoft Clarity | Loaded only after cookie consent             |
| Runtime      | Node.js                 | >= 22.12.0 (local dev and CI)                |

### Architecture Highlights

- **Astro first** — static pages (Home, Offer, About, Orders, Contact, Terms, Privacy Policy) without wrapping entire pages in React.
- **React islands** — interactive components only (order form, optional gallery filters), hydrated with `client:load` or `client:visible`.
- **API boundary** — all Supabase, Resend, and upload logic lives in Astro API routes (`src/pages/api/`). No direct Supabase calls from the browser.
- **Security** — RLS (anonymous INSERT only), Zod validation, rate limiting (5 inquiries per IP per hour), upload MIME/size checks.
- **UI language** — Polish only in MVP; structure kept i18n-ready for future localization.

## Getting Started Locally

### Prerequisites

- **Node.js** >= 22.12.0 ([download](https://nodejs.org/))
- **npm** (included with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/tilulu-bakery-website.git
   cd tilulu-bakery-website
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in the values in `.env`. Required for full MVP functionality:

   | Variable                    | Scope  | Purpose                           |
   | --------------------------- | ------ | --------------------------------- |
   | `SUPABASE_URL`              | server | Supabase project URL              |
   | `SUPABASE_SERVICE_ROLE_KEY` | server | API routes (DB + storage)         |
   | `RESEND_API_KEY`            | server | Transactional email               |
   | `RESEND_FROM_EMAIL`         | server | Verified sender domain            |
   | `OWNER_EMAIL`               | server | Owner notification recipient      |
   | `SITE_URL`                  | server | Links in emails                   |
   | `PUBLIC_GA_MEASUREMENT_ID`  | client | Google Analytics (after consent)  |
   | `PUBLIC_CLARITY_PROJECT_ID` | client | Microsoft Clarity (after consent) |

   > **Note:** Supabase and Resend credentials are only needed once backend features are implemented. The dev server runs without them for static page development.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:4321](http://localhost:4321) in your browser.

### Production Build (optional)

```bash
npm run build
npm run preview
```

## Available Scripts

All commands are run from the project root:

| Script             | Description                                        |
| ------------------ | -------------------------------------------------- |
| `npm run dev`      | Start local dev server at `localhost:4321`         |
| `npm run build`    | Build production site to `./dist/`                 |
| `npm run preview`  | Preview the production build locally               |
| `npm run lint`     | Run ESLint across the project                      |
| `npm run lint:fix` | Run ESLint and auto-fix issues where possible      |
| `npm run format`   | Format code with Prettier                          |
| `npm run astro`    | Run Astro CLI commands (e.g. `astro add`, `check`) |

## Project Scope

### MVP (Phase 1) — In Scope

**Public pages**

| Route                   | Page           | Purpose                                  |
| ----------------------- | -------------- | ---------------------------------------- |
| `/`                     | Home           | Hero, gallery, brief description, CTA    |
| `/oferta`               | Offer          | Product gallery with indicative prices   |
| `/o-nas`                | About Us       | Bakery history, values, owner photo      |
| `/zamowienia`           | Orders         | Quote request form                       |
| `/kontakt`              | Contact        | Contact details and social links         |
| `/regulamin`            | Order Terms    | Quote request rules, cancellation policy |
| `/polityka-prywatnosci` | Privacy Policy | GDPR, cookies (GA4, Clarity)             |

**Order form**

- Product category selection (occasion cake, cake, cookies, alfajores, other)
- Order details textarea (500–1000 characters)
- Contact fields: name, email, phone (Polish format validation)
- Pickup date picker (minimum +48 hours from today)
- Optional inspiration photo upload (1 file, max 5 MB, JPG/PNG/WEBP)
- Optional additional notes (max 500 characters)
- GDPR consent checkbox with link to privacy policy

**Backend and notifications**

- Astro API endpoint with Zod validation and rate limiting (5 inquiries/IP/hour)
- Order storage in Supabase with RLS policies
- Confirmation email to customer and detailed notification to owner (Resend)
- Order management via Supabase Dashboard (no custom admin UI)

**Other MVP features**

- Cookie banner; analytics load only after consent
- Basic SEO (meta tags, Open Graph, schema.org, sitemap, robots.txt)
- Responsive, mobile-first design
- Polish UI copy (i18n-ready structure)

### Development Roadmap (Beyond MVP)

| Phase   | Focus                                                                             |
| ------- | --------------------------------------------------------------------------------- |
| Phase 2 | SMS (SMSAPI.pl), multi-product cart, 5-step cake builder, advanced error handling |
| Phase 3 | Custom admin panel, order status management, automated customer emails            |
| Phase 4 | Customer accounts, order history, status tracking                                 |

### Explicitly Out of Scope

- Online payments / Stripe
- User accounts and order history (MVP)
- Custom admin panel (MVP — owner uses Supabase Dashboard)
- Shopping cart and cake builder (MVP)
- SMS notifications (MVP — deferred to Phase 2)
- Language switcher / English version
- PWA, real-time updates, loyalty program, customer reviews

## Project Status

**Version:** `0.0.1` — **Phase 1 (MVP) — early development**

| Area              | Status      | Notes                                 |
| ----------------- | ----------- | ------------------------------------- |
| Project scaffold  | Done        | Astro 6 + React 19, ESLint, Prettier  |
| Base layout       | In progress | `BaseLayout.astro` started            |
| Public pages      | Not started | 7 routes planned (see scope above)    |
| Order form        | Not started | React island with API integration     |
| Supabase / Resend | Not started | Dependencies and API routes pending   |
| Tailwind / shadcn | Not started | Planned per tech stack                |
| Deployment        | Not started | Target: Vercel (GitHub → auto deploy) |

MVP success criteria include Lighthouse scores above 80, page load under 3 seconds, server-side validation, and owner email delivery within 2 minutes of submission.

## Additional Documentation

Internal planning and requirements live in the `.ai/` directory:

| Document                                         | Description                            |
| ------------------------------------------------ | -------------------------------------- |
| [`.ai/prd.md`](.ai/prd.md)                       | Product Requirements Document          |
| [`.ai/mvp-definition.md`](.ai/mvp-definition.md) | MVP scope and success criteria         |
| [`.ai/tech-stack.md`](.ai/tech-stack.md)         | Stack versions, architecture, env vars |
| [`.env.example`](.env.example)                   | Environment variable template          |

Cursor AI rules for contributors: [`.cursor/rules/`](.cursor/rules/).

## License

No license file is present in this repository yet. All rights reserved until a license is explicitly added. Contact the project owner for usage terms.
