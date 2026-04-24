# Product Requirements Document (PRD) - Tilulu Bakery

## 1. Product Overview

Tilulu Bakery is a website for a home bakery located in Szczecin, Poland. The product serves a dual role: an online business card showcasing the bakery's offerings and a central point for accepting quote requests from customers.

The website replaces scattered communication channels (Instagram DM, WhatsApp, phone) with a unified interface where customers can browse products with photos and prices, then submit quote requests through a simple form. The owner receives email and SMS notifications for each new inquiry, and all data is stored in a Supabase database.

Future development phases include adding an interactive multi-product cart and a 5-step cake builder, enabling more advanced order composition.

The product targets two user groups: bakery customers (primarily women aged 30-60, Szczecin area and surroundings, with shipping available nationwide in Poland) and the bakery owner who manages orders through Supabase Dashboard.

### Key MVP Assumptions (Phase 1)
- Simple order form with textarea for product description - no builder or cart
- Form is a quote request, not a purchase - every order requires owner confirmation
- No online payment system - cash on pickup or private bank transfer
- No admin panel - owner uses Supabase Dashboard
- No user accounts - customers place orders without registration
- Language: Polish only (i18n-ready structure for the future)
- Photos and content hardcoded in code with placeholders initially

### Development Roadmap
- **Phase 1 (MVP)**: 5 public pages + simple form + email/SMS + Supabase Dashboard
- **Phase 2**: Multi-product cart + 5-step cake builder + advanced error handling
- **Phase 3**: Custom admin panel + status management + automated emails
- **Phase 4**: Customer accounts + order history + status tracking

### Tech Stack
- Frontend: Astro + React + Tailwind CSS + shadcn/ui
- Backend: Astro API endpoints
- Database: Supabase (PostgreSQL)
- Storage: Supabase Storage (inspiration photos)
- Email: Resend (React Email)
- SMS: SMSAPI.pl
- Hosting: Cloudflare Pages or Vercel
- State management (Phase 2+): Zustand or Context API + localStorage
- Analytics: Google Analytics 4 + Microsoft Clarity

## 2. User Problem

### Bakery Customer

The customer is looking for a cake or pastry for an occasion (birthday, wedding, gathering). They need a single place where they can check the bakery's offerings with photos and prices, then place an order online in a simple way. Currently, they must search for information on Instagram, send DMs or call, which is inefficient and provides no assurance that the inquiry reached the owner. The customer doesn't know what options are available, how much they cost, and what the ordering process looks like.

Additional customer problems:
- No centralized product catalog with indicative pricing
- No structured way to describe an order (especially custom cakes with multiple parameters)
- No confirmation that the inquiry was received
- Need for separate contact for each product in multi-product orders (e.g., cake + cookies for the same event)

### Bakery Owner

The owner runs a home bakery and needs a professional online business card with a form that standardizes the order intake process. Currently, inquiries come chaotically through various channels, making them difficult to track. There's no issue with order volume (3-4 weekly), but with lack of a unified process. The website is also intended to serve as a tool for documenting work and business development.

Additional owner problems:
- No order history in one place
- Risk of missing inquiries coming through DM or phone
- No professional presentation of offerings that would attract new customers
- Repeated questions about the same information (prices, available flavors, timelines)

## 3. Functional Requirements

---

## PHASE 1: MVP (Base Version)

### 3.1 Public Pages

#### 3.1.1 Homepage
- Hero section with main photo and brief bakery description
- Gallery of selected projects (photos of cakes and pastries)
- Brief description of offerings and bakery values
- CTA directing to orders page ("View Offer" / "Place Order")
- Responsive layout (mobile-first)

#### 3.1.2 Products
- Three product categories displayed on one page:
  - Occasion/custom cakes: indicative pricing ("from X PLN"), gallery, description
  - Standard pastries (cookies, alfajores, cakes): concrete pricing (per piece, kilogram, or portion)
  - Other custom cakes (including gluten-free/vegan): indicative pricing
- Product cards with thumbnail, name, brief description, and price
- "Shipping Available" badge for products available for package delivery (cookies, alfajores)
- "In-Person Pickup" badge for products requiring pickup (cakes)
- Information about special order options (dietary, gluten-free, vegan)
- CTA directing to order form

#### 3.1.3 About Us
- Bakery history and values
- Owner/team photo
- Social media profile links (Instagram, Facebook)
- Optional: Instagram post grid (dependent on Instagram Business API, decision deferred)

#### 3.1.4 Contact
- Contact details (email, phone)
- Social media links (Instagram, Facebook)
- Location information (Szczecin)

#### 3.1.5 Order Terms
- Information that the form constitutes a quote request, not a commercial offer
- Order modification rules (up to 48h before planned pickup)
- Cancellation policy
- Information about phone/email confirmation of every order
- Information about response time (within 24h)
- Link to terms visible near order form

#### 3.1.6 Privacy Policy
- Generated privacy policy (generator)
- Personal data processing information (GDPR)
- Cookie information (GA4, Microsoft Clarity)

#### 3.1.7 Common Elements (layout)
- Main navigation: Homepage, Products, About Us, Orders, Contact
- Footer on every page: social media links (Instagram, Facebook), contact details, terms link, privacy policy link
- Cookie banner (consent for GA4 and Microsoft Clarity)

### 3.2 Order Form (MVP - simple)

Simple, structural form accessible from a separate "Orders" page:

- Product category selection:
  - Radio buttons: Occasion Cake / Cake / Cookies / Alfajores / Other
  - Required field

- Order details:
  - Textarea (500-1000 characters)
  - Placeholder: "Describe what you need: flavor, size, colors, decorations, number of servings, special requirements..."
  - Character counter
  - Required field

- Contact details:
  - Name (text field, required)
  - Email (text field, required, format validation)
  - Phone (text field, required, Polish number format validation, auto-formatting)

- Pickup date:
  - Calendar picker
  - Past dates blocked
  - Dates closer than 48h from today blocked (today + 2 days minimum)
  - Maximum horizon: to be determined with owner
  - No time selection (arranged after contact)
  - Required field

- Inspiration photo upload:
  - 1 photo (optional)
  - 5 MB limit
  - Accepted formats: JPG, PNG, WEBP
  - Thumbnail preview after file selection
  - Optional field

- Additional notes:
  - Textarea (maximum 500 characters)
  - Character counter
  - Optional field
  - Information about shipping option for selected products

- GDPR consent:
  - Checkbox (required)
  - Text with link to privacy policy

- Link to order terms

- "Submit Inquiry" button

Form validation:
- Frontend: validation of all fields before submission (required fields, email/phone formats, future date min. +48h, textarea length)
- Backend: server-side validation duplication
- Error messages in Polish, displayed inline at respective fields

### 3.3 Backend and Order Processing

#### 3.3.1 Order Storage
- Astro API endpoint accepting form data
- Server-side data validation (frontend validation duplication)
- Input sanitization (XSS and SQL injection protection)
- Order saved to orders table in Supabase (PostgreSQL)
- Inspiration photo uploaded to Supabase Storage (if added)
- Order status column: new/confirmed/completed (manual change in Supabase Dashboard)
- RLS (Row Level Security) policies in Supabase

#### 3.3.2 Customer Email
- HTML template (Resend + React Email)
- Branding: logo (placeholder), brand colors (placeholder), footer with contact details
- Content:
  - Thank you for choosing our offer
  - Information about response time (within 24h)
  - Order summary: product category, order details, pickup date, additional notes
  - Signature: bakery name
- Sent within 2 minutes of inquiry submission

#### 3.3.3 Owner Email
- Complete order details: product category, order details (textarea content), customer contact details, pickup date, notes, inspiration photo link
- All data needed for customer contact

#### 3.3.4 Owner SMS
- SMSAPI.pl (~0.10 PLN/SMS)
- Short format: "New order: [Name], [Category], [Pickup Date]. Check email."
- Sent simultaneously with email

#### 3.3.5 Rate Limiting
- Maximum 5 inquiries per IP address per day
- No CAPTCHA (negative UX impact)

### 3.4 Error Handling (MVP - basic)

- Form validation: error messages in Polish, displayed inline at fields
- Duplicate submission prevention: button deactivation after click + loading state (spinner/text)
- Backend error handling: 3x retry with exponential backoff on Supabase timeout
- User-friendly error messages: readable messages instead of error codes
- Loading states: visual loading indicators during form processing and photo upload
- Graceful degradation: user information in case of external service unavailability

### 3.5 SEO

- Meta tags (title, description) on every page
- Open Graph tags (og:title, og:description, og:image) for social media sharing
- Schema.org: LocalBusiness (bakery data), Product (products in offering)
- Automatically generated sitemap.xml
- robots.txt
- Semantic HTML (headings, alt in images)
- 5-10 key phrases to be determined with owner (workshop method)
- Google Business Profile as separate task outside MVP scope

### 3.6 Analytics

- Google Analytics 4: pageviews, conversion rate, traffic sources
- Microsoft Clarity: heatmaps, session recordings
- Custom events:
  - form_started: customer opened orders page
  - form_submitted: customer submitted inquiry
  - cta_clicked: customer clicked main call-to-action
- Cookie banner with option to consent/decline

### 3.7 Performance

- Page load time below 3 seconds
- Lighthouse score above 80 (Performance, Accessibility, Best Practices, SEO)
- Image optimization (lazy loading, appropriate formats and sizes)
- JavaScript minimization (Astro islands architecture)
- Zero browser console errors

### 3.8 Internationalization

- MVP exclusively in Polish
- Structure prepared for i18n: all UI texts in JSON translation files
- No language switching implementation in MVP

---

## PHASE 2: Feature Extension (Cart + Builder)

### 3.9 Cart System (PHASE 2)

- Global state managed by Zustand or Context API
- Cart persistence in localStorage (survives page refresh)
- Adding products from Products page:
  - Cakes: clicking "Build" opens modal with builder (5 steps)
  - Standard pastries: clicking "Add" opens modal with quantity selector
  - Other cakes: clicking "Add" opens modal with description field and quantity
- Mini cart widget in navigation (icon + product count)
- Full cart view (separate page or expanded panel):
  - List of added products with configuration summary
  - Ability to change quantity (standard pastries)
  - Ability to remove product
  - Ability to edit cake configuration (return to builder)
  - Indicative order total
  - CTA "Proceed to Form"
- Ability to add multiple cakes (e.g., 2 different cakes for the same occasion)
- Ability to compose boxes (e.g., mixed cookies and alfajores)

### 3.10 5-Step Cake Builder (PHASE 2)

Five-step builder displayed in modal, launched from Products page:

- Step 1 - Cake Size:
  - Type: classic (2 layers) or tall (4 layers)
  - 4 sizes for each type (8 options total)
  - Indicative price displayed for each size ("from X PLN")
  - Radio buttons or cards with size visualization

- Step 2 - Sponge Cake:
  - 3 options: vanilla, cocoa, lemon
  - Radio buttons with description

- Step 3 - Creams and Mousses:
  - 4 cream/mousse categories
  - ~17 options to choose from
  - Selection logic details (one cream for entire cake vs separate per layer) to be determined with owner

- Step 4 - Optional Add-ons:
  - ~17 options (jellies, fruits, sprinkles, etc.)
  - Checkboxes (multiple selection)
  - Optional step - can be skipped

- Step 5 - Frosting:
  - 3 external finish options
  - Radio buttons with description/photo

Builder UI elements:
- Progress bar (Step X/5)
- Back/Next navigation
- Live summary preview on right side (desktop) or bottom (mobile)
- "Add to Cart" button on final step
- Placeholders for ingredient icons (target: icons with colors and texture)

### 3.11 Cart Checkout Form (PHASE 2)

Extended form displayed after clicking "Proceed to Form" from cart:

- Cart summary (read-only, with edit link)
- Contact details (as in MVP)
- Pickup date (as in MVP)
- Shipping option:
  - Checkbox "I want to receive the order by package" (visible only when cart contains products with shipping option)
  - Information: "Shipping costs and details arranged after contact. Shipping within Poland only."
  - Disclaimer about no liability for potential transport damage
- Inspiration photo upload:
  - Maximum 3 photos
  - 5 MB limit per photo
  - Accepted formats: JPG, PNG, WEBP
  - Frontend compression (browser-image-compression) before upload
  - Thumbnail preview before submission
- Additional notes (extended to 1000 characters)
- GDPR consent
- Terms link
- "Submit Inquiry" button

### 3.12 Advanced Error Handling (PHASE 2)

- Upload fail: message "Failed to add photo, try again" + Retry button
- Abandoned form: automatic draft save in localStorage (expires after 30 days), message on return "You have an incomplete order, want to continue?"
- Cart persistence between sessions

### 3.13 Product Modals with Lightbox (PHASE 2)

- Clicking product card on Products page opens modal with details
- Modal contains enlarged photos, full description, and options
- Lightbox for photo enlargement with navigation (previous/next)
- Modal contains appropriate CTA button for category ("Build" for cakes, "Add" for standard pastries)
- Closing modal restores Products page view without losing scroll position
- Responsive design (fullscreen on mobile)

## 4. Product Boundaries

### In Scope for MVP (Phase 1)

- 5 public pages (Homepage, Products, About Us, Orders, Contact, Terms) + Privacy Policy
- Simple order form with category selection and textarea for details description
- 1 inspiration photo upload (optional, max 5 MB)
- Order storage to Supabase
- HTML email to customer (confirmation + summary)
- Detailed email to owner
- SMS to owner (SMSAPI.pl)
- Order browsing through Supabase Dashboard
- Manual order status change in Supabase Dashboard
- Basic SEO (meta tags, Open Graph, schema.org, sitemap, robots.txt)
- Google Analytics 4 + Microsoft Clarity
- Cookie banner (GDPR)
- Responsive design (mobile + desktop)
- Rate limiting (5 inquiries/IP/day)
- Basic error handling (validation, retry, duplicate prevention, loading states)
- Hardcoded photos and content with placeholders
- i18n-ready structure (JSON files) without language switching implementation

### Planned for Phase 2

- **Multi-product cart:**
  - Persistence in localStorage
  - Mini-widget in navigation
  - Adding multiple products
  - Quantity editing and product removal
  - Indicative order total

- **5-step cake builder:**
  - Interactive wizard with progress bar
  - Selection of size, sponge, creams, add-ons, and frosting
  - Live configuration preview
  - Back/next navigation with state preservation
  - ~40 options to choose from

- **Product modals:**
  - Product details in modal
  - Lightbox for photo gallery
  - CTA "Build" / "Add"

- **Advanced error handling:**
  - Abandoned form (localStorage draft recovery)
  - Upload retry for multiple photos
  - Extended error messages

- **Multiple photo upload:**
  - Up to 3 inspiration photos
  - Frontend compression
  - Thumbnail preview

- **Extended form:**
  - Package shipping option with conditioning
  - Extended notes (1000 characters)
  - Cart integration

- **Extended analytics:**
  - Custom events: builder_started, builder_completed, product_added_to_cart
  - Cart conversion funnel tracking

### Planned for Phase 3: Admin Panel

- Custom UI for owner (instead of Supabase Dashboard)
- Order status management from interface
- Automated customer emails after status changes
- Basic statistics (order count, popular products)
- Products in database (instead of hardcoded)
- Calendar with occupied date blocking

### Planned for Phase 4: Customer Accounts

- Registration/login
- Order history
- Order status tracking
- Newsletter
- Enhanced gallery with filters

### Out of Scope for Entire Product (beyond roadmap)

- Online payment system
- Accounting system integration
- Automated invoicing
- Loyalty program
- Coupons / discount codes (decision deferred)
- Blog / news
- Customer ratings and reviews system (decision deferred)
- PWA / offline mode
- Real-time updates
- CDN for images (may be added optionally)
- Instagram grid with API (decision deferred)
- Google Business Profile (separate marketing task)
- Storybook / ADR / user manual
- Availability calendar / online appointment booking
- Language versions (English and others)

## 5. User Stories

### Browsing Offerings (MVP)

**[MVP] US-001**
Title: Browsing Homepage
Description: As a customer, I want to see the bakery's homepage with hero section, project gallery, and description, so I can quickly understand what the bakery does and whether its offerings interest me.
Acceptance Criteria:
- Homepage displays hero section with photo and brief bakery description
- Project gallery presents minimum 3 pastry photos
- CTA button directing to Orders or Products page is visible
- Page is responsive and displays correctly on mobile devices (320px+ width) and desktop
- Page load time doesn't exceed 3 seconds

**[MVP] US-002**
Title: Browsing Product Offerings
Description: As a customer, I want to browse the bakery's complete offerings divided into categories with photos and prices, so I know what to expect and how much products cost approximately.
Acceptance Criteria:
- Products page displays products in three categories: Occasion/custom cakes, Standard pastries, Other custom cakes
- Each product is presented as a card with photo thumbnail, name, brief description, and price
- Cakes and other custom cakes have indicative prices ("from X PLN")
- Standard pastries have concrete prices (per piece, kilogram, or portion)
- Products with package shipping option have visible "Shipping Available" badge
- Products requiring in-person pickup have "In-Person Pickup" badge
- Page is accessible from main navigation
- CTA directing to order form is visible

**[MVP] US-004**
Title: Browsing About Us Page
Description: As a customer, I want to read about the bakery's history and values, so I can get to know the people behind the brand and build trust before placing an order.
Acceptance Criteria:
- About Us page contains text about bakery history and values
- Owner/team photo is displayed
- Social media profile links are visible (Instagram, Facebook)
- Page is accessible from main navigation

**[MVP] US-005**
Title: Browsing Contact Details
Description: As a customer, I want to find the bakery's contact details, so I can contact them directly if I have questions beyond the form.
Acceptance Criteria:
- Contact page displays bakery email address
- Contact page displays bakery phone number
- Social media profile links are visible (Instagram, Facebook)
- Location information is displayed (Szczecin)
- Page is accessible from main navigation

**[MVP] US-006**
Title: Browsing Order Terms
Description: As a customer, I want to read the order terms before submitting an inquiry, so I know the modification, cancellation, and confirmation rules.
Acceptance Criteria:
- Terms page contains information that form constitutes a quote request
- Order modification rules are described (up to 48h before pickup)
- Cancellation policy is described
- Information about phone/email confirmation is included
- Information about response time (within 24h) is included
- Terms are accessible from link near order form and from footer

### Placing Order (MVP)

**[MVP] US-012**
Title: Filling Out Order Form
Description: As a customer, I want to fill out a simple form with category selection and order description, so I can quickly send an inquiry to the bakery without unnecessary complications.
Acceptance Criteria:
- Form contains product category selection (radio buttons: Cake/Pastry/Cookies/Alfajores/Other)
- Form contains "Order Details" textarea (500-1000 characters) with counter
- Form contains contact detail fields: name, email, phone (all required)
- Email field validates email address format correctness
- Phone field validates Polish phone number format and auto-formats entered number
- All required fields are marked
- Validation error messages are displayed in Polish at respective fields
- Form doesn't allow submission when validation is not met

**[MVP] US-013**
Title: Selecting Pickup Date
Description: As a customer, I want to select order pickup date from calendar, so I can specify when I need the products.
Acceptance Criteria:
- Form contains calendar picker for date selection
- Past dates are blocked (unavailable for selection)
- Dates closer than 48h from inquiry date are blocked
- Customer doesn't select time (arranged after contact with owner)
- Selecting blocked date is technically impossible (dates are grayed out/unavailable)
- Date field is required

**[MVP] US-014-SIMPLIFIED**
Title: Uploading Inspiration Photo
Description: As a customer, I want to attach an inspiration photo to the order, so I can show the bakery what visual effect I'd like to achieve.
Acceptance Criteria:
- Form enables 1 photo upload
- Accepted formats: JPG, PNG, WEBP
- Maximum size: 5 MB
- Thumbnail preview is displayed after file selection
- Customer can remove added photo before form submission
- Photo upload is optional
- Attempting to upload file in unsupported format displays message about accepted formats
- Attempting to upload file exceeding 5 MB displays message about size limit

**[MVP] US-015-SIMPLIFIED**
Title: Adding Notes to Order
Description: As a customer, I want to add text notes to the order, so I can convey additional information (e.g., dietary preferences, special wishes, shipping information).
Acceptance Criteria:
- Form contains "Additional Notes" textarea field
- Field displays character counter (X/500)
- Maximum text length: 500 characters
- Field is optional
- Text beyond limit is not accepted
- Placeholder suggests possibility of describing package shipping need

**[MVP] US-016**
Title: Expressing GDPR Consent
Description: As a customer, I want to express consent to processing my personal data, so my inquiry can be processed in compliance with data protection regulations.
Acceptance Criteria:
- Form contains GDPR consent checkbox
- Consent text contains link to privacy policy
- Checkbox is required - form cannot be submitted without checking
- Not checking checkbox displays message about consent requirement

**[MVP] US-017**
Title: Submitting Quote Request
Description: As a customer, I want to submit a complete quote request, so the bakery receives my order and contacts me.
Acceptance Criteria:
- "Submit Inquiry" button is active only when all required fields are correctly filled
- After clicking, button is deactivated and displays loading state (spinner or "Submitting..." text)
- Form data is validated server-side before storage
- Order is saved to Supabase database
- Inspiration photo is uploaded to Supabase Storage (if added)
- Confirmation email is sent to customer
- Detailed email is sent to owner
- SMS is sent to owner
- After successful submission, customer sees message confirming inquiry acceptance
- In case of server error, message with retry request is displayed
- Re-clicking button during processing doesn't cause duplicate

**[MVP] US-018**
Title: Receiving Confirmation Email
Description: As a customer, I want to receive email confirming inquiry submission, so I'm assured my message reached the bakery and know the next steps.
Acceptance Criteria:
- Email is sent to address provided in form within 2 minutes of inquiry submission
- Email contains thank you for choosing the offer
- Email contains information about response time (within 24h)
- Email contains order summary (category, details, pickup date, notes)
- Email is in HTML format with bakery branding (logo, colors, footer with contact details)
- Email contains signature with bakery name

### Owner Notifications (MVP)

**[MVP] US-020**
Title: Receiving Email About New Order
Description: As the owner, I want to receive email with complete new order details, so I have all data needed for customer contact and order fulfillment.
Acceptance Criteria:
- Email is sent to owner's address within 2 minutes of inquiry submission
- Email contains product category and complete details from textarea
- Email contains customer contact details (name, email, phone)
- Email contains selected pickup date
- Email contains additional notes (if provided)
- Email contains inspiration photo link (if added)

**[MVP] US-021**
Title: Receiving SMS About New Order
Description: As the owner, I want to receive SMS about new order, so I can react quickly even when not checking email.
Acceptance Criteria:
- SMS is sent to owner's number simultaneously with email
- SMS has format: "New order: [Name], [Category], [Pickup Date]. Check email."
- SMS is sent through SMSAPI.pl

**[MVP] US-022**
Title: Browsing Orders in Supabase Dashboard
Description: As the owner, I want to browse all orders in Supabase Dashboard, so I have history and overview of orders.
Acceptance Criteria:
- Orders are visible in orders table in Supabase Dashboard
- Orders are sorted chronologically (newest on top)
- Each order contains: customer data, category, details, pickup date, status, submission date
- Status column enables manual value change (new/confirmed/completed)

### SEO and Accessibility (MVP)

**[MVP] US-024**
Title: Sharing Website on Social Media
Description: As a customer, I want to share the bakery's website on social media with photo and description, so I can recommend the bakery to friends.
Acceptance Criteria:
- Each page has Open Graph tags set (og:title, og:description, og:image)
- Sharing link on Facebook/Instagram displays appropriate preview with title, description, and photo
- Homepage has dedicated og:image promoting the bakery

**[MVP] US-025**
Title: Finding Bakery in Search Results
Description: As a customer, I want to find Tilulu Bakery in Google search results after typing phrases related to bakery in Szczecin, so I can learn about the offerings.
Acceptance Criteria:
- Each page has meta tags set (title, description) with appropriate keywords
- schema.org LocalBusiness implemented with bakery data
- schema.org Product implemented for products in offerings
- sitemap.xml file generated with list of all pages
- robots.txt file generated with appropriate directives
- Images have alt attributes with descriptions

### Consents and Privacy (MVP)

**[MVP] US-026**
Title: Managing Cookie Consent
Description: As a customer, I want to decide whether I consent to analytical cookies, so I have control over my data.
Acceptance Criteria:
- Cookie banner is displayed on first visit with information about used cookies
- Customer can accept or decline analytical cookies
- GA4 and Microsoft Clarity launch only after consent
- Customer's choice is remembered and banner doesn't appear again
- Customer can change decision (link in privacy policy or footer)

### Navigation and Layout (MVP)

**[MVP] US-027**
Title: Navigating the Website
Description: As a customer, I want to easily navigate between bakery pages, so I can quickly find needed information.
Acceptance Criteria:
- Main navigation contains links: Homepage, Products, About Us, Orders, Contact
- Navigation is visible on every page
- On mobile devices, navigation is available as hamburger menu
- Currently open page is visually highlighted in navigation

**[MVP] US-028**
Title: Browsing Footer
Description: As a customer, I want access to important links and contact details in footer, so I can quickly find them from any page.
Acceptance Criteria:
- Footer is displayed on every page
- Footer contains social media links (Instagram, Facebook)
- Footer contains bakery contact details
- Footer contains link to order terms
- Footer contains link to privacy policy

### Edge Cases and Error Handling (MVP)

**[MVP] US-029**
Title: Handling Form Submission Error
Description: As a customer, I want to see a readable message when something goes wrong during order submission, so I know what to do next.
Acceptance Criteria:
- In case of server error, message in Polish with problem information is displayed
- Message contains retry suggestion
- Form data is not lost after error (remains filled)
- Customer can retry submission without re-filling form
- In case of repeated error, information about alternative contact (phone, email) is displayed

**[MVP] US-030**
Title: Handling Inquiry Limit
Description: As a customer, I want to see information when I exceed daily inquiry limit, so I understand why I can't submit another form.
Acceptance Criteria:
- After reaching limit of 5 inquiries per IP per day, next submission attempt displays informational message
- Message explains that daily limit has been reached
- Message suggests phone or email contact
- Form is not submitted after limit exceeded

**[MVP] US-032**
Title: Form Validation Before Submission
Description: As a customer, I want to see validation error messages at respective fields, so I can quickly correct data and submit the order.
Acceptance Criteria:
- Error messages display at specific fields, not as general list
- Validation triggers on form submission attempt
- Inline validation triggers on field blur for required fields
- Message at name field: "Name is required"
- Message at email field: "Enter valid email address"
- Message at phone field: "Enter valid phone number"
- Message at date field: "Select pickup date (minimum 48h from now)"
- Message at GDPR checkbox: "Consent to data processing is required"
- After correcting error, message disappears

**[MVP] US-034**
Title: Mobile Device Responsiveness
Description: As a customer using smartphone, I want to conveniently browse offerings and place orders, so I can use the website in any conditions.
Acceptance Criteria:
- All pages display correctly on screens from 320px width
- Navigation changes to hamburger menu on mobile screens
- Calendar picker is usable on touch screens
- Forms have appropriate input types (type="email", type="tel") for mobile keyboards

**[MVP] US-036**
Title: Information About Special Dietary Orders
Description: As a customer with dietary restrictions, I want to know that the bakery fulfills gluten-free and vegan orders, so I can submit appropriate inquiry.
Acceptance Criteria:
- On Products page in "Other custom cakes" category, information about gluten-free and vegan cake fulfillment possibility is visible
- Customer can describe their dietary requirements in form textarea fields (Order Details or Additional Notes)
- Information about special orders is visible without needing to go to form

**[MVP] US-037**
Title: Handling Cookies Without Consent
Description: As a customer who didn't consent to analytical cookies, I want to normally use the website, so browsing offerings and placing orders is not restricted.
Acceptance Criteria:
- Declining analytical cookies doesn't affect any website functionality
- GA4 and Microsoft Clarity don't load without consent
- Order form works without analytical cookies

**[MVP] US-038**
Title: Form Data Security
Description: As a customer, I want assurance that my personal data is securely processed, so I feel comfortable providing email and phone.
Acceptance Criteria:
- Form data is transmitted via HTTPS
- Inputs are sanitized server-side (XSS and SQL injection protection)
- Supabase database has configured RLS policies restricting data access
- Photos in Supabase Storage are not publicly accessible without authorization
- Personal data is not logged in plain text in application logs

**[MVP] US-039**
Title: Owner Access to Supabase Dashboard
Description: As the owner, I want to log into Supabase Dashboard, so I can browse orders and manage their status.
Acceptance Criteria:
- Owner has Supabase account with project access
- After login, sees orders table with orders
- Can filter and sort orders
- Can manually change order status (new / confirmed / completed)
- Access requires login (data is not publicly accessible)

**[MVP] US-040**
Title: Displaying Form Loading State
Description: As a customer, I want to see visual loading indicators during form submission and photo upload, so I know the process is ongoing and not click again.
Acceptance Criteria:
- After clicking "Submit Inquiry", button displays spinner or "Submitting..." text
- Button is deactivated during processing
- During photo upload, progress bar or spinner is displayed at thumbnail
- After loading completes, success or error message is displayed

**[MVP] US-041**
Title: Retry on Backend Error
Description: As the system, I want to automatically retry order storage attempt on temporary Supabase unavailability, so orders aren't lost due to momentary infrastructure issues.
Acceptance Criteria:
- On timeout or connection error with Supabase, system automatically retries
- Retry occurs maximum 3 times with exponential backoff
- If all 3 attempts fail, customer sees message with temporary problem information
- Message contains bakery contact details as alternative channel
- Form data is not lost (customer can try again)

---

## PHASE 2: User Stories for Cart and Builder

### Cart (PHASE 2)

**[PHASE 2] US-003**
Title: Displaying Product Details in Modal
Description: As a customer, I want to click product card and see details in modal, so I can learn full description and photos without leaving Products page.
Acceptance Criteria:
- Clicking product card opens modal with enlarged photos and full description
- Modal contains lightbox for photo enlargement with navigation (previous/next)
- Modal contains appropriate CTA button for category ("Build" for cakes, "Add" for standard pastries)
- Closing modal restores Products page view without losing scroll position
- Modal is responsive and displays correctly on mobile screens

**[PHASE 2] US-007**
Title: Adding Standard Pastries to Cart
Description: As a customer, I want to add cookies, alfajores, or cakes to cart with quantity specification, so I can compose multi-product order within one inquiry.
Acceptance Criteria:
- Clicking "Add" at standard pastry opens modal with quantity selector
- Customer can set quantity using +/- buttons or numeric field
- Indicative total is displayed for selected quantity
- After clicking "Add to Cart", modal closes, product is in cart
- Mini cart widget in navigation updates product count and total
- Customer remains on Products page after adding product

**[PHASE 2] US-008**
Title: Adding Custom Cake to Cart (5-step builder)
Description: As a customer, I want to compose cake step-by-step in builder, so I can precisely describe what I need and see indicative price.
Acceptance Criteria:
- Clicking "Build" at cake opens modal with 5-step builder
- Step 1: customer selects cake type (classic/tall) and size (4 options per type) with indicative price
- Step 2: customer selects sponge (vanilla/cocoa/lemon)
- Step 3: customer selects creams and mousses from 4 categories (~17 options)
- Step 4: customer optionally selects add-ons (jellies, fruits, sprinkles)
- Step 5: customer selects frosting (3 options)
- Progress bar (Step X/5) is visible throughout process
- Back/Next navigation is available
- Live summary preview of choices is visible on right (desktop) or bottom (mobile)
- After last step, customer clicks "Add to Cart" and modal closes
- Builder doesn't lose state on back navigation (preserves selected options)

**[PHASE 2] US-009**
Title: Browsing Cart Contents
Description: As a customer, I want to review cart contents with summary of all selected products and indicative total, so I can ensure order is complete before submitting inquiry.
Acceptance Criteria:
- Clicking mini cart widget opens full cart view
- Product list contains names, configurations (e.g., cake size, sponge flavor), quantities, and indicative prices
- Indicative total for entire order is displayed
- "Proceed to Form" button is visible
- Empty cart displays appropriate message and encouragement to browse offerings

**[PHASE 2] US-010**
Title: Editing and Removing Products from Cart
Description: As a customer, I want to edit product quantity or configuration in cart and remove products, so I can adjust order to my needs without starting over.
Acceptance Criteria:
- Customer can change standard pastry quantity in cart view
- Customer can remove any product from cart
- Customer can edit cake configuration (return to builder with preserved state)
- After edit/removal, indicative order total is automatically recalculated
- Mini cart widget updates after each change

**[PHASE 2] US-011**
Title: Cart Persistence Between Sessions
Description: As a customer, I want my cart to persist after closing browser or refreshing page, so I don't lose progress in completing order.
Acceptance Criteria:
- Cart contents are saved to localStorage after each change
- After page refresh, cart contains same products as before refresh
- After closing and reopening browser, cart is restored
- Cart data in localStorage doesn't expire (until order submission or manual clearing)

**[PHASE 2] US-019**
Title: Marking Package Shipping Preference
Description: As a customer, I want to indicate I want to receive order by package instead of picking up in person, so I don't have to travel to Szczecin.
Acceptance Criteria:
- "I want to receive order by package" checkbox is visible in form when cart contains products with shipping option (cookies, alfajores)
- Checkbox is not visible when cart contains only products without shipping option (cakes)
- Information is displayed at checkbox: "Shipping costs and details arranged after contact. Shipping within Poland only."
- Disclaimer about no liability for transport damage is displayed
- Checking checkbox is recorded in order and visible in email to owner
- Shipping choice is optional

**[PHASE 2] US-023**
Title: Recovering Abandoned Form
Description: As a customer, I want to return to unfinished form after accidentally closing browser, so I don't lose progress and don't fill everything again.
Acceptance Criteria:
- Form data (contact details, date, notes) is automatically saved to localStorage after each field change
- Draft data expires after 30 days
- On return to page with saved draft, message "You have an incomplete order, want to continue?" is displayed
- Customer can choose "Yes" (restore data) or "No" (clear draft)
- Draft is removed after successful inquiry submission

**[PHASE 2] US-031**
Title: Handling Empty Cart on Checkout Attempt
Description: As a customer, I want to see appropriate message when I try to proceed to form with empty cart, so I know I must first add products.
Acceptance Criteria:
- Attempt to proceed to checkout form with empty cart displays informational message
- Message encourages browsing offerings and adding products
- Link/button directing to Products page is displayed

**[PHASE 2] US-033**
Title: Adding Multiple Cakes to Cart
Description: As a customer, I want to add several different cakes to one order, so I can order e.g., two cakes for the same occasion.
Acceptance Criteria:
- Customer can use cake builder multiple times and add different configurations to cart
- Each cake is displayed separately in cart with own summary
- Each cake can be edited or removed independently
- Indicative total includes all cakes in cart

**[PHASE 2] US-035**
Title: Composing Boxes from Standard Pastries
Description: As a customer, I want to compose mixed box from different cookies and alfajores, so I can order set for gift or gathering.
Acceptance Criteria:
- Customer can add multiple different standard pastries to cart (e.g., 5 alfajores + 3 chocolate cookies + 2 nut cookies)
- Each product is displayed separately in cart with quantity and price
- Indicative total includes all products

**[PHASE 2] US-014-EXTENDED**
Title: Uploading Multiple Inspiration Photos
Description: As a customer, I want to attach up to 3 inspiration photos to order, so I can show bakery different aspects of visual effect I'd like to achieve.
Acceptance Criteria:
- Form enables maximum 3 photo uploads
- Accepted formats: JPG, PNG, WEBP
- Maximum size per photo: 5 MB
- Photos are compressed frontend before upload (browser-image-compression)
- Thumbnail preview is displayed after file selection
- Customer can remove added photo before form submission
- Photo upload is optional
- On upload error, message "Failed to add photo, try again" with Retry button is displayed
- Attempting to upload file in unsupported format displays message about accepted formats
- Attempting to upload file exceeding 5 MB displays message about size limit

## 6. Success Metrics

### MVP (Phase 1)

#### Technical Metrics

- Lighthouse Performance score above 80
- Lighthouse Accessibility score above 80
- Lighthouse Best Practices score above 80
- Lighthouse SEO score above 80
- Page load time (First Contentful Paint) below 3 seconds
- Zero browser console errors on all pages
- 100% form validation works correctly (frontend + backend)
- Email to customer sent within 2 minutes of inquiry submission
- SMS to owner sent within 2 minutes of inquiry submission
- Website uptime 99.9% (Cloudflare Pages / Vercel hosting)

#### Business Metrics

- 100% of new inquiries go through website form (vs. DM / phone)
- Email to owner contains all data needed for contact and fulfillment
- Owner response time to inquiry below 24h (SLA communicated to customer)
- All orders registered in Supabase database with complete history

#### User Experience (UX) Metrics

- Customer completes inquiry in less than 3 minutes (from opening form to submission)
- Order form abandonment rate below 30%
- Customer receives confirmation email after each submitted inquiry
- Zero reports of incomprehensible error messages

#### Measurement Tools (MVP)

- Google Analytics 4: pageviews, session duration, bounce rate, conversion rate (inquiry submitted / website visit), traffic sources
- Microsoft Clarity: click heatmaps, session recordings, rage clicks, scroll depth
- GA4 Custom events:
  - form_started: number of visits to Orders page
  - form_submitted: number of successfully submitted inquiries
  - cta_clicked: number of main call-to-action clicks
- Supabase logs: orders per day/week, API errors, product category distribution
- Conversion rate: website visit → form fill → inquiry submission

### Phase 2 (Cart + Builder)

#### Additional Technical Metrics

- Cart persistence works in 100% of cases (localStorage)
- Cake builder runs smoothly on mobile devices (no lags)
- Multiple photo upload (up to 3) works without errors

#### Additional UX Metrics

- Cake builder completion rate >70% (users who start will complete)
- Cake builder abandonment rate close to 0% in usability tests
- Average number of products in cart before inquiry submission: 1.5-2.5
- Users add products to cart in >50% of visits to Products page

#### Additional Custom Events (Phase 2)

- builder_started: number of cake builder openings
- builder_completed: number of cakes added from builder to cart
- product_added_to_cart: number of any products added to cart
- cart_abandoned: user left page with non-empty cart

#### Conversion Funnel Rate (Phase 2)

Products visit → add to cart → open full cart view → proceed to form → submit inquiry

Goal: min. 10% conversion from Products visit to inquiry submission

### Phase 3 and Beyond

- Custom admin panel metrics: average response time, orders per status
- Automation: percentage of orders with automated customer email after status change
- Retention: percentage of customers with more than 1 order within 6 months (requires user accounts from Phase 4)
