# Manual result-analysis workbook — sheet, column and calculation map

Week 1 data study · Kashish Soni · S1 (10/08/2026 – 16/08/2026)

The department's manual workbook is the **ground truth** the system must reproduce. This document
records every sheet, its columns, and how each number is calculated (formula in Excel, or typed by hand).

Workbooks studied (kept in `data/`, never committed):

| # | Workbook | Role |
|---|---|---|
| W1 | `I Sem 2024-25 TR Result Analysis.xlsx` | the **final analysis** sent out by the department (Annexures I–V) |
| W2 | `Branch-CS CE IOT_…`, `Branch-AIDS IT EC EE_…`, `Branch-ME_… I Sem 2024-25.xls` | per-branch TR sheets with grade-band counts at the bottom (input to W1) |
| W3 | `Analysis_TR DATA OF B.Tech. II Sem 2024-25 12.12.2025.xlsx` | II Sem: compiled TR + working copies (no final annexures in this file) |

Formulas were listed with `analytics/scripts/explore/list_formulas.py`.

---

## W1 — final analysis workbook (I Sem 2024-25)

| Sheet | Annexure | Used? |
|---|---|---|
| `Annexure` | index | yes |
| `Overall` (and the older copy `Over all`) | I | yes — `Overall` |
| `Branch wise ` (trailing space in the name) | II | yes |
| `Section wise` | III | yes |
| `Faculty wise..` | IV | yes |
| `Rank Holder's Name` | V | yes |
| `old Subject Wise`, `old Section Wise`, `old A` | – | **no** — 2019-20 examples on the old grade scale (A++ … E) |

### Annexure (index)
Title rows: institute name, `RESULT ANALYSIS (I SEMESTER 2024-25)`. Table `S.No. | Annexure | Particulars`:
I Over All Result Analysis · II Branch & Subject wise · III Section wise · IV Faculty wise · V Rank Holders Name.
No calculations.

### Annexure I — `Overall`
Title row 2: semester, session, batch code (`24ESK…`) and **result declaration date**.

**Table 1 — branch-wise** (rows 4–12, one per branch, total on row 13):

| Column | Value | How it is calculated |
|---|---|---|
| S. No. | 1–9 | typed |
| BRANCH | full branch name | typed |
| TOTAL STUDENTS | | `=Pass + Fail` |
| Total Pass | | **typed** (counted from W2) |
| Total Fail | | **typed** |
| Pass % | | `=Pass / Total * 100` |
| **Total row** | | `SUM` of each column; Pass % = **`AVERAGE` of the 9 branch percentages** (not total pass ÷ total students) |

Branch order: CSE, Data Science, Civil, Mechanical, AI, IT, IoT, EC, EE.

**Table 2 — overall result, subject-wise** (from row 15): `S. No. | Subject | TOTAL STUDENTS | Total Pass | Total Fail | Pass %`,
one row per theory subject across all branches. Total students and pass are **typed**;
Fail = `=Total − Pass`; Pass % = `=Pass / Total * 100`.

### Annexure II — `Branch wise `
One block per branch (`Branch : <name>`), 9 blocks. Per block, one row per **theory** paper:

| Column | How it is calculated |
|---|---|
| S. No., Paper Code, Paper name | typed (column C header also says "Paper Code" — it holds the name) |
| Total | typed |
| F · P & C · B & B+ · A, A+ & O | **typed** (copied from the grade-band rows of W2) |
| Pass | typed (= P&C + B&B+ + A/A+/O) |
| Pass % | `=Pass * 100 / Total` |

Papers differ by branch group (physics group: MAUL101, PHUL101, HSUL101, CSUL101, EEUL101 …;
chemistry group: MAUL101, CHUL101, HSUL102, CSUL101, MEUL101).

### Annexure III — `Section wise`
One block per section: `Section - A (CS)` … `Section - S (EE)`, plus `T1 (EC)` and `T2 (EE)` — 21 blocks.
A shared section is split per branch (T1 / T2).
Per block, one row per theory paper:

| Column | How it is calculated |
|---|---|
| S. No., Subject Code, Subjects, Faculty Name | typed |
| Total Students | typed |
| F · P & C · B & B+ · A, A+ & O | typed |
| Pass Students | `=P&C + B&B+ + A/A+/O` |
| Result % | `=Pass * 100 / Total` |

### Annexure IV — `Faculty wise..`
One block per **subject**, one row per section that studies it:
`S. No. | Subject Code | Subjects | Sec | Faculty Name | Total Students | F | P & C | B & B+ | A, A+ & O | Pass Students | Result %`

| Column | How it is calculated |
|---|---|
| Total … Pass Students | typed |
| Result % | **typed as a number** (not a formula) |
| Subtotal row under each block | `SUM` of Total, F, P&C, B&B+, A/A+/O, Pass (a single-section block uses `=cell above`) |
| Result % of the subtotal | not filled |

### Annexure V — `Rank Holder's Name`
Title: `B.TECH. I SEM MAIN EXAM 2024-25`, `List of rank Holders`.
Columns: `S. No. | ROLL NO | NAME | TOTMKS | SGPA | Rank | Contact No. | E_mail ID`.
- Sorted by SGPA (high → low), then total marks.
- **Ties share one rank** (merged Rank cell) and the next rank is the next number (dense rank):
  9.75 and 9.75 are both rank 5; four students with 9.73 are all rank 6; next is rank 7.
- Ranks **1 to 10** are listed → 16 students in this file.
- Contact no. and e-mail are not in the TR → they come from **student master data**.
- No formulas; all typed.

---

## W2 — per-branch TR sheets (I Sem 2024-25)

One sheet per branch with every student's marks (layout documented by Katyayini in
`docs/data-study/TR_FORMATS.md`). Under the last student, for **every grade column**:

| Row label | Formula (example for column P) |
|---|---|
| F | `=COUNTIF(P4:P382,"F")` |
| P (Pass) & C (Average) | `=COUNTIF(…,"P") + COUNTIF(…,"C")` |
| B (Above Average) & B+ (Good) | `=COUNTIF(…,"B") + COUNTIF(…,"B+")` |
| A (Very Good), A+ (Excellent) & O (Outstanding) | `=COUNTIF(…,"A") + COUNTIF(…,"A+") + COUNTIF(…,"O")` |
| Total | `=SUM(F … A rows)` |
| RESULT DECLEARED | `=SUM(F … A rows)` (same as Total) |
| TOTAL PASS | `=SUM(P&C … A rows)` |
| PASS % | `=TOTAL PASS * 100 / RESULT DECLARED` |

These counts are what is typed into Annexures I–IV.

## W3 — II Sem 2024-25 compiled workbook

| Sheet | Content |
|---|---|
| `ALL` | every student of every branch, with section (`Sec`) — the input |
| `BCE, BME, BEEE` · `EM, PSOOP,I & E` · `Chem, Phy,UHV,COS` | working copies sorted for one group of subjects |
| `for Scal-10` | working copy (purpose to confirm) |
| `For Toper` | sorted by marks to pick the rank holders |

`ALL` also contains 7-row grade-band summary blocks between the students (`F`, `P & C`, `B & B+`,
`A, A+ &`, `Pass`, `Total`, `Pass %`).

---

## Calculations the system must reproduce

| # | Figure | Rule found in the workbooks |
|---|---|---|
| C1 | Grade bands | F · P & C · B & B+ · A, A+ & O |
| C2 | Pass in a subject | grade in P & C, B & B+ or A, A+ & O (i.e. not F) |
| C3 | Subject / section / branch pass % | pass × 100 / total students |
| C4 | Branch result | pass / fail per student for the semester (rule to confirm — see Q3) |
| C5 | Overall pass % (Annexure I total row) | **average of branch percentages** |
| C6 | Faculty subtotal | sum of that faculty's / subject's section rows |
| C7 | Rank | dense rank on SGPA, ties ordered by total marks, ranks 1–10 |

## Problems found in the manual workbooks

| # | Where | Problem |
|---|---|---|
| P1 | W1 `Over all`, Table 2 Pass % | formula `=D17/#REF!*100` — broken reference (the newer `Overall` sheet is correct) |
| P2 | W1 `Faculty wise..`, section I block | code `EEUL101` with name "Basic Civil Engineering" — the ME branch sheet lists it as `CEUL101 (BCE)` |
| P3 | W1 `Overall` total row | overall Pass % is an average of percentages, not total pass ÷ total |
| P4 | W1 `Faculty wise..` | Result % typed by hand, so it does not update if a count is corrected |
| P5 | W1 `Branch wise ` | column C header says "Paper Code" but holds the paper name |
| P6 | W1, W2 | spelling: "RESULT DECLEARED", "Artificial Intelegence", "Mechnical", "Electroncs" |

## Questions for the department

1. Overall pass % (P3): keep the average of branch percentages, or use total pass ÷ total students?
2. Is section I's paper `CEUL101` (P2)?
3. Semester PASS rule for Annexure I: no F in any credit course (theory, lab, SODECA)? Do audit courses count?
4. Is the rank list always 1–10, and are labs included in TOTMKS?
5. Where do contact numbers and e-mails for rank holders come from?
