# Data dictionary — Total Result (TR) fields

Week 1 data study · Katyayini Sharma · S1 (10/08/2026 – 16/08/2026)

Each field the system needs, what it means, and where it is in each TR format
(A = university export, B = department per-branch sheets, C = department-compiled `ALL` sheet;
see [TR_FORMATS.md](TR_FORMATS.md)). `nn` / `n` = course number. "?" = not yet confirmed.

## 1. Student fields (one value per student per exam)

| Field | Meaning | Type | A | B | C |
|---|---|---|---|---|---|
| roll_no | University roll number, e.g. `24ESKCS001` (see §4) | text | `ROLLNO` | `roll_no` | `Roll No` |
| register_no | Institute register number, e.g. `B241607` | text | – | `register_no` | `Register No` |
| enrollment_no | University enrolment number | text | `ENNUMBER` | – | – |
| name | Student name | text | `NAME` | `full_name` | `Full Name` |
| father_name | Father's name | text | `FNAME` | `father_name` | `Father Name` |
| mother_name | Mother's name | text | `MNAME` | `mother_name` | `Mother Name` |
| branch | Branch | text | `BRANCHCODE` ? | `Branch` (CSE, CE, CSE (AI) …) | column with no header (CS, CIVIL, AI …) |
| section | Section letter | text | – (not in TR) | `Section` | `Sec` (A–S, T1, T2) |
| exam | Exam title: semester, MAIN / BACK, revaluation | text | `CLASSNAME` | sheet title | – (chosen on upload) |
| grand_total_marks | Sum of all course total marks | number | `TOTMKS` ? | `grand_total_marks` | `Grand Total Marks` |
| total_course_credit | Credits of all credit courses | number | `CREDIT` ? | `total_course_credit` | `Total Course Credit` |
| total_earned_credit | Credits of courses passed | number | `CREDITEARN` ? | – | `Total Earn Credit` |
| total_grade_points | Σ grade point scored | number | `TOTPOINT` ? | `total_grade_point_scored` | `Total Grade Point Scored` |
| sgpa | Semester GPA, 2 decimals | number / empty | `SGPA` | `SGPA` | `SGPA` (first of two) |
| remarks | Result | text | `REMARKS` | `remarks` | `Remarks` |

## 2. Course fields (one row per student per course)

| Field | Meaning | Type | A | B | C |
|---|---|---|---|---|---|
| course_code | Course code, e.g. `MAUL101` (see §5) | text | `SHNAMEn` / `PSHNAMEn` / `DSHNAMEn` | `course_code_nn` | `Course Code n` |
| course_title | Course name | text | – (code only) | `course_title_nn` | `Course Name n` |
| see | Semester End Examination marks (external) | number / `A` / `nnG` | `CMARKS?n` | `see_nn` | `SEE 0n` |
| ise | In-Semester Evaluation marks (internal) | number / `A` / `nnG` | `CMARKS?n` | `ise_nn` | `ISE 0n` |
| total_marks | SEE + ISE | number | `TOTMKSn` ? | `total_marks_nn` | `Total Marks 0n` |
| course_credit | Credits of the course | number | – | `course_credit_nn` | `Course Credit n` |
| earned_credit | Credits earned (= course credit if passed) | number / `-` | `CREDITn` | `earned_credit_nn` | `Earn Credit 0n` |
| letter_grade | Grade (see §3) | text | `GRADEn` | `letter_grade_nn` | `Letter Grade n` |
| grade_point | Points of the grade (O = 10 … P = 4, F = 0) | number / `-` | `GRADEPNTn` ? | `numerical_grade_nn` | `Numerical Grade n` |
| grade_point_scored | earned credit × grade point | number / `-` | – | `grade_point_scored_nn` | `Grade Point Scored 0n` |

Practical courses use the prefix `P` in format A (`PGRADEn`, …), SODECA / co-curricular uses `D`.

**Worked example (format C, one passed student):** Total Grade Point Scored 123.5 ÷ Total Course
Credit 21 = 5.8809… → SGPA printed **5.88**; the second SGPA column holds 5.880952….
Per course: Earn Credit 4 × Numerical Grade 5 = Grade Point Scored 20.

## 3. Grade codes

Full list with points and bands: [`analytics/master/grades.csv`](../../analytics/master/grades.csv).

| Grade | Point | Band used in the analysis | Pass? |
|---|---|---|---|
| O | 10 | A, A+ & O | yes |
| A+ | 9 | A, A+ & O | yes |
| A | 8 | A, A+ & O | yes |
| B+ | 7 | B & B+ | yes |
| B | 6 | B & B+ | yes |
| C | 5 | P & C | yes |
| P | 4 | P & C | yes |
| F | 0 | F | **no (back)** |
| I | 0 | F | no — incomplete |
| NA | 0 | F | no — not allowed (attendance) |
| NP / NF | – | audit course | passed / not passed; does not count in SGPA |

Counted in format C (`ALL`, all courses): A+ 3,112 · A 3,047 · O 2,325 · B+ 2,290 · B 1,554 ·
NP 1,172 · C 960 · P 618 · F 554 · NF 33. No `I` or `NA` in this file.
The 2019-20 example (format A, sheet `old A`) uses an **older scale** (A++, A+, A, B+, B, C+, C, D+, D,
E+, E, F) → only the new scale above applies to batches 2024-28 and 2025-29.

## 4. Roll number

`24ESKCS070` = `24` year of admission · `ESK` institute · `CS` branch code · `070` serial.

| Roll code | Branch | Roll code | Branch |
|---|---|---|---|
| CS | Computer Science Engineering | IT | Information Technology |
| CX | Data Science | CY | Internet of Things |
| CA | Artificial Intelligence | EC | Electronics & Communication |
| CE | Civil Engineering | EE | Electrical Engineering |
| ME | Mechanical Engineering | | |

Note: the roll code is not always the branch name (`CX` = DS, `CY` = IOT, `CA` = AI).

## 5. Course code

`MAUL101`: `MA` subject area · `U` (meaning to confirm) · `L` course type · `1` semester · `01` number
(the reading of the digits is inferred from the files, to confirm with the scheme).
Type letter seen in the files: `L` theory (`MAUL101`), `P` practical / lab (`CSUP120`),
`A` co-curricular / SODECA (`XXUA100`, `CEUA200-03`). Audit courses have codes like `NU99.2`, `NU99.3`.
**To confirm** with the academic scheme (CBCS 2024): the full list of type letters.

## 6. Values that are not plain numbers

| Value | Where | Meaning |
|---|---|---|
| `16G`, `20G` … | SEE / ISE / Total | marks including grace marks |
| `A` | SEE / ISE | absent |
| `-` | Earn Credit, Numerical Grade, Grade Point Scored | failed course, or audit course |
| empty `SGPA` and `Remarks` | totals | student did **not** pass the semester (format C: 1,027 `PASS`, 178 empty) |

## 7. Open questions for the department

1. Raw university TR for 2024-28 / 2025-29: which mark column is ISE and which is SEE?
2. Is `Branch AI (2)` a copy of `AI` that can be ignored?
3. Pass rule for a course: grade P or above — is there also a minimum SEE mark?
4. What does a grace mark (`G`) change in the analysis, if anything?
