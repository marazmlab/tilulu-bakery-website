# REST API Plan — Tilulu Bakery (MVP / Phase 1)

**Project:** Tilulu Bakery (tilulu-bakery-website)
**Phase:** 1 — MVP
**Related docs:** `.ai/prd.md`, `.ai/db-plan.md`, `.ai/tech-stack.md`, `.ai/notebook.md`

This plan describes the server-side HTTP API for the MVP. The scope is deliberately small: the only public write path is the quote-request submission. There is no customer-facing read/update/delete API — the owner browses and edits orders exclusively in the Supabase Dashboard (PRD §3.3.1, US-022, US-039), and the database RLS grants anonymous clients `INSERT` only (`db-plan` §4).

All endpoints are implemented as Astro API routes under `src/pages/api/` and run with the Supabase `service_role` key (server-only). No Supabase, Resend, or Storage call is ever made directly from the browser (tech-stack "API strategy").

---

## 1. Resources

| Resource | Backing store | Notes |
| --- | --- | --- |
| `Order` | `public.orders` table (PostgreSQL / Supabase) | The single domain entity. One row per inquiry. |
| `InspirationPhoto` | Private Supabase Storage bucket (object referenced by `orders.inspiration_photo_path`) | Optional, 1 file per order, max 5 MB. Not a database table; an application-level link (`db-plan` §2, §4 Storage). Never publicly readable; accessed only via short-lived signed URLs generated server-side (US-038). |

Resources intentionally **not** exposed over the API in MVP:

- Order listing / detail / status update — handled in the Supabase Dashboard (PRD §3.3.1, US-022). RLS provides no anon `SELECT`/`UPDATE`/`DELETE`, so building these would be out of scope and an unnecessary security surface.
- Rate-limit, cart, builder, accounts — Phase 2+ (PRD §4).

---

## 2. Endpoints

### 2.1 `POST /api/orders` — Submit a quote request

Creates one inquiry: validates input, optionally uploads the inspiration photo to Storage, inserts the row, then triggers the customer and owner emails. This is the only public write endpoint and the implementation of US-012–US-018, US-029, US-030, US-040, US-041.

- **Method:** `POST`
- **Path:** `/api/orders`
- **Auth:** None (public). Protected by rate limiting + server-side validation.
- **Content-Type:** `multipart/form-data` (required because of the optional file part). When no photo is attached, an `application/json` body is also accepted as a convenience.
- **Query parameters:** none.

#### Request payload (multipart fields)

| Field | Type | Required | Constraints |
| --- | --- | --- | --- |
| `category` | string (enum) | yes | One of `tort_okazjonalny`, `tort`, `ciastka`, `alfajory`, `inne`. |
| `details` | string | yes | 500–1000 characters (after trim). |
| `name` | string | yes | Non-empty after trim; max 200 chars (sanity cap). |
| `email` | string | yes | Valid email format. |
| `phone` | string | yes | Valid Polish phone number; server normalizes (e.g. `+48XXXXXXXXX`). |
| `pickup_date` | string (`YYYY-MM-DD`) | yes | ≥ today + 48h; ≤ today + `ORDER_MAX_PICKUP_DAYS` (config constant). |
| `notes` | string | no | ≤ 500 characters. |
| `gdpr_consent` | boolean (`"true"`) | yes | Must be exactly `true`. |
| `inspiration_photo` | file | no | MIME ∈ {`image/jpeg`, `image/png`, `image/webp`}; size ≤ 5 MB. |

Server-managed (rejected if supplied by client): `id`, `created_at`, `status` (always defaults to `new`), `inspiration_photo_path`.

Example JSON variant (no photo):

```json
{
  "category": "tort_okazjonalny",
  "details": "Bardzo szczegółowy opis zamówienia o długości od 500 do 1000 znaków ...",
  "name": "Anna Kowalska",
  "email": "anna.kowalska@example.com",
  "phone": "+48 600 123 456",
  "pickup_date": "2026-07-01",
  "notes": "Proszę o wariant bezglutenowy.",
  "gdpr_consent": true
}
```

#### Success response — `201 Created`

Returns only non-sensitive identifiers; never echoes back full PII.

```json
{
  "data": {
    "id": "3f6c2a1e-9b4d-4f2a-8c1e-5d7b9a0f1234",
    "status": "new",
    "created_at": "2026-06-17T09:12:00.000Z"
  },
  "message": "Dziękujemy! Twoje zapytanie zostało wysłane. Odpowiemy w ciągu 24 godzin."
}
```

- The response is returned after the row is persisted. Email dispatch is awaited within the request when feasible (target ≤ 2 min, PRD US-018/US-020); an email failure does **not** roll back the saved order and does **not** fail the request — it is logged and reported via `meta.emailDelivered: false`.

```json
{
  "data": { "id": "…", "status": "new", "created_at": "…" },
  "meta": { "emailDelivered": false },
  "message": "Zapytanie zapisane. Wyślemy potwierdzenie wkrótce."
}
```

#### Error responses

All errors use a consistent envelope. Messages shown to the user are in Polish (PRD §3.2, US-029, US-032); machine-readable `code` and per-field `fieldErrors` support inline display.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Formularz zawiera błędy. Popraw zaznaczone pola.",
    "fieldErrors": {
      "email": "Podaj poprawny adres e-mail",
      "pickup_date": "Wybierz datę odbioru (minimum 48h od teraz)"
    }
  }
}
```

| HTTP status | `code` | When | User message (PL) |
| --- | --- | --- | --- |
| `400 Bad Request` | `VALIDATION_ERROR` | Zod validation fails (missing/invalid fields, `details` length, `gdpr_consent` not true, bad date, bad phone/email). | Per-field messages, e.g. "Imię jest wymagane", "Podaj poprawny adres e-mail", "Podaj poprawny numer telefonu", "Wybierz datę odbioru (minimum 48h od teraz)", "Zgoda na przetwarzanie danych jest wymagana". |
| `400 Bad Request` | `MALFORMED_REQUEST` | Body not parseable / wrong content type. | "Nieprawidłowe żądanie. Spróbuj ponownie." |
| `413 Payload Too Large` | `FILE_TOO_LARGE` | Photo > 5 MB. | "Zdjęcie jest za duże. Maksymalny rozmiar to 5 MB." |
| `415 Unsupported Media Type` | `UNSUPPORTED_FILE_TYPE` | Photo MIME not JPG/PNG/WEBP. | "Nieobsługiwany format pliku. Dozwolone: JPG, PNG, WEBP." |
| `429 Too Many Requests` | `RATE_LIMITED` | > 5 submissions per IP per hour (US-030). Include `Retry-After` header (seconds). | "Przekroczono limit zapytań (5 na godzinę). Skontaktuj się z nami telefonicznie lub mailowo." |
| `500 Internal Server Error` | `INTERNAL_ERROR` | Unexpected server error. | "Wystąpił błąd. Spróbuj ponownie za chwilę." |
| `502 Bad Gateway` | `STORAGE_ERROR` | Photo upload to Supabase Storage failed after retries. | "Nie udało się przesłać zdjęcia. Spróbuj ponownie." |
| `503 Service Unavailable` | `DB_UNAVAILABLE` | Supabase insert failed after 3 retries with exponential backoff (US-041). | "Chwilowy problem techniczny. Spróbuj ponownie lub skontaktuj się z nami: [telefon/e-mail]." |

Notes:

- On any non-2xx response the client preserves the filled form (US-029) and may retry without re-entering data.
- Idempotency: duplicate prevention is primarily client-side (button disabled + loading state, US-017/US-040). The server is not strictly idempotent in MVP; an optional `Idempotency-Key` header may be honored later if duplicate submissions become an issue.

---

### 2.2 (Internal, non-public) Inspiration photo signed URL

Not a REST resource exposed to browsers. The owner's notification email (US-020) must contain a working link to the private photo (US-038, private bucket). The server generates a **signed URL** at email-composition time using the `service_role` key.

- Mechanism: `supabase.storage.from(<bucket>).createSignedUrl(path, ttlSeconds)`.
- TTL: implementation-defined (e.g. 7 days) — long enough for the owner to review, short enough to remain non-permanent. Final TTL is an open item (`db-plan` §5 open items).
- No public GET endpoint is created. If, later, the owner needs on-demand regeneration, an authenticated endpoint can be added in Phase 3 with the admin panel.

---

## 3. Authentication & Authorization

### 3.1 Public endpoint (`POST /api/orders`)

- **No end-user authentication.** Customers are anonymous; the MVP has no accounts (PRD §1, §4).
- **Authorization model:** the endpoint is open but constrained by:
  - **Rate limiting** — in-memory counter keyed by client IP, max 5 requests/hour (PRD §3.3.4, US-030). IP derived from Vercel's forwarding headers (`x-forwarded-for`); no IP is persisted (GDPR data minimization, `db-plan` §5 note 9). State is per-instance/in-memory; acceptable at ~3–4 inquiries/week.
  - **Server-side validation** — Zod schema gate before any side effect (PRD §3.3.4).
  - **HTTPS** — enforced automatically by Vercel (PRD §3.3.4, US-038).

### 3.2 Database / Storage authorization

- The API authenticates to Supabase with the **`service_role`** key, read from server-only env `SUPABASE_SERVICE_ROLE_KEY`. This key bypasses RLS and is never sent to the client (tech-stack §Environment Variables, `db-plan` §4).
- **RLS** on `public.orders`: only `anon INSERT` policy exists; no `SELECT`/`UPDATE`/`DELETE` for `anon`/`authenticated` (`db-plan` §4). This is defense-in-depth in case of any accidental browser-side access.
- **Storage bucket** is private (no public read). Access only via server-generated signed URLs (US-038).

### 3.3 Owner access

- The owner does **not** use this API to read or manage orders. They authenticate to the **Supabase Dashboard** (project login) and browse/sort/filter and change `status` there (US-022, US-039). No custom auth, session, or admin endpoint is implemented in MVP.

---

## 4. Validation & Business Logic

### 4.1 Validation rules (Zod schema — `src/lib`), mapped to DB constraints

`Order` (request to `POST /api/orders`):

| Field | Validation | Source |
| --- | --- | --- |
| `category` | required; enum `['tort_okazjonalny','tort','ciastka','alfajory','inne']` | `order_category` ENUM (`db-plan` §1.1) |
| `details` | required; trimmed length **500–1000** | `orders_details_length_chk` (`db-plan`), PRD §3.2 |
| `name` | required; non-empty trimmed; ≤ 200 | `name NOT NULL` |
| `email` | required; valid email format | `email NOT NULL`, PRD §3.2 / US-012 |
| `phone` | required; valid PL phone; normalized to canonical form before persisting | `phone NOT NULL`, PRD §3.2 / US-012 |
| `pickup_date` | required; valid date; **≥ today + 48h**; **≤ today + `ORDER_MAX_PICKUP_DAYS`** | `pickup_date NOT NULL` + app rule (`db-plan` note 7), PRD §3.2 / US-013 |
| `notes` | optional; if present, trimmed length **≤ 500** | `orders_notes_length_chk` (`db-plan`), PRD §3.2 |
| `gdpr_consent` | required; must equal `true` | `orders_gdpr_consent_chk` (`db-plan`), PRD §3.2 / US-016 |
| `inspiration_photo` | optional; MIME ∈ {jpeg,png,webp}; size ≤ 5 MB | PRD §3.2, §3.3.4 / US-014-SIMPLIFIED |
| `status` | not accepted from client; server forces default `new` | `status DEFAULT 'new'` (`db-plan`) |
| `id`, `created_at`, `inspiration_photo_path` | server-managed; ignored if sent | `db-plan` §1.1 |

Validation runs server-side as the mandatory gate (PRD §3.3.4). Client-side validation mirrors these rules for UX only (PRD §3.2, US-032) and is non-authoritative.

The DB `CHECK` constraints (`details` 500–1000, `notes` ≤ 500, `gdpr_consent = true`) act as an integrity backstop behind Zod (`db-plan` note 5).

### 4.2 Business logic implementation (request flow for `POST /api/orders`)

Ordered server-side steps; each guard returns early on failure (clean-code rules):

1. **Method/content-type guard** → `405`/`400 MALFORMED_REQUEST` if wrong.
2. **Rate limit check** (IP, 5/hour) → `429 RATE_LIMITED` with `Retry-After` (US-030).
3. **Parse & validate** the payload with Zod → `400 VALIDATION_ERROR` with `fieldErrors` (US-012, US-032).
4. **File checks** (if `inspiration_photo` present): MIME + size → `415`/`413` (US-014-SIMPLIFIED, §3.3.4).
5. **Sanitize** text inputs (trim, strip control chars, escape for HTML email rendering) — XSS protection; SQL injection is mitigated by the Supabase client's parameterized queries (US-038). Never log raw PII (US-038).
6. **Generate order `id`** (uuid) up front so the Storage path can reuse it.
7. **Upload photo first** to the private bucket at `inspirations/{id}.{ext}` (write-ordering note 10 in `db-plan`, prevents rows pointing to missing files). Wrap in **retry (≤ 3×, exponential backoff)** (US-041); on exhaustion → `502 STORAGE_ERROR`.
8. **Insert order row** (`service_role`) including `inspiration_photo_path` when a file was uploaded; `status` = `new`. Wrap in **retry (≤ 3×, exponential backoff)** (US-041); on exhaustion → `503 DB_UNAVAILABLE` with alternative-contact message.
9. **Send emails** via Resend + React Email (PRD §3.3.2/§3.3.3):
   - **Customer** (`email`): thanks, 24h response info, order summary (category label, details, pickup date, notes), branded HTML, bakery signature (US-018).
   - **Owner** (`OWNER_EMAIL`): full details — category, full `details`, contact (name/email/phone), pickup date, notes, and **signed URL** to the inspiration photo if present (US-020).
   - Email failure is logged and surfaced via `meta.emailDelivered: false`; it does **not** roll back the saved order.
10. **Respond `201 Created`** with `{ id, status, created_at }` and a Polish success message (US-017).

### 4.3 Cross-cutting business rules

- **Every submission is a quote request, not a purchase** — no payment, no order confirmation logic; `status` lifecycle (`new` → `confirmed` → `completed`) is managed manually by the owner in the Dashboard (PRD §1, §3.3.1, US-022).
- **Category display labels** are resolved from i18n JSON on the client/email layer; the API stores/returns only technical enum values (`db-plan` note 4, PRD §3.8).
- **Pickup-date horizon** (`ORDER_MAX_PICKUP_DAYS`) is an app config constant so it can change without a DB migration (`db-plan` note 7); current value is an open item to confirm with the owner.
- **Data minimization** — no IP, no original filename, no extra PII persisted (`db-plan` notes 8–9, US-038).

### 4.4 Security summary (mapped)

| Control | Implementation | Source |
| --- | --- | --- |
| Server-side validation | Zod on every field before side effects | PRD §3.3.4 |
| Rate limiting | In-memory, 5/IP/hour, `429` + `Retry-After` | PRD §3.3.4, US-030 |
| Upload validation | MIME + 5 MB checks → `413`/`415` | PRD §3.3.4, US-014-SIMPLIFIED |
| RLS | anon `INSERT` only; API uses `service_role` | `db-plan` §4, US-038 |
| Private storage | Private bucket + signed URLs only | `db-plan` §4, US-038 |
| Secrets | Server-only env (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, …) | tech-stack §Env, US-038 |
| HTTPS | Enforced by Vercel | PRD §3.3.4, US-038 |
| Resilience | 3× retry + exponential backoff on Storage/DB | PRD §3.4, US-041 |
| PII handling | No plaintext PII in logs; sanitized inputs | US-038 |

### 4.5 Out of scope for the API (Phase 2+)

Per PRD §4 and tech-stack §Phase Boundaries, the following are **not** implemented as endpoints in MVP: order listing/detail/update/delete API, cart, 5-step builder, multi-photo upload, SMS notifications, customer accounts/auth, and any custom admin API. They will be added via future endpoints when those phases begin.
