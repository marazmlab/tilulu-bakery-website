# MVP Definition - Tilulu Bakery

## Main User Problem

### Bakery Customer

"I want to order a cake/pastry for an event, I need a place where I can check what the bakery offers. I need a simple way to place an order online and communicate to the owner about the need for further communication"

### Bakery Owner

"I want to have one website that would be my business card and have a form that will make it easier for people to make choices and orders. There aren't many orders right now, so the problem isn't managing orders, but having one consistent path for people to do this. Ultimately, the website should be a tool for documenting work for further business development"

---

## WHAT'S INCLUDED IN MVP

### Public Pages

1. **Home page** - hero section, brief description, product photos, CTA "See our work"
2. **Offer** - product gallery (cakes, pastries, cookies, alfajores) with descriptions and approximate prices - reference info
3. **About us** - bakery history, values, owner/team photo
4. **Orders** - order form
5. **Contact** - contact details, social media

### Order Form

1. Product category selection (cake, pastry, cookies, alfajores)
2. Textarea for order details (500-1000 characters) - flavor, size, colors, decorations etc.
3. Pickup date (no time - arranged after contact)
4. Customer data: name, email, phone
5. Optional: inspiration photo (upload, max 5 MB)
6. Validation: required fields, email/phone format, future date (min. +48h)

### Backend

1. Save order to Supabase (orders table) with RLS policies
2. Server-side validation (Zod) and rate limiting (5 inquiries/IP/hour)
3. Send email to owner with details
4. Automatic response to customer: "Thank you for your order, please wait for contact"
5. Upload security (MIME type validation, maximum file size)

### Owner Access

1. Login to Supabase Dashboard
2. Browse orders table (chronological orders)
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

1. ✅ Receives email with each new order in <2 min
2. ✅ Can browse all orders in Supabase Dashboard
3. ✅ Email contains all necessary data to contact customer
4. ✅ Secure storage of customer data (Supabase RLS)

### User Experience (Customer)

1. ✅ Can place order in <3 minutes
2. ✅ Gets confirmation that order was received
3. ✅ Sees bakery offer with photos and prices

### Deployment

1. ✅ Website publicly accessible - own domain
2. ✅ Works 24/7 without your intervention

---

## SIMPLIFIED PROJECT SCOPE

```
MVP = 5 pages + 1 form + email + database + security
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

1. **Lead time:** Minimum 48 hours (date blocking: today + tomorrow)
2. **No order limit:** Owner has flexible working hours
3. **Photo storage:** Supabase Storage (5 MB max)
4. **Notifications:** Email only in MVP (SMS in Phase 2)
5. **Branding:** Unsplash placeholders first, real photos later
6. **Language:** Polish only (i18n-ready structure for future)
7. **React usage:** For interactive components only (form, gallery)
8. **Security-first:** RLS, server-side validation, rate limiting from MVP

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
