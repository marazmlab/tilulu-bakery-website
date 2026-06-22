# UI Architecture for Tilulu Bakery

## 1. UI Structure Overview

Tilulu Bakery is an Astro-first, static business-card website for a home bakery in Szczecin, with a single quote-request channel. The architecture follows three guiding principles drawn from the PRD, API plan, and planning sessions:

1. **Astro-first, minimal JavaScript.** All pages, layouts, navigation, SEO, and galleries are static `.astro`. React 19 is used for exactly one interactive island — the order form (`OrderForm`) — hydrated with `client:visible`. The cookie banner is a tiny, framework-light island. This keeps Lighthouse > 80 across all categories (PRD §3.7) and page load under 3 s.

2. **Single write path.** The UI has exactly one server interaction: `POST /api/orders`. Every CTA across the site funnels users to the `/zamowienia` route that hosts the form. There is no read/update/delete API — owner management happens in the Supabase Dashboard.

3. **Single source of truth shared between client, server, and emails.** One Zod schema (`src/lib/schemas/order.ts`), shared constants (`ORDER_MAX_PICKUP_DAYS`, length limits, TTLs), shared error/copy contract, and shared i18n labels (ENUM → Polish label) eliminate front/back drift.

The site comprises **8 views**: 5 in the main navigation (Home, Oferta, About, Orders, Contact), 2 legal pages (Terms, Privacy Policy), and a 404 page. A shared `BaseLayout.astro` provides the header (navigation), footer, and cookie banner on every page. UI is Polish-only with an i18n-ready structure (JSON files, `t(key)` helper), no language switcher. Accessibility targets WCAG AA: `lang="pl"`, Radix/shadcn-ui primitives, `aria-invalid`/`aria-describedby` error wiring, deliberate focus management, `:focus-visible`, and `prefers-reduced-motion` support.

The order form is decomposed into a container (`OrderForm`) plus dumb field subcomponents, two banner components (`SuccessBanner`, `ErrorBanner`), and a submission hook (`useOrderSubmit`) holding the explicit state machine `idle → submitting → success | error`.

## 2. List of Views

### 2.1 Home (`/`)

- **View path:** `/`
- **Main purpose:** Communicate what the bakery does within seconds and route users to the offer or the order form (US-001).
- **Key information to display:**
  - Hero: single `<h1>` (bakery name / tagline), short description, priority-loaded hero image (16:9).
  - Primary CTA "Złóż zapytanie" (→ `/zamowienia`) and secondary CTA "Zobacz ofertę" (→ `/oferta`).
  - Project gallery: minimum 3 pastry/cake photos (static, lazy-loaded).
  - Brief description of offerings and bakery values.
- **Key components:** `Hero`, `CtaButton` (primary/secondary), static `Gallery` grid, `BaseLayout`.
- **UX, accessibility & security:**
  - Hero image eager/priority to protect LCP; all other images `loading="lazy"`, fixed dimensions against CLS, meaningful `alt` (US-025).
  - Main CTA clicks fire `cta_clicked` via the `track()` helper (no-op without consent).
  - Mobile-first; renders correctly from 320 px (US-034). Dedicated `og:image` for the homepage (US-024).

### 2.2 Oferta (`/oferta`)

- **View path:** `/oferta`
- **Main purpose:** Present the full offer across three categories with indicative/concrete prices so the customer knows what to expect (US-002, US-036).
- **Key information to display:**
  - Three categories: Occasion/custom cakes (indicative "od X zł"), Standard pastries (concrete per piece/kg/portion), Other custom cakes incl. gluten-free/vegan (indicative).
  - Product cards: thumbnail (4:3), name, short description, price.
  - "Wysyłka" badge (shipping available — cookies, alfajores) and "Odbiór osobisty" badge (in-person pickup — cakes).
  - Clearly visible note in the "Other custom cakes" section about gluten-free/vegan fulfillment (US-036), shown without needing to open the form.
  - CTA to the order form.
- **Key components:** `OfferSection` (per category), `ProductCard`, `Badge`, `CtaButton`, `BaseLayout`.
- **UX, accessibility & security:**
  - Data sourced from `src/data/oferta.ts` + i18n labels; category labels reuse the same i18n keys as the form ENUM values to avoid drift.
  - `schema.org/Product` generated from the same data (US-025).
  - `<Image>` Astro component (webp/avif, srcset, dimensions), consistent 4:3 card ratio, `alt` on every image.
  - Static-only; no client JS required. (Product modals/lightbox are Phase 2 — US-003.)

### 2.3 About Us (`/o-nas`)

- **View path:** `/o-nas`
- **Main purpose:** Build trust by telling the bakery's history and values (US-004).
- **Key information to display:** History/values text, owner/team photo, social links (Instagram, Facebook).
- **Key components:** static content blocks, `SocialLinks`, `BaseLayout`.
- **UX, accessibility & security:** Social links `target="_blank"` with `rel="noopener"`; readable typography; accessible from main nav. Instagram grid deferred.

### 2.4 Orders (`/zamowienia`)

- **View path:** `/zamowienia` (success deep-link anchor: `/zamowienia#potwierdzenie`)
- **Main purpose:** Let the customer submit a complete quote request via the single interactive form (US-012–US-018, US-029, US-030, US-040, US-041).
- **Key information to display:**
  - The order form, split into labeled `fieldset`/`legend` sections (single-column layout):
    1. **Co zamawiasz** — category (`RadioGroup` cards, values = ENUM) + details textarea (20–1000 chars, counter "X/1000", "min. 20 znaków" hint).
    2. **Termin odbioru** — Calendar (shadcn/ui), days `< today+2` and `> today+ORDER_MAX_PICKUP_DAYS` disabled; one-sentence hint about the earliest allowed date.
    3. **Zdjęcie inspiracji (opcjonalne)** — single file upload, thumbnail preview, remove button.
    4. **Dane kontaktowe** — name, email (`type="email"`), phone (`type="tel"`).
    5. **Zgody** — required GDPR checkbox with link to Privacy Policy; Terms link directly above the submit button.
  - Submit button "Wyślij zapytanie".
  - On success: inline neutral `SuccessBanner` replacing/hiding the form.
  - On error: field-level inline messages and/or global `ErrorBanner` above the form.
- **Key components:** `OrderForm` (React island, `client:visible`), `CategoryField`, `DetailsField`, `PickupDateField`, `PhotoUploadField`, `ContactFields` (name/email/phone), `ConsentField`, `SuccessBanner`, `ErrorBanner`, `useOrderSubmit` hook, `CharacterCounter`, `BaseLayout`.
- **UX, accessibility & security:**
  - Validation: React Hook Form + Zod resolver; mode `onTouched`/`onBlur` initially, a field switches to `onChange` once it has an error (US-032). Full validation on submit, scroll + focus to first invalid field.
  - Phone validated on blur and before submit; accepts `+48`/spaces/none; light visual grouping; canonical normalization is server-side (US-012). Email `type="email"`, phone `type="tel"` for mobile keyboards (US-034).
  - Counters: "X/1000" for `details` (with min-20 messaging), "X/500" for `notes`; `aria-live="polite"`; hard input cap + Zod backstop (US-015).
  - Photo: client-side MIME (jpeg/png/webp) + ≤ 5 MB check for UX; thumbnail via `URL.createObjectURL` with "Usuń"; relies on server `413`/`415` as authoritative; `objectURL` revoked on remove/submit; no client compression in MVP (US-014-SIMPLIFIED).
  - Calendar: value sent as `YYYY-MM-DD`, displayed as `DD.MM.RRRR`; operate on local date to avoid timezone drift; keyboard-operable, large touch targets (US-013, US-034). Default view on first allowed date.
  - Errors bound via `aria-invalid`/`aria-describedby`; GDPR checkbox error "Zgoda na przetwarzanie danych jest wymagana" bound by `aria-describedby` (US-016).
  - Loading: submit button disabled with spinner + "Wysyłanie…", indeterminate indicator for photo, `aria-busy` during request; re-clicks cannot duplicate (US-017, US-040).
  - Success flow: reset fields, hide/lock form, show banner, programmatic focus on banner (`tabindex="-1"`), scroll to `#potwierdzenie`, update URL, "Złóż kolejne zapytanie" button restores a clean form. Copy is always the neutral message, never branched on `meta.emailDelivered` (US-017, D-02).
  - Security at UI layer is presentational only; authoritative validation, sanitization, and rate limiting live server-side; no direct Supabase calls from the browser (US-038).

### 2.5 Contact (`/kontakt`)

- **View path:** `/kontakt`
- **Main purpose:** Provide direct contact details and location (US-005).
- **Key information to display:** Clickable email (`mailto:`) and phone (`tel:`), social links, Szczecin location as text, optional "Zobacz w Google Maps" link.
- **Key components:** `ContactDetails`, `SocialLinks`, `BaseLayout`.
- **UX, accessibility & security:** No heavy embedded map iframe in MVP (performance + non-consented cookies); `rel="noopener"` on social links.

### 2.6 Terms / Regulamin (`/regulamin`)

- **View path:** `/regulamin`
- **Main purpose:** Explain that the form is a quote request (not a commercial offer), modification (up to 48h before pickup), cancellation, confirmation, and 24h response time (US-006).
- **Key information to display:** Legal prose content (from generator), last-updated date at top.
- **Key components:** static `prose` content block, `BaseLayout`.
- **UX, accessibility & security:** Readable typography; long legal paragraphs are not i18n-keyed (only UI labels are). Linked from footer and from near the form.

### 2.7 Privacy Policy / Polityka prywatności (`/polityka-prywatnosci`)

- **View path:** `/polityka-prywatnosci`
- **Main purpose:** GDPR data-processing and cookie information (GA4, Clarity) (US-026).
- **Key information to display:** Generated privacy policy, cookie details, last-updated date, a "Zmień zgody" trigger that reopens the cookie banner.
- **Key components:** static `prose` content block, `ConsentReopenLink`, `BaseLayout`.
- **UX, accessibility & security:** Opened in new tab from the GDPR consent text (`rel="noopener"`); consent can be changed here and from the footer.

### 2.8 404 Not Found (`/404`)

- **View path:** any unmatched route
- **Main purpose:** Graceful recovery from broken/incorrect URLs.
- **Key information to display:** Polish error message, return links (Strona główna, Oferta, Zamówienia).
- **Key components:** static error block, `BaseLayout`.
- **UX, accessibility & security:** Consistent visual styling, correct `<title>`; static.

## 3. User Journey Map

### 3.1 Primary use case — submitting a quote request (US-001 → US-018)

1. **Entry & discovery.** User lands on Home (`/`) or via search/social. Hero communicates value; user can go directly to the form (primary CTA) or browse the offer first.
2. **Browse offer (optional).** User visits Oferta (`/oferta`), reviews categories, prices, shipping/pickup badges, and dietary info. A `cta_clicked` event fires when a CTA is clicked.
3. **Open the form.** Any CTA navigates to `/zamowienia`. First interaction with a field fires `form_started`.
4. **Fill the form** section by section:
   - Select category (RadioGroup cards) and write order details (≥ 20 chars).
   - Pick a pickup date (allowed window enforced visually).
   - Optionally attach an inspiration photo (preview + remove).
   - Enter name, email, phone (validated on blur).
   - Read terms link, check the required GDPR consent.
5. **Submit.** User clicks "Wyślij zapytanie" → button disables, shows spinner/"Wysyłanie…", `aria-busy` set. Full client validation runs first; if it fails, scroll + focus to the first invalid field.
6. **Server processing.** `POST /api/orders` (FormData). Server validates, optionally uploads photo, inserts the row, then best-effort sends emails.
7. **Success (`201`).** UI shows the neutral `SuccessBanner`, fires `form_submitted`, resets and hides/locks the form, moves focus to the banner, scrolls to `#potwierdzenie`, updates the URL. "Złóż kolejne zapytanie" restores a clean form.
8. **Confirmation (best-effort).** Customer email is attempted within ~2 min (D-02); UI never branches copy on delivery.

### 3.2 Error & edge-case branches

- **Field validation errors (`400 VALIDATION_ERROR`).** `fieldErrors` map 1:1 to inline messages at the relevant fields; fields are never cleared; focus moves to the first invalid field (US-029, US-032).
- **Rate limited (`429 RATE_LIMITED`).** Global `ErrorBanner` explains the hourly limit and offers phone/email contact; optional countdown derived from `Retry-After` (US-030).
- **Server/infra errors (`500/502/503` — `INTERNAL_ERROR`/`STORAGE_ERROR`/`DB_UNAVAILABLE`).** Global `ErrorBanner` asks the user to retry and shows alternative contact channel; form data preserved; retry without re-filling (US-029, US-041). Retry/backoff itself stays server-side.
- **File errors (`413 FILE_TOO_LARGE` / `415 UNSUPPORTED_FILE_TYPE`).** Caught client-side first for UX; if reached server-side, mapped to the photo field message (US-014-SIMPLIFIED).
- **Cookie consent.** First visit shows the banner; declining keeps full functionality and loads no analytics (US-026, US-037); choice is remembered; reopen via footer / privacy policy.
- **Wrong URL.** 404 view with return links.

## 4. Layout and Navigation Structure

### 4.1 Shared layout (`BaseLayout.astro`)

Every view is wrapped in `BaseLayout.astro`, which statically renders:

- **Header / main navigation** with 5 items (i18n labels):
  - "Strona główna" → `/`
  - "Oferta" → `/oferta`
  - "O nas" → `/o-nas`
  - "Zamówienia" → `/zamowienia`
  - "Kontakt" → `/kontakt`
    The active item is determined from `Astro.url.pathname` and marked with `aria-current="page"` (US-027).
- **Footer** on every page: social links (Instagram, Facebook, `rel="noopener"`), clickable `tel:`/`mailto:`, links to Regulamin and Polityka prywatności, a "Zmień zgody" link, and a short Szczecin location note. All texts from i18n (US-028).
- **Cookie banner**: a lightweight island that stores the choice in localStorage/cookie and dynamically injects GA4/Clarity only after consent (`PUBLIC_GA_MEASUREMENT_ID`, `PUBLIC_CLARITY_PROJECT_ID`); nothing analytical loads by default (US-026, US-037).
- **SEO props**: `title`/`description`/`ogImage` props with defaults; `LocalBusiness` schema.org rendered globally; `sitemap.xml`/`robots.txt` via the official Astro integrator (US-024, US-025).

### 4.2 Navigation behavior

- **Desktop:** horizontal nav bar, active item highlighted (`aria-current="page"`).
- **Mobile (US-027, US-034):** hamburger menu built with minimal JS (e.g. `<details>` / button with `aria-expanded`), closes on `Esc` and on link click, locks background scroll while open, traps focus inside the menu, touch targets ≥ 44×44 px.
- **Cross-view routing:** all conversion paths (Home hero CTA, Oferta CTAs) link to `/zamowienia`; the form is the only interactive destination. Terms is linked both near the form's submit button and in the footer; Privacy Policy is linked from the GDPR consent text and footer.

### 4.3 Focus & scroll management

- On submit validation failure: scroll + programmatic focus to the first invalid field.
- On success: programmatic focus to `SuccessBanner` (`tabindex="-1"`), scroll to `#potwierdzenie`, URL updated for deep-linking.
- Visible `:focus-visible` on all interactive elements; animations reduced under `prefers-reduced-motion`.

## 5. Key Components (cross-view)

- **`BaseLayout.astro`** — shared HTML shell: `lang="pl"`, SEO props, header nav, footer, cookie banner, global `LocalBusiness` schema. Used by all views.
- **Header / `Nav`** — 5-item navigation with active state via `Astro.url.pathname` + `aria-current`; mobile hamburger (`<details>`/`aria-expanded`, Esc close, focus trap, scroll lock).
- **`Footer`** — social links, clickable contact, legal links, "Zmień zgody", location note; i18n-driven.
- **`CookieBanner`** — light island controlling conditional GA4/Clarity injection after consent; reopenable from footer/privacy policy.
- **`CtaButton`** — primary/secondary CTA used on Home and Oferta; fires `cta_clicked` via `track()`.
- **`ProductCard` + `Badge`** — used across Oferta (and any Home gallery teaser); thumbnail, name, description, price, shipping/pickup badges; feeds `schema.org/Product`.
- **`OrderForm`** (React island, `client:visible`) — container orchestrating field subcomponents, the `useOrderSubmit` hook, and the state machine.
  - **Field subcomponents:** `CategoryField` (RadioGroup cards), `DetailsField` (+ counter), `PickupDateField` (Calendar), `PhotoUploadField` (preview + remove), `ContactFields` (name/email/phone), `ConsentField` (GDPR checkbox + Terms link).
  - **`SuccessBanner`** — neutral success message, focus target, "Złóż kolejne zapytanie".
  - **`ErrorBanner`** — global errors (`RATE_LIMITED`, `DB_UNAVAILABLE`, `STORAGE_ERROR`, `INTERNAL_ERROR`) with alternative contact and optional `Retry-After` countdown.
  - **`CharacterCounter`** — reusable "X/limit" with `aria-live="polite"` for `details` and `notes`.
  - **`useOrderSubmit`** — submission logic: builds `FormData`, posts to `/api/orders`, maps `fieldErrors`, manages `idle → submitting → success | error`, triggers `track()` events.
- **`SocialLinks` / `ContactDetails`** — reused on About, Contact, and Footer; `rel="noopener"`, clickable `tel:`/`mailto:`.
- **`<Image>` (Astro)** — used everywhere for responsive webp/avif, srcset, fixed dimensions (CLS), consistent ratios (4:3 cards, 16:9 hero), lazy except hero.
- **Shared modules (single source of truth):**
  - `src/lib/schemas/order.ts` — one Zod schema for the API endpoint and the RHF resolver.
  - `src/lib` constants — `ORDER_MAX_PICKUP_DAYS`, length limits, TTLs.
  - `src/i18n/pl/` — thematic JSON (`common`, `nav`, `form`, `errors`, `oferta`/`categories`) with a `t(key)` helper; ENUM → Polish label map shared by form, Oferta, and emails.
  - `track(event)` — analytics helper, no-op without consent (`form_started`, `form_submitted`, `cta_clicked`).
  - `brand.ts` — lightweight email branding (name, colors, logo PNG, contact, `SITE_URL`) reusing i18n labels for React Email templates.
