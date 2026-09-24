# UEI — Prisma ORM Layer

Prisma ORM layer over the UEI PostgreSQL database (`schema_v2.sql` — 14 tables).
This repo is being built in **3 weekly submissions** (Go 1 / Go 2 / Go 3).

---

## Go 1 (Week 1) — Project setup + `schema.prisma` ✅ this commit

**What's in this submission:**
- `prisma/schema.prisma` — all **14 models**, **8 enums**, every foreign key,
  every `UNIQUE` constraint and every `CREATE INDEX` from `schema_v2.sql`,
  hand-translated field by field (camelCase in Prisma, `@map(...)` back to
  the real snake_case column names — so the DB itself is untouched).
- `package.json`, `tsconfig.json` — standard Prisma + TypeScript project setup.
- `.env.example` — template for your own `DATABASE_URL` (never commit a real `.env`).
- `src/test-connection.ts` — a tiny script that connects via Prisma Client and
  runs one relational query, to prove the schema is wired up correctly.

**Verification already done:** every column in this schema was cross-checked,
field by field, against a live PostgreSQL database that `schema_v2.sql` was
actually run on — **zero missing or mismatched columns**.

### How to run this yourself

```bash
# 1. Install dependencies
npm install

# 2. Point Prisma at your own database
cp .env.example .env
# edit .env and set DATABASE_URL to your Postgres connection string

# 3. Make sure schema_v2.sql has already been run against that database
#    (creates the 14 tables/enums this schema.prisma describes)

# 4. Validate the schema and generate the Prisma Client
npx prisma validate
npx prisma generate

# 5. Sanity-check the connection
npm run test:connection
```

> Note: this schema was **hand-written to match an already-running database**
> rather than produced by `prisma db pull`, so that field names could be
> made idiomatic (camelCase) instead of a raw introspection dump. Once you
> run the steps above, `npx prisma db pull --print` against your own DB
> should show it lines up 1:1 with this file.

---

## Go 2 (Week 2) — Migrations + repository layer ✅ this commit

**What's in this submission:**
- **Bug fix from Go 1:** the 8 enums in `schema.prisma` were missing
  `@@map(...)`, so Prisma would have tried to create Postgres types named
  `UserRole`, `CourseType`, etc. instead of using the real, already-existing
  `user_role`, `course_type`, ... types. Fixed and re-verified against the
  live database (see `db_columns_dump.csv` check in the commit history).
- **`prisma/migrations/0_init/migration.sql`** — a baseline migration built
  from a real `pg_dump --schema-only` of the verified database (not
  hand-typed), reformatted into Prisma's migration style. **Replayed against
  a brand-new empty database** to confirm it reproduces an identical schema
  before being committed. See `prisma/migrations/README.md` for why this
  project needs *baselining* rather than a normal `migrate dev` history,
  and the exact commands to run once locally.
- **`src/repositories/`** — a small service/repository layer with real,
  runnable Prisma Client queries:
  - `student.repository.ts` — the "Digital Twin" query (one student with
    every related table joined in), section rosters, a transactional
    `createStudentWithAccount` (User + StudentProfile as one atomic op)
  - `risk.repository.ts` — weak-student radar listing/filtering, risk
    history per student, recording a faculty intervention, a `groupBy`
    risk-level breakdown
  - `faculty.repository.ts` — a faculty's course load, marking attendance
    via `upsert` (safe to re-run for the same session), attendance % calc
  - `analytics.repository.ts` — placement stats, section performance,
    course backlog rates — all via Prisma `groupBy`/aggregate queries
- **`src/demo-queries.ts`** — runs the above against the seeded database
  and prints the results, so the whole layer can be demoed in one command.

### How to run this yourself (after Go 1's setup)

```bash
# Baseline the existing schema into Prisma's migration history
npx prisma migrate resolve --applied 0_init
npx prisma migrate status   # should say "up to date"

# See the repository layer in action against your seeded data
npm run demo:queries
```

## Go 3 (Week 3) — coming next
`prisma/seed.ts` — synthetic dataset (500+ student profiles and related
records) generated and inserted through Prisma Client, wired up to
`npx prisma db seed`.

---

## Known schema note (carried over from `schema_v2.sql`, not introduced here)
Most foreign-key columns (e.g. `course_enrollments.student_id`) are not
`NOT NULL` in the current DDL, so their Prisma fields are modeled as
optional to stay byte-for-byte accurate to the real database. Tightening
these to required is a reasonable future migration if the team wants to
enforce it at the DB level — flagging it here rather than silently changing
an already-reviewed schema.
