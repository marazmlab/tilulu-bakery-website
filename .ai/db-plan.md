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
| `name`                   | `text`        | `NOT NULL`                                                                   | Customer full name.                                                                    |
| `email`                  | `text`        | `NOT NULL`                                                                   | Customer email (format validated by Zod on the server).                                |
| `phone`                  | `text`        | `NOT NULL`                                                                   | Polish phone number (format validated/normalized by Zod on the server).                |
| `details`                | `text`        | `NOT NULL`, `CHECK (char_length(details) BETWEEN 500 AND 1000)`             | Order description from the form textarea.                                              |
| `pickup_date`            | `date`        | `NOT NULL`                                                                   | Pickup day only (no time). "+48h min" and upper horizon enforced in the app, not here. |
| `notes`                  | `text`        | `NULL`, `CHECK (notes IS NULL OR char_length(notes) <= 500)`                | Optional additional notes.                                                             |
| `inspiration_photo_path` | `text`        | `NULL`                                                                       | Path to the file in a private Supabase Storage bucket. No original filename stored.    |
| `gdpr_consent`           | `boolean`     | `NOT NULL`, `CHECK (gdpr_consent = true)`                                   | GDPR accountability; timestamp implied by `created_at`.                                |

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

  CONSTRAINT orders_details_length_chk
    CHECK (char_length(details) BETWEEN 500 AND 1000),
  CONSTRAINT orders_notes_length_chk
    CHECK (notes IS NULL OR char_length(notes) <= 500),
  CONSTRAINT orders_gdpr_consent_chk
    CHECK (gdpr_consent = true)
);
```

---

## 2. Relationships

There are no inter-table relationships in the MVP. The schema contains a single entity (`orders`); cardinality is therefore not applicable and no junction tables are required.

Implicit (non-FK) relationship: `inspiration_photo_path` references an object stored in a private Supabase Storage bucket. This is an application-level link, not a database foreign key.

---

## 3. Indexes

The primary key on `id` already provides a unique B-tree index. Given the very low volume, no additional indexes are strictly necessary.

Optional (recommended) index to support the "newest on top" sort in the Supabase Dashboard (US-022):

```sql
CREATE INDEX orders_created_at_desc_idx ON public.orders (created_at DESC);
```

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
- The Astro API connects with the `service_role` key, which **bypasses RLS**, and is the only write path after Zod validation, sanitization, and in-memory rate limiting (5 inquiries / IP / hour).
- The owner browses and edits orders through the Supabase Dashboard, which operates with elevated privileges (`service_role` / project owner) and is not subject to these policies.

### Storage (informational)

Inspiration photos live in a **private** bucket (no public read). Access is provided exclusively through short-lived signed URLs generated server-side (US-038). Bucket name, path structure, and signed-URL TTL are implementation details outside this table schema. Recommended path convention: derive object name from the order `id` (e.g. `inspirations/{order_id}.{ext}`).

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

5. **`text` + `CHECK` length guards** — Text columns use `text` rather than `varchar(n)`. Length is enforced only where the PRD specifies it: `details` 500–1000 chars (PRD §3.2), `notes` ≤ 500 chars. These cheap CHECK constraints act as an integrity backstop behind the primary Zod validation, with no performance cost at this scale.

6. **Nullability** — `NOT NULL`: `name`, `email`, `phone`, `details`, `category`, `pickup_date`, `gdpr_consent`, `status`, `created_at`. Nullable: `notes`, `inspiration_photo_path` (both optional in the form).

7. **`pickup_date` as `date`** — Day only; no time component (arranged after contact, PRD §3.2). The "minimum +48h" rule and the (still-undecided) maximum horizon are enforced exclusively in the application (calendar + Zod + a config constant). Keeping these out of the database means the horizon can change without a migration.

8. **`gdpr_consent`** — Minimal but accountable: a single `boolean NOT NULL CHECK (gdpr_consent = true)` guarantees no record can be stored without consent. A separate consent timestamp is unnecessary because it coincides with `created_at`.

9. **No IP / rate-limit storage** — Rate limiting (5/IP/hour) runs in-memory in the API layer. No IP address is persisted, consistent with GDPR data minimization. No `rate_limits` table in MVP.

10. **Write ordering & consistency** — The API uploads the file to Storage first, then performs the `INSERT` with the resulting path. This avoids rows pointing to non-existent files. Transient Supabase failures are retried (up to 3×, exponential backoff) in the API layer (PRD §3.4, US-041).

11. **Out of scope (Phase 2+)** — Shipping/package flag, multi-product cart, cake builder, customer accounts, and a custom admin panel are not represented in this schema. They will be introduced via future migrations when those phases begin.

### Open items (do not block schema creation)

- Final maximum pickup-date horizon value (app-side config constant; TBD with owner).
- Whether to create `orders_created_at_desc_idx` in MVP (negligible practical difference at current volume).
- Private bucket configuration details (name, path layout, signed-URL TTL) — implementation-time, outside this table schema.
