# Database Schema — Tilulu Bakery (MVP / Phase 1)

**Database:** PostgreSQL (Supabase)
**Phase:** 1 — MVP
**Related docs:** `.ai/prd.md`, `.ai/tech-stack.md`, `.ai/notebook.md`

This schema covers the single MVP flow: accepting a quote request from the order form and persisting it in PostgreSQL. There are no user accounts, no shop, and no payments. Every record is an inquiry that the owner confirms manually in the Supabase Dashboard. The expected volume is very low (~3–4 inquiries per week), so the design deliberately avoids over-engineering.

---

## 1. Tables

### 1.1 `public.orders`

A single, denormalized table holding all data for one inquiry. No customer/product child tables — justified by the absence of user accounts and the low volume.

| Column                   | Type          | Constraints / Default                                                        | Notes                                                                                  |
| ------------------------ | ------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `id`                     | `uuid`        | `PRIMARY KEY DEFAULT gen_random_uuid()`                                       | Unpredictable identifier; also reused for naming Storage files.                        |
| `created_at`             | `timestamptz` | `NOT NULL DEFAULT now()`                                                      | Submission timestamp. Used for chronological sorting in the Dashboard.                 |
| `category`               | `order_category` (ENUM) | `NOT NULL`                                                         | Technical values without Polish chars/spaces; display labels live in i18n JSON files.  |
| `status`                 | `order_status` (ENUM)   | `NOT NULL DEFAULT 'new'`                                           | Changed manually by the owner in the Dashboard.                                        |
| `name`                   | `text`        | `NOT NULL`                                                                   | Customer full name. Length 1–200 enforced by Zod only (D-07); PRD §3.2.              |
| `email`                  | `text`        | `NOT NULL`                                                                   | Customer email (format validated by Zod on the server).                                |
| `phone`                  | `text`        | `NOT NULL`                                                                   | Polish phone number (format validated/normalized by Zod on the server).                |
| `details`                | `text`        | `NOT NULL`, `CHECK (char_length(details) BETWEEN 20 AND 1000)`              | Order description from the form textarea.                                              |
| `pickup_date`            | `date`        | `NOT NULL`                                                                   | Pickup day only (no time). Min/max enforced in app: `pickup_date >= (current_date + INTERVAL '2 days')`. |
| `notes`                  | `text`        | `NULL`, `CHECK (notes IS NULL OR char_length(notes) <= 500)`                | Optional additional notes.                                                             |
| `inspiration_photo_path` | `text`        | `NULL`                                                                       | Object key in bucket `inspirations` (D-05), e.g. `{order_id}.webp`. Bucket name not stored. No original client filename. |
| `gdpr_consent`           | `boolean`     | `NOT NULL`, `CHECK (gdpr_consent = true)`                                   | GDPR accountability; timestamp implied by `created_at`.                                |
| `email_delivered`        | `boolean`     | `NOT NULL DEFAULT false`                                                     | `true` after customer + owner emails both dispatch successfully; visible in Dashboard (US-022). |
| `email_error`            | `text`        | `NULL`, `CHECK (email_error IS NULL OR char_length(email_error) <= 500)`    | Sanitized failure diagnostic when `email_delivered = false`; `NULL` on success. No PII. |

#### Enumerated types

```sql
CREATE TYPE public.order_category AS ENUM (
  'tort_okazjonalny',  -- Tort okazjonalny (Occasion cake)
  'ciasta',            -- Ciasta (Cake)
  'ciastka',           -- Ciastka (Cookies)
  'alfajory',          -- Alfajory (Alfajores)
  'inne'               -- Inne (Other)
);

CREATE TYPE public.order_status AS ENUM (
  'new',        -- nowe — default on insert
  'confirmed',  -- potwierdzone
  'completed'   -- zrealizowane
);
```

#### DDL (reference)

```sql
-- Required extension for gen_random_uuid() (built into PostgreSQL 13+ via pgcrypto).
-- On Supabase, pgcrypto is available; enable if not already present.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE public.order_category AS ENUM (
  'tort_okazjonalny', 'ciasta', 'ciastka', 'alfajory', 'inne'
);

CREATE TYPE public.order_status AS ENUM (
  'new', 'confirmed', 'completed'
);

CREATE TABLE public.orders (
  id                     uuid                 PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at             timestamptz          NOT NULL DEFAULT now(),
  category               public.order_category NOT NULL,
  status                 public.order_status   NOT NULL DEFAULT 'new',
  name                   text                 NOT NULL,
  email                  text                 NOT NULL,
  phone                  text                 NOT NULL,
  details                text                 NOT NULL,
  pickup_date            date                 NOT NULL,
  notes                  text,
  inspiration_photo_path text,
  gdpr_consent           boolean              NOT NULL,
  email_delivered        boolean              NOT NULL DEFAULT false,
  email_error            text,

  CONSTRAINT orders_details_length_chk
    CHECK (char_length(details) BETWEEN 20 AND 1000),
  CONSTRAINT orders_notes_length_chk
    CHECK (notes IS NULL OR char_length(notes) <= 500),
  CONSTRAINT orders_gdpr_consent_chk
    CHECK (gdpr_consent = true),
  CONSTRAINT orders_email_error_length_chk
    CHECK (email_error IS NULL OR char_length(email_error) <= 500)
);
```

---

## 2. Relationships

There are no inter-table relationships in the MVP. The schema contains a single entity (`orders`); cardinality is therefore not applicable and no junction tables are required.

Implicit (non-FK) relationship: `inspiration_photo_path` references an object stored in a private Supabase Storage bucket. This is an application-level link, not a database foreign key.

---

## 3. Indexes

The primary key on `id` already provides a unique B-tree index.

**Decision D-06 (closed):** No additional indexes in MVP — **`orders_created_at_desc_idx` is not created.** At ~3–4 inquiries/week, sorting by `created_at` in the Supabase Dashboard (US-022) performs adequately without a dedicated index. Revisit post-MVP if row count or access patterns change.

Partitioning, full-text indexes, and column-specific indexes are intentionally omitted at this volume.

---

## 4. PostgreSQL Row Level Security (RLS)

RLS is enabled on `orders` as defense-in-depth against direct browser access via the public Supabase `anon` key. **No policies** are granted to `anon` or `authenticated` — with RLS enabled and no matching policy, all operations are denied by default.

```sql
-- Enable RLS on the table. No policies for anon/authenticated.
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
```

Policy notes:

- **No** `INSERT`, `SELECT`, `UPDATE`, or `DELETE` policies exist for `anon` or `authenticated`. Direct client-side writes to `orders` are impossible even if the `anon` key is exposed.
- The Astro API connects with the `service_role` key, which **bypasses RLS**, and is the only write path after Zod validation, sanitization, and in-memory rate limiting (5 inquiries / IP / hour per instance — D-04).
- The owner browses and edits orders through the Supabase Dashboard, which operates with elevated privileges (`service_role` / project owner) and is not subject to these policies.

### Storage (informational — D-05 closed)

Inspiration photos live in a **private** Supabase Storage bucket named **`inspirations`** (`STORAGE_INSPIRATION_BUCKET`, server-only env). Create with **Public: off**; optional bucket-level file size limit **5 MB**.

**Object key pattern:** `{order_id}.{ext}` — `order_id` is the pre-generated order UUID; `{ext}` from validated MIME (`image/jpeg` → `jpg`, `image/png` → `png`, `image/webp` → `webp`). Example: `3f6c2a1e-9b4d-4f2a-8c1e-5d7b9a0f1234.webp`.

**`orders.inspiration_photo_path`** stores the object key only (not the bucket name).

**Access policies:** No Storage RLS policies for `anon` or `authenticated` — default deny (US-038). Upload and `createSignedUrl` exclusively via Astro API with `service_role`. Owner may browse objects in Supabase Dashboard (elevated access). Signed URLs generated at owner-email composition time (US-020); **TTL 7 days (D-03, `604800` s).**

---

## 5. Design Notes & Decisions

1. **Denormalized single table** — No customer/product normalization. With no accounts and ~3–4 inquiries/week, a single `orders` table is the simplest correct model and is easy to read in the Dashboard. This is a justified deviation from 3NF for an effectively single-entity, low-volume domain.

2. **`uuid` primary key** — Uses `gen_random_uuid()` (unpredictable, non-enumerable). Aligns with Supabase conventions and is convenient for naming Storage objects without exposing sequential counts.

3. **Time columns** — Only `created_at`. `updated_at` and update triggers were intentionally dropped: status changes are rare, manual, and audited via the Dashboard; the extra column/trigger added no MVP value.

4. **ENUM types vs free text** — `category` and `status` use PostgreSQL `ENUM` for data integrity and clean Dashboard display. Technical values avoid Polish characters/spaces. The `order_category` ENUM is the **single source of truth** for category values across DB, API, and form. Polish display labels live in i18n JSON files (i18n-ready, per PRD §3.8). Adding a value later is a simple migration (`ALTER TYPE ... ADD VALUE ...`).

   **`order_category` — enum → label PL (UI / email):**

   | ENUM value | Label PL |
   | --- | --- |
   | `tort_okazjonalny` | Tort okazjonalny |
   | `ciasta` | Ciasta |
   | `ciastka` | Ciastka |
   | `alfajory` | Alfajory |
   | `inne` | Inne |

5. **`text` + `CHECK` length guards** — Text columns use `text` rather than `varchar(n)`. Length CHECK constraints on `details`, `notes`, and `email_error` act as a cheap integrity backstop behind Zod. **`name` length (1–200) is Zod-only (D-07)** — no DB CHECK, so the limit can change without a migration.

6. **Nullability** — `NOT NULL`: `name`, `email`, `phone`, `details`, `category`, `pickup_date`, `gdpr_consent`, `status`, `created_at`, `email_delivered`. Nullable: `notes`, `inspiration_photo_path`, `email_error` (success → `NULL`; failure → sanitized diagnostic).

7. **`pickup_date` as `date`** — Day only; no time component (arranged after contact, PRD §3.2). Both bounds are enforced exclusively in the application (calendar + Zod + config constants) using calendar days, **not** in the database: minimum `pickup_date >= (current_date + INTERVAL '2 days')`; maximum `pickup_date <= (current_date + ORDER_MAX_PICKUP_DAYS days)` with **`ORDER_MAX_PICKUP_DAYS = 365` (Decision D-01, closed)**. Keeping these out of the database means the horizon can change without a migration.

8. **`gdpr_consent`** — Minimal but accountable: a single `boolean NOT NULL CHECK (gdpr_consent = true)` guarantees no record can be stored without consent. A separate consent timestamp is unnecessary because it coincides with `created_at`.

9. **No IP / rate-limit storage (Decision D-04, closed)** — Rate limiting (5/IP/hour target) runs **in-memory in the API layer**, scoped to each serverless instance — **no cross-instance global store** in MVP (no `rate_limits` table, no KV/Redis). On Vercel this does **not** guarantee global 5/h/IP across cold starts or multiple concurrent instances — **accepted** at ~3–4 inquiries/week (N-03). No IP address is persisted, consistent with GDPR data minimization. Shared store deferred to post-MVP if needed (PRD §3.3.5).

10. **Write ordering & consistency** — The API uploads the file to Storage first, then performs the `INSERT` with the resulting path. This avoids rows pointing to non-existent files. Transient Supabase failures are retried (up to 3×, exponential backoff) in the API layer (PRD §3.4, US-041). **Email dispatch (Resend) runs after successful INSERT and is best-effort** — a row in `orders` is the source of truth for inquiry acceptance; email failure does not roll back the INSERT (PRD §3.3.2). After the email attempt, the API **UPDATE**s `email_delivered` and `email_error` on the same row so the owner can see delivery outcome in the Supabase Dashboard (US-022).

11. **`email_delivered` / `email_error` audit columns** — Cheap backstop for best-effort email (PRD §3.3.2, D-02, N-02). Set server-side only (never from the client). `email_delivered = true` when **both** customer confirmation and owner notification succeed; `false` otherwise. `email_error` holds a brief sanitized provider/diagnostic message (≤ 500 chars, no PII) on failure; `NULL` on success. Mirrors API `meta.emailDelivered` in the `201` response.

12. **Out of scope (Phase 2+)** — Shipping/package flag, multi-product cart, cake builder, customer accounts, and a custom admin panel are not represented in this schema. They will be introduced via future migrations when those phases begin.

13. **Private Storage bucket (Decision D-05, closed)** — Bucket `inspirations`, object key `{order_id}.{ext}`, path persisted in `inspiration_photo_path`. No client-side Storage access; no anon/authenticated Storage policies. If INSERT fails after a successful upload, an orphan object may remain — acceptable at MVP volume; manual cleanup in Dashboard if needed.

14. **`name` length (Decision D-07, closed)** — `name` is `text NOT NULL` only; 1–200 character limit enforced exclusively by Zod in the API layer (PRD §3.2). No `orders_name_length_chk` — limit adjustable without migration.

15. **No secondary indexes (Decision D-06, closed)** — MVP migration creates only the PK on `id`. No `orders_created_at_desc_idx`; Dashboard chronological sort (US-022) is sufficient at current volume.

16. **Maximum pickup-date horizon (Decision D-01, closed)** — `ORDER_MAX_PICKUP_DAYS = 365` calendar days (1 year), enforced in the app layer (Zod + calendar), not in the schema. Default value; confirm with owner. Adjustable without migration (note 7).

### Open items

- None blocking. All prior audit decisions (D-01–D-07) are closed; the `ORDER_MAX_PICKUP_DAYS = 365` default may be tuned with the owner without a schema change.
