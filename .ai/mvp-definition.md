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

1. Save order to Supabase (orders table)
2. Send email to owner with details and send SMS notification
3. Automatic response to customer: "Thank you for your order, please wait for contact"

### Owner Access

1. Login to Supabase Dashboard
2. Browse orders table (chronological orders)
3. Optional: Status column (new/confirmed/completed) - manual change in dashboard

---

## WHAT'S NOT INCLUDED IN MVP

### Advanced Features

- Custom admin panel UI (owner uses Supabase Dashboard)
- Online payment system (order + payment on pickup)
- User accounts / order history for customers
- Availability calendar / appointment booking
- Language versions (English and others)
- Blog / news
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
- Coupons / discount codes

---

## MVP SUCCESS CRITERIA

### Technical

1. ✅ Website works on mobile and desktop devices (responsive)
2. ✅ Form validates data before submission
3. ✅ Owner receives SMS notification about email
4. ✅ Page loads in <3s (Lighthouse score >80)
5. ✅ Zero browser console errors

### Business (Owner)

1. ✅ Receives email with each new order in <2 min
2. ✅ Receives SMS notification about email
3. ✅ Can browse all orders in Supabase Dashboard
4. ✅ Email contains all necessary data to contact customer

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
MVP = 5 pages + 1 form + email + SMS + database
Implementation time: ~20-30 hours of work
Complexity: Low (ideal for start)
```

### Technology Stack

- **Frontend:** Astro + React + Tailwind CSS + shadcn/ui
- **Backend:** Astro API endpoints
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (inspiration photos)
- **Email:** Resend or SendGrid
- **SMS:** SMSAPI.pl or Twilio
- **Hosting:** Cloudflare Pages or Vercel
- **Domain:** tilulu.pl/.com/.eu (to purchase)

### Key Decisions

1. **Lead time:** Minimum 48 hours (date blocking: today + tomorrow)
2. **No order limit:** Owner has flexible working hours
3. **Photo storage:** Supabase Storage (5 MB max)
4. **Notifications:** Email + SMS for delivery assurance
5. **Branding:** Placeholders (logo, colors) - to be updated in future
6. **Language:** Polish only (i18n-ready structure for future)

---

## Development Roadmap (Beyond MVP)

### Phase 2: Admin Panel
- Custom UI for owner
- Order status management
- Automatic emails to customers after status changes
- Basic statistics

### Phase 3: UX Improvements
- Products in database (instead of hardcoded)
- Calendar with blocked dates
- Enhanced gallery (lightbox)
- FAQ

### Phase 4: Customer Accounts
- Registration/login
- Order history
- Status tracking
- Newsletter

### Backlog
- Online payments
- Discount codes
- Blog
- Mobile application
- AI cake design generator

---

## Creation Date

**Version:** 1.0  
**Date:** 2025-03-30  
**Based on:** PRD Planning Session
