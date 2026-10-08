# Total Result (TR) file formats

Week 1 data study · Katyayini Sharma · S1 (10/08/2026 – 16/08/2026)

The parser must read **every** layout below and must find columns **by header name, never by column
position** — the number of subjects and the order of columns change between branches and semesters.

Files studied (kept in `data/`, never committed):

| # | File | Format |
|---|---|---|
| 1 | `Branch-CS CE IOT_Result Analysis B.Tech. I Sem 2024-25.xls` | B – department per-branch sheets |
| 2 | `Branch-AIDS IT EC EE_ Result Analysis B.Tech. I Sem 2024-25.xls` | B – department per-branch sheets |
| 3 | `Branch-ME_Result Analysis B.Tech. I Sem 2024-25.xls` | B – department per-branch sheets |
| 4 | `Analysis_TR DATA OF B.Tech. II Sem 2024-25 12.12.2025.xlsx` | C – department-compiled, all branches |
| 5 | Sheet `old A` inside `I Sem 2024-25 TR Result Analysis.xlsx` | A – university export (2019-20 example) |

---

## Format A — university TR export

The raw file the university publishes. **One row = one student in one examination.**

- Column names are short codes: `CLASSNAME, ROLLNO, NAME, FNAME, MNAME, ENNUMBER, BRANCHCODE, SGPA, REMARKS …`
- Subjects are numbered **slots**, one group of columns per slot `n`:
  - theory: `SHNAMEn` (course code), `GRADEn`, `CREDITn`, …
  - practical: `PSHNAMEn`, `PGRADEn`, `PCREDITn`, …
  - SODECA / co-curricular: `DSHNAMEn`, `DGRADEn`, `DCREDITn`, …
- The number of slots (`n`) depends on the semester → detect slots from the header names.
- `CLASSNAME` holds the exam title: the semester, MAIN or BACK exam, and "(AFTER REVALUATION)".
- The 2019-20 example (sheet `old A`) has only grade and credit per slot. Newer exports are expected to
  also have mark columns (`CMARKS1n`, `CMARKS2n`, `TOTMKSn`) and grade points (`GRADEPNTn`).

> **To collect:** a raw university TR for the 2024-28 / 2025-29 batches (not yet in the project
> folder). Confirm with it: which of `CMARKS1n` / `CMARKS2n` is internal (ISE) and which is
> external (SEE); the exact `CLASSNAME` wording for MAIN, BACK and revaluation.

## Format B — department per-branch sheets (I Sem 2024-25)

One workbook per group of branches, **one sheet per branch**:

| File | Sheets |
|---|---|
| CS CE IOT | `CS`, `Civil`, `IOT` |
| AIDS IT EC EE | `Branch AI (2)`, `AI`, `DS`, `IT`, `EC`, `EE` |
| ME | `ME` |

Layout:
- Row 1: title, e.g. `TR_B.Tech. I Sem 2024-25 (Branch-CS)`.
- Rows 2–3: **two header rows** (merged cells). One row has display labels such as `MAUL101 (EM-I)`,
  the other has field names such as `course_code_01`. Data starts on row 4.
- `Branch AI (2)` is different: a single header row on row 1, data from row 2. Its students appear to
  be the same as in the `AI` sheet → treat it as a working copy and skip it (**confirm with the department**).
- Student columns: `S.No.`, `register_no`, `roll_no`, `Section`, `Branch`, `full_name`, `father_name`, `mother_name`.
- Then **one block of 10 columns per course** (`nn` = 01, 02, …):
  `course_code_nn, course_title_nn, see_nn, ise_nn, total_marks_nn, earned_credit_nn,
  course_credit_nn, letter_grade_nn, numerical_grade_nn, grade_point_scored_nn`
- Then totals: `grand_total_marks`, `total_course_credit`, `total_grade_point_scored`, `SGPA`, `remarks`
  (AI/DS/IT/EC/EE sheets also have `sgpa` and `cgpa`).
- Student rows counted: CS 379, Civil 116, IOT 62, AI 129, DS 126, IT 190, EC 90, EE 80, ME 45
  (= 1,217, the same totals as the *Overall* sheet of the manual I Sem 2024-25 workbook).
- Below the students: **summary rows** (`F`, `P (Pass) & C (Average)`, `B & B+`, `A, A+ & O`, `Total`,
  `RESULT DECLEARED`, `TOTAL PASS`, `PASS %`) with COUNTIF formulas → **not students, skip them**.

## Format C — department-compiled TR (II Sem 2024-25)

One workbook for all branches. Sheet **`ALL`** has every student; the other sheets
(`BCE, BME, BEEE`, `EM, PSOOP,I & E`, `Chem, Phy,UHV,COS`, `for Scal-10`, `For Toper`) are working
copies sorted/filtered for one analysis → read `ALL` only.

Layout of `ALL`:
- Row 1 empty, **header on row 2**, data from row 3.
- Columns: `Register No`, *(no header — branch: CS, IT, AI, DS, CIVIL, EC, EE, IOT, ME)*, `Sec`,
  `Roll No`, `Full Name`, `Father Name`, `Mother Name`.
- Then course blocks of 10 columns: `Course Code n, Course Name n, SEE 0n, ISE 0n, Total Marks 0n,
  Earn Credit 0n, Course Credit n, Letter Grade n, Numerical Grade n, Grade Point Scored 0n`.
- Course slot numbers are **not in order** (1–6, then 13, then a gap of empty columns, then 7–12).
- Totals: `Grand Total Marks`, `Total Course Credit`, `Total Earn Credit`, `Total Grade Point Scored`,
  `Remarks`, `SGPA`, `SGPA` (**two** SGPA columns: the printed value and the full-precision value).
- Summary blocks of 7 rows (`F`, `P & C`, `B & B+`, `A, A+ &`, `Pass`, `Total`, `Pass %`) are mixed
  in between the students: **27 blocks = 189 rows** with these labels in the `Roll No` column → skip.
- Counted in `ALL`: **1,205 student rows**; sections `A`–`S`, `T1`, `T2`.
- The semester is **not written** in the file → the user must choose it when uploading.

## What the parser must handle (all formats)

| Issue | Seen in | Rule |
|---|---|---|
| Header not on row 1 / two header rows | B, C | find the header row by looking for a roll-number column |
| Summary rows between / below students | B, C | keep only rows whose roll no. matches `YYESKBBNNN` (e.g. `24ESKCS001`) |
| Grace marks written as text, e.g. `16G` | B, C (211 cells in `ALL`) | number = text without `G`; keep a "grace" flag |
| `A` in SEE / ISE | C (81 cells) | absent |
| `-` in Earn Credit / grade point | B, C | failed course or audit course → 0 / empty |
| Header typos: `ise_05` under course 03; `Letter Grade 7 ` (trailing space) | B, C | trim headers; match by block position + prefix |
| Garbled headers (`CA++urse CA++de 5`) | C, sheet `Chem, Phy,UHV,COS` | another reason to read `ALL` only |
| Course-code columns without a header name (only 2 of the course blocks are named) | B, sheet `ME` | also detect a course block from its values (codes like `MAUL101`), not only from the header |
| Duplicate sheet (`Branch AI (2)`) | B | skip (confirm) |
| Course count differs by branch and semester | all | discover course blocks from headers |
