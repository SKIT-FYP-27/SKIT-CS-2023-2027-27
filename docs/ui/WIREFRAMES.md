# Wireframes — all screens

Week 1 · Janvi Gupta · S1 (10/08/2026 – 16/08/2026)

Low-fidelity wireframes for every screen in Form-1 / Form-2. They fix **what is on each screen and
where**, not colours or final styling. Redraw them in Figma (or on paper → photo in `docs/ui/`)
and review them with the team before any screen is coded.

## Users and what they see

| Role | Screens |
|---|---|
| Admin / Result Coordinator | everything |
| HOD | HOD dashboard, result analysis, batch comparison, students, back / no-back (own department) |
| Faculty | faculty dashboard (own subjects and sections only) |

## Screen list

| # | Screen | Role |
|---|---|---|
| 1 | Login | all |
| 2 | App layout (sidebar + top bar) | all |
| 3 | Upload result | Admin |
| 4 | Validation report | Admin |
| 5 | Master data (batches, semesters, sections, scheme, students) | Admin |
| 6 | Result analysis (overall / section / subject) | Admin, HOD |
| 7 | Faculty management & assignments | Admin |
| 8 | Upload history | Admin |
| 9 | Faculty dashboard | Faculty |
| 10 | HOD dashboard | HOD |
| 11 | Batch comparison & trends | Admin, HOD |
| 12 | Student result (search by roll no.) | Admin, HOD |
| 13 | Students with back / without back | Admin, HOD |
| 14 | User management | Admin |

---

### 1. Login
```
+------------------------------------------------+
|        SKIT · Result Analysis System           |
|                                                |
|        Username / Employee ID [__________]     |
|        Password               [__________]     |
|                              [   Log in   ]    |
|        (error message shown here)              |
+------------------------------------------------+
```

### 2. App layout (every screen after login)
```
+-----------+--------------------------------------------------+
| LOGO      |  Page title                 user name · role  [⎋] |
|-----------+--------------------------------------------------|
| Dashboard |                                                  |
| Upload    |              page content                        |
| Validation|                                                  |
| Analysis  |                                                  |
| Compare   |                                                  |
| Students  |                                                  |
| Faculty   |                                                  |
| Masters   |                                                  |
| Users     |   (menu items depend on the role)                |
+-----------+--------------------------------------------------+
```
Phone width: sidebar collapses into a ☰ menu.

### 3. Upload result
```
Upload Total Result
+--------------------------------------------------------------+
| Batch [2024-28 v]  Semester [III v]  Academic year [2025-26 v] |
|                                                              |
|  +--------------------------------------------------------+  |
|  |     Drop the TR file here, or [Browse]  (.xlsx, .xls)  |  |
|  +--------------------------------------------------------+  |
|  selected: TR_B.Tech_3rd_Sem.xlsx  (2.1 MB)            [x]   |
|                                                              |
|  ( ) replace this result   ( ) add to this result            |
|                                     [ Check file ] [ Upload ] |
+--------------------------------------------------------------+
```

### 4. Validation report
```
Validation — TR_B.Tech_3rd_Sem.xlsx
+-----------+-----------+-----------+-----------+
| Students  | Subjects  | Errors    | Warnings  |
|  1210     |   48      |   3 (red) |  21       |
+-----------+-----------+-----------+-----------+
Filter: [All types v] [Errors only ☐]                    [Export]
+------+----------------+------------+---------------------------+
| Type | Problem        | Roll no.   | Detail                    |
+------+----------------+------------+---------------------------+
| ERR  | Unknown code   | 24ESKCS0.. | MAUL399 not in scheme     |
| WARN | Missing section| 24ESKCA7.. | not in any class list     |
+------+----------------+------------+---------------------------+
                                  [ Cancel ]  [ Confirm import ]
```

### 5. Master data
```
Masters:  [Batches] [Semesters] [Sections] [Scheme] [Students]   (tabs)
+--------------------------------------------------------------+
| Search [________]                        [+ Add] [Import CSV] |
+--------+----------------------+---------+---------+----------+
| Code   | Name                 | Credits | Type    | Actions  |
+--------+----------------------+---------+---------+----------+
| MAUL101| Engg. Mathematics-I  | 4       | Theory  | ✎  🗑     |
+--------+----------------------+---------+---------+----------+
                                              < 1 2 3 >
```

### 6. Result analysis
```
Filters: Year[v] Batch[v] Semester[v] Branch[v] Section[v] Subject[v] Faculty[v]  [Reset]
View: [Overall] [Section-wise] [Subject-wise]                        [Download Excel]
+-----------+-----------+-----------+-----------+
| Students  | Passed    | Failed    | Pass %    |
+-----------+-----------+-----------+-----------+
+-------------------------------+  +----------------------------+
| Pass % by branch (bar chart)  |  | Grade bands (stacked bar)  |
+-------------------------------+  | F | P&C | B&B+ | A,A+&O    |
                                   +----------------------------+
+--------+---------+------+------+-----+-------+--------+------+-------+
| Branch | Total   | F    | P&C  | B&B+| A/A+/O| Pass   | Fail | Pass %|
+--------+---------+------+------+-----+-------+--------+------+-------+
```

### 7. Faculty management & assignments
```
Faculty [List] [Assignments]
Assignments: Year[v] Semester[v] Branch[v]                [+ Assign] [Import]
+----------+---------+--------------------+-----------+--------+
| Section  | Subject | Faculty            | Lab group | Action |
+----------+---------+--------------------+-----------+--------+
| CS-A     | MAUL101 | Faculty name   [v] |   –       | ✎ 🗑    |
| CS-A     | CSUP120 | Faculty name   [v] |   G1      | ✎ 🗑    |
+----------+---------+--------------------+-----------+--------+
```

### 8. Upload history
```
+------------+---------+----------+--------------+--------+---------+
| Date       | File    | Batch    | Semester     | By     | Status  |
+------------+---------+----------+--------------+--------+---------+
| 12-07-2025 | TR_..   | 2024-28  | I            | admin  | ✓ done  |
+------------+---------+----------+--------------+--------+---------+
```

### 9. Faculty dashboard
```
My subjects: [MAUL101 · CS-A v]   Semester [v]
+-----------+-----------+-----------+-----------+
| Students  | Passed    | Pass %    | Dept avg %|
+-----------+-----------+-----------+-----------+
+---------------------------------+ +------------------------------+
| My section vs other sections    | | Grade distribution (bar)     |
| (bar chart, pass %)             | |                              |
+---------------------------------+ +------------------------------+
Students of my section:  roll · name · ISE · SEE · total · grade
```

### 10. HOD dashboard
```
Department [CSE v]  Batch [v]  Semester [v]
+--------+--------+--------+--------+--------+
|Students|Pass %  |Backs   |Toppers |Avg SGPA|      (KPI cards)
+--------+--------+--------+--------+--------+
+------------------------------+ +------------------------------+
| Branch pass % vs overall     | | SGPA distribution            |
+------------------------------+ +------------------------------+
+------------------------------+ +------------------------------+
| Section comparison           | | Subject grade bands          |
+------------------------------+ +------------------------------+
+------------------------------+ +------------------------------+
| Faculty results (table)      | | Back / no-back · Rank holders|
+------------------------------+ +------------------------------+
```

### 11. Batch comparison & trends
```
Compare: Batches [2024-28 ☑] [2025-29 ☑]  Branch[v]  Measure [Pass % v]
+--------------------------------------------------------------+
|  line chart: semester I, II, III … on x-axis, one line/batch |
+--------------------------------------------------------------+
+---------+------+------+------+------+
| Batch   | I    | II   | III  | IV   |   (same numbers as a table)
+---------+------+------+------+------+
```

### 12. Student result
```
Roll no. [24ESKCS001     ] [Search]
Name · Branch · Section · Batch · Entry type
+----------+------+--------+-------------+
| Semester | SGPA | Result | Back papers |
+----------+------+--------+-------------+
Click a semester → subject table: code · name · ISE · SEE · total · grade
```

### 13. Students with back / without back
```
[With back] [Without back]   Batch[v] Year[v] Branch[v] Section[v]   [Export]
+----------+------------+------+---------------------+
| Roll no. | Name       | SGPA | Back subjects       |
+----------+------------+------+---------------------+
```

### 14. User management
```
[+ Add user]
+----------+--------------+---------+------------+----------------+
| Username | Name         | Role    | Department | Actions        |
+----------+--------------+---------+------------+----------------+
| hod.cse  | ...          | HOD     | CSE        | reset · disable|
+----------+--------------+---------+------------+----------------+
```

---

## Shared components (seen on many screens)

Components that repeat across the wireframes:
filter bar · data table (sort, paging, export button) · KPI card · chart card · tabs · file drop zone ·
status badge (error / warning / pass / fail) · page header.

## States every screen needs

loading · empty ("no result uploaded yet") · error message · no permission.
