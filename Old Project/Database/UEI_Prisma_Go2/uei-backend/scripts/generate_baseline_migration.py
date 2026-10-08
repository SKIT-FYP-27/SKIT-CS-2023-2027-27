"""
Reformats a raw `pg_dump --schema-only` of the live, verified UEI
database into a clean Prisma-Migrate-style migration.sql (grouped
CreateEnum / CreateTable / CreateIndex / AddForeignKey sections,
matching Prisma's actual output conventions). Source of truth is the
real database, not a hand-typed guess.

Usage (from the prisma/scripts/ directory, or adjust paths):
    pg_dump -d <your_db> --schema-only --no-owner --no-privileges \
        --no-comments > ../schema_dump_raw.sql
    python3 generate_baseline_migration.py
"""
import re

with open("../schema_dump_raw.sql") as f:
    raw = f.read()

TYPE_MAP = [
    (r"\bcharacter varying\((\d+)\)", r"VARCHAR(\1)"),
    (r"\btimestamp without time zone\b", "TIMESTAMP(6)"),
    (r"\bdouble precision\b", "DOUBLE PRECISION"),
    (r"\bboolean\b", "BOOLEAN"),
    (r"\binteger\b", "INTEGER"),
    (r"\buuid\b", "UUID"),
    (r"\btext\b", "TEXT"),
    (r"\bdate\b", "DATE"),
    (r"\bjsonb\b", "JSONB"),
]

def fix_types(line):
    for pat, repl in TYPE_MAP:
        line = re.sub(pat, repl, line, flags=re.IGNORECASE)
    return line

out = []
out.append("-- ============================================================")
out.append("-- Baseline migration: 0_init")
out.append("--")
out.append("-- Source of truth: `pg_dump --schema-only` against the live,")
out.append("-- verified UEI database (the one schema_v2.sql / schema.prisma")
out.append("-- were both checked against), reformatted into Prisma Migrate's")
out.append("-- section style. This file documents the schema Prisma should")
out.append("-- consider already applied -- see prisma/migrations/README.md")
out.append("-- for the exact baselining commands to run locally.")
out.append("-- ============================================================\n")

# ---- Enums ----
enum_blocks = re.findall(
    r"CREATE TYPE public\.(\w+) AS ENUM \(([^;]*?)\);", raw, re.S
)
for name, body in enum_blocks:
    values = [v.strip().strip("'") for v in body.strip().split(",")]
    values_sql = ", ".join(f"'{v}'" for v in values)
    out.append("-- CreateEnum")
    out.append(f'CREATE TYPE "public"."{name}" AS ENUM ({values_sql});\n')

# ---- Tables ----
table_blocks = re.findall(
    r"CREATE TABLE public\.(\w+) \((.*?)\n\);", raw, re.S
)
# primary keys, gathered later, keyed by table
pk_map = {}
for m in re.finditer(
    r"ALTER TABLE ONLY public\.(\w+)\s+ADD CONSTRAINT (\w+) PRIMARY KEY \(([^)]+)\);",
    raw,
):
    table, cname, cols = m.group(1), m.group(2), m.group(3)
    pk_map[table] = (cname, cols)

for table, body in sorted(table_blocks):
    out.append("-- CreateTable")
    out.append(f'CREATE TABLE "public"."{table}" (')
    lines = [l.rstrip(",").strip() for l in body.strip().split("\n") if l.strip()]
    col_lines = []
    for line in lines:
        m = re.match(r"(\w+) (.+)", line)
        col, rest = m.group(1), m.group(2)
        rest = fix_types(rest)
        # qualify enum type references: public.xxx_enum -> "public"."xxx_enum"
        rest = re.sub(r"public\.(\w+)", r'"public"."\1"', rest)
        # strip redundant explicit casts like 'STUDENT'::"public"."user_role"
        rest = re.sub(r"'([^']*)'::\"public\"\.\"(\w+)\"", r"'\1'", rest)
        col_lines.append(f'    "{col}" {rest}')
    body_sql = ",\n".join(col_lines)
    if table in pk_map:
        cname, cols = pk_map[table]
        cols_q = ", ".join(f'"{c.strip()}"' for c in cols.split(","))
        body_sql += f',\n\n    CONSTRAINT "{cname}" PRIMARY KEY ({cols_q})'
    out.append(body_sql)
    out.append(");\n")

# ---- Unique constraints -> CREATE UNIQUE INDEX (Prisma's actual style) ----
for m in re.finditer(
    r"ALTER TABLE ONLY public\.(\w+)\s+ADD CONSTRAINT (\w+) UNIQUE \(([^)]+)\);",
    raw,
):
    table, cname, cols = m.group(1), m.group(2), m.group(3)
    cols_q = ", ".join(f'"{c.strip()}"' for c in cols.split(","))
    out.append("-- CreateIndex")
    out.append(f'CREATE UNIQUE INDEX "{cname}" ON "public"."{table}"({cols_q});\n')

# ---- Plain indexes (already named idx_* to match schema_v2.sql / @@index maps) ----
for m in re.finditer(
    r"CREATE INDEX (\w+) ON public\.(\w+) USING btree \(([^)]+)\);", raw
):
    iname, table, cols = m.group(1), m.group(2), m.group(3)
    cols_q = ", ".join(f'"{c.strip()}"' for c in cols.split(","))
    out.append("-- CreateIndex")
    out.append(f'CREATE INDEX "{iname}" ON "public"."{table}"({cols_q});\n')

# ---- Foreign keys ----
for m in re.finditer(
    r"ALTER TABLE ONLY public\.(\w+)\s+ADD CONSTRAINT (\w+) FOREIGN KEY \((\w+)\) REFERENCES public\.(\w+)\((\w+)\)( ON DELETE (\w+(?: \w+)?))?;",
    raw,
):
    table, cname, col, reftable, refcol, _, ondelete = m.groups()
    clause = f'ALTER TABLE "public"."{table}" ADD CONSTRAINT "{cname}" FOREIGN KEY ("{col}") REFERENCES "public"."{reftable}"("{refcol}")'
    if ondelete:
        clause += f" ON DELETE {ondelete}"
    clause += " ON UPDATE CASCADE;"
    out.append("-- AddForeignKey")
    out.append(clause + "\n")

with open("../prisma/migrations/0_init/migration.sql", "w") as f:
    f.write("\n".join(out))

print("migration.sql written:", len("\n".join(out)), "bytes")
