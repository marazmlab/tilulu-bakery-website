# MVP Definition - Tilulu Bakery

## Main User Problem

### Bakery Customer

"I want to order a cake/pastry for an event, I need a place where I can check what the bakery offers. I need a simple way to place an order online and communicate to the owner about the need for further communication"

### Bakery Owner

"I want to have one website that would be my business card and have a form that will make it easier for people to make choices and orders. There aren't many orders right now, so the problem isn't managing orders, but having one consistent path for people to do this. Ultimately, the website should be a tool for documenting work for further business development"

---

## WHAT'S INCLUDED IN MVP

### Public Pages

**7 routes total:** 5 in main navigation + Regulamin + Polityka prywatności (aligned with project routing rules).

1. **Home page** (`/`) — hero section, brief description, product photos, CTA "See our work"
2. **Offer** (`/oferta`) — product gallery (cakes, pastries, cookies, alfajores) with descriptions and approximate prices — reference info
3. **About us** (`/o-nas`) — bakery history, values, owner/team photo
4. **Orders** (`/zamowienia`) — order form
5. **Contact** (`/kontakt`) — contact details, social media
6. **Order terms** (`/regulamin`) — linked from footer and near the form (not in main nav)
7. **Privacy policy** (`/polityka-prywatnosci`) — GDPR, cookies (footer link)

### Order Form

1. Product category selection — 5 options (DB ENUM source of truth): tort okazjonalny, ciasta, ciastka, alfajory, inne (`tort_okazjonalny`, `ciasta`, `ciastka`, `alfajory`, `inne`)
2. Textarea for order details (20–1000 characters) — flavor, size, colors, decorations etc.
3. Pickup date (no time — arranged after contact; min. `pickup_date >= (current_date + INTERVAL '2 days')`)
4. Customer data: name, email, phone
5. Optional: inspiration photo (upload, max 5 MB)
6. Validation: required fields, email/phone format, pickup date per calendar-day rule above
7. GDPR consent (required)
8. Additional notes (optional, ≤500 characters)

### Backend

1. Save order to Supabase (orders table) with RLS policies
2. Server-side validation (Zod) and rate limiting (5 inquiries/IP/hour target — in-memory per Vercel instance; D-04)
3. Attempt to send email to owner with details (best-effort, target ≤ 2 min after INSERT)
4. Attempt automatic response to customer: "Thank you for your order, please wait for contact" (best-effort, target ≤ 2 min after INSERT)
5. Upload security (MIME type validation, maximum file size)
6. Persist email outcome on each order: `email_delivered`, `email_error` (visible in Supabase Dashboard)

**Email delivery (best-effort, D-02):** inquiry is saved regardless of email outcome; failed sends are recorded on the order row (`email_delivered = false`, `email_error`) for the owner — not shown in customer UI (see PRD §3.3.2). Canonical success message: *„Dziękujemy! Twoje zapytanie zostało wysłane. Odpowiemy w ciągu 24 godzin.”*

### Owner Access

1. Login to Supabase Dashboard
2. Browse orders table (chronological orders); filter/sort by `email_delivered` when investigating failed notifications
3. Optional: Status column (new/confirmed/completed) - manual change in dashboard

---

## WHAT'S NOT INCLUDED IN MVP

### Advanced Features

- Custom admin panel UI (owner uses Supabase Dashboard)
- Online payment system (order + payment on pickup)
- SMS notifications (moved to Phase 2)
- User accounts / order history for customers
- Availability calendar / appointment booking
- Language versions (English and others)
- Customer review / rating system

### Technical Features

- PWA / offline mode
- Real-time updates
- Advanced analytics (Google Analytics is sufficient)
- CDN for images (optionally later)

### Business Features

- Accounting system integration
- Automatic invoices
- Loyalty program

---

## MVP SUCCESS CRITERIA

### Technical

1. ✅ Website works on mobile and desktop devices (responsive)
2. ✅ Form validates data server-side (Zod) and client-side
3. ✅ Security: RLS policies, rate limiting, upload validation
4. ✅ Page loads in <3s (Lighthouse score >80)
5. ✅ Zero browser console errors

### Business (Owner)

1. ✅ System attempts owner notification email within 2 min of each new order (best-effort; order saved even if send fails)
2. ✅ Can browse all orders in Supabase Dashboard
3. ✅ Email contains all necessary data to contact customer (when `email_delivered = true`; failures visible via `email_error` in Dashboard)
4. ✅ Secure storage of customer data (Supabase RLS)

### User Experience (Customer)

1. ✅ Can place order in <3 minutes
2. ✅ Gets confirmation that order was received (UI success on INSERT; email is supplementary, best-effort)
3. ✅ Sees bakery offer with photos and prices

### Deployment

1. ✅ Website publicly accessible - own domain
2. ✅ Works 24/7 without your intervention

---

## SIMPLIFIED PROJECT SCOPE

```
MVP = 7 routes (5 nav + Regulamin + Polityka prywatności) + 1 form + email + database + security
Implementation time: ~20-30 hours of work
Complexity: Low (ideal for start)
```

### Technology Stack

- **Frontend:** Astro + React (form and gallery only) + Tailwind CSS + shadcn/ui
- **Backend:** Astro API endpoints
- **Database:** Supabase (PostgreSQL) with RLS policies
- **Storage:** Supabase Storage (inspiration photos)
- **Email:** Resend
- **SMS:** SMSAPI.pl (moved to Phase 2)
- **Security:** Server-side validation (Zod), rate limiting, upload validation
- **Hosting:** Vercel (better support for API endpoints)
- **Domain:** tilulu.pl/.com/.eu (to purchase)
- **Design:** Wireframe + Figma template OR design-as-you-code

### Key Decisions

1. **Lead time:** Minimum 2 calendar days — `pickup_date >= (current_date + INTERVAL '2 days')` (today and tomorrow blocked)
2. **No order limit:** Owner has flexible working hours
3. **Photo storage:** Private bucket **`inspirations`** (D-05); object key `{order_id}.{ext}`; 5 MB max; owner access via signed URL in email (TTL **7 days**, D-03)
4. **Notifications:** Email only in MVP (SMS in Phase 2); dispatch best-effort after INSERT (D-02)
5. **Branding:** Unsplash placeholders first, real photos later
6. **Language:** Polish only (i18n-ready structure for future)
7. **React usage:** For interactive components only (form, gallery)
8. **Security-first:** RLS, server-side validation, rate limiting from MVP — per-instance in-memory only, no cross-instance store (D-04)
9. **Email semantics (D-02):** INSERT = inquiry accepted; mail best-effort; one neutral UI success message; `email_delivered` / `email_error` for owner in Dashboard
10. **Signed URL TTL (D-03):** 7 days (`604800` s) for inspiration photo link in owner email
11. **Rate limit scope (D-04):** 5/IP/hour per warm serverless instance; best-effort on Vercel; no KV/Redis in MVP
12. **Storage bucket (D-05):** Bucket `inspirations` (`STORAGE_INSPIRATION_BUCKET`); key `{order_id}.{ext}`; no anon/authenticated Storage policies; API `service_role` only
13. **Indexes (D-06):** No secondary indexes in MVP — `orders_created_at_desc_idx` not created
14. **Name length (D-07):** 1–200 chars, Zod only — no DB CHECK on `orders.name`

---

## Development Roadmap (Beyond MVP)

### Phase 2: SMS + Cart + Builder

- SMS notifications (SMSAPI.pl)
- Multi-product cart with localStorage
- 5-step cake builder (interactive wizard)
- Multiple photo uploads (up to 3)
- Mini cart widget in navigation
- Advanced error handling

### Phase 3: Custom Admin Panel

- Custom UI for owner
- Order status management
- Automatic emails to customers after status changes
- Basic statistics

### Phase 4: Customer Accounts

- Registration/login
- Order history
- Status tracking
- Newsletter

### Backlog

- Online payments
- Mobile application

---

## Creation Date

**Version:** 1.1  
**Date:** 2026-04-25  
**Last update:** SMS removed from MVP (moved to Phase 2), security scope added, shadcn/ui and Vercel clarified  
**Based on:** PRD Planning Session + technology stack analysis
