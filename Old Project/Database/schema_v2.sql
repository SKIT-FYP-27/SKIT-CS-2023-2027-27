-- ============================================================
-- UNIFIED EDUCATION INTERFACE (UEI) - POSTGRESQL SCHEMA (V2)
-- Project ID: SKIT/CS/2023-2027/27 (CS-27)
-- ============================================================
-- V2 changelog vs. original schema.sql:
--   - ADDED 7 tables that were DROPped but never CREATEd:
--       attendance_records, student_skills, internships,
--       achievements, semester_records,
--       faculty_course_assignments, audit_logs
--   - ADDED 3 columns to placement_readiness:
--       placement_status, company, package
--     (Student/HOD Placement pages need "final outcome" per
--     UEI_Final_V1_Feature_Set.pdf; full ATS/applications
--     pipeline was explicitly cut from V1 scope)
--   - CHANGED risk_level from 4-class to 3-class
--     (LOW/MEDIUM/HIGH) per Master Context Doc + Final V1 doc
--     ("current implementation returns a three-class risk
--     label"). CRITICAL removed.
--   - ADDED 2 new enums: skill_proficiency, placement_outcome
--   - ADDED 3 columns to student_profiles: admission_date, age,
--     scholarship_status. Requested via Master Context Doc's
--     reference to UEI_FEATURE_MAP (age, scholarship_status,
--     debtor, tuition_status). debtor and tuition_status were
--     deliberately NOT added — Form-3 explicitly puts
--     fee/financial management OUT OF SCOPE, and those two
--     fields are financial data; age and scholarship_status
--     are academic-profile indicators, not financial amounts.
--     admission_date added separately to back the Digital
--     Twin's "admission details" requirement (previously only
--     batch_year, a range, existed).
--
-- Source docs reconciled: Form-1, Form-2, Form-3,
-- UEI_Master_Project_Context_UPDATED_v2.pdf,
-- UEI_Final_V1_Feature_Set.pdf (authoritative for scope)
--
-- CONFIRMED DECISION (was flagged, now resolved by the team):
-- Master Doc says Aadhaar must never be stored raw (DPDP
-- alignment). Team explicitly decided to keep aadhar_no as a
-- plain unique VARCHAR, not hashed. This intentionally
-- overrides the Master Doc's guidance on this one point.
-- ============================================================

-- Drop existing tables if re-running (dependents first)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS faculty_course_assignments CASCADE;
DROP TABLE IF EXISTS semester_records CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS internships CASCADE;
DROP TABLE IF EXISTS student_skills CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS weak_student_radar CASCADE;
DROP TABLE IF EXISTS placement_readiness CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS faculty_profiles CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing Enums if re-running
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS course_type CASCADE;
DROP TYPE IF EXISTS attendance_status CASCADE;
DROP TYPE IF EXISTS internship_status CASCADE;
DROP TYPE IF EXISTS achievement_category CASCADE;
DROP TYPE IF EXISTS risk_level CASCADE;
DROP TYPE IF EXISTS skill_proficiency CASCADE;
DROP TYPE IF EXISTS placement_outcome CASCADE;

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('STUDENT', 'FACULTY', 'HOD', 'ADMIN');
CREATE TYPE course_type AS ENUM ('THEORY', 'LAB');
CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'EXCUSED');
CREATE TYPE internship_status AS ENUM ('ONGOING', 'COMPLETED');
CREATE TYPE achievement_category AS ENUM ('HACKATHON', 'PUBLICATION', 'CONTEST', 'CERTIFICATION', 'SPORTS', 'CLUB');
-- [V2] risk_level: 3-class per Master Context Doc + Final V1 doc (CRITICAL removed)
CREATE TYPE risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');
-- [V2 NEW] skill proficiency scale for student_skills
CREATE TYPE skill_proficiency AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
-- [V2 NEW] placement outcome for placement_readiness
CREATE TYPE placement_outcome AS ENUM ('NOT_PLACED', 'IN_PROCESS', 'PLACED');

-- 2. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'STUDENT',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Student Profiles Table (Digital Twin & Canonical IDs)
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    registration_no VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    branch VARCHAR(100) DEFAULT 'Computer Science & Engineering',
    section VARCHAR(10) NOT NULL,
    batch_year VARCHAR(20) NOT NULL,
    admission_date DATE,
    age INT,
    scholarship_status BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20),
    aadhar_no VARCHAR(20) UNIQUE,
    apar_id VARCHAR(50) UNIQUE,
    aishe_id VARCHAR(50),
    current_semester INT DEFAULT 1,
    current_cgpa FLOAT DEFAULT 0.0,
    total_credits INT DEFAULT 0,
    overall_attendance FLOAT DEFAULT 100.0,
    github_url TEXT,
    leetcode_url TEXT,
    linkedin_url TEXT,
    resume_url TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Faculty Profiles Table
CREATE TABLE faculty_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100) DEFAULT 'Computer Science & Engineering',
    designation VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Courses Table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    semester INT NOT NULL,
    credits INT NOT NULL,
    type course_type DEFAULT 'THEORY',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Course Enrollments Table
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id),
    academic_year VARCHAR(20) NOT NULL,
    semester INT NOT NULL,
    internal_marks FLOAT DEFAULT 0.0,
    mid_term_marks FLOAT DEFAULT 0.0,
    lab_marks FLOAT DEFAULT 0.0,
    final_exam_marks FLOAT DEFAULT 0.0,
    total_marks FLOAT DEFAULT 0.0,
    grade VARCHAR(5),
    is_backlog BOOLEAN DEFAULT FALSE,
    UNIQUE(student_id, course_id, academic_year)
);

-- 7. Placement Readiness Table
-- [V2] +placement_status, +company, +package — Student & HOD
-- Placement pages need "final outcome / company / package"
-- (full ATS/application pipeline explicitly out of V1 scope)
CREATE TABLE placement_readiness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID UNIQUE REFERENCES student_profiles(id) ON DELETE CASCADE,
    overall_score FLOAT NOT NULL,
    technical_score FLOAT NOT NULL,
    aptitude_score FLOAT NOT NULL,
    coding_profile_score FLOAT NOT NULL,
    recommended_actions JSONB,
    placement_status placement_outcome DEFAULT 'NOT_PLACED',
    company VARCHAR(200),
    package FLOAT,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Weak Student Risk Radar Table (AI ML Predictions + SHAP Factors)
CREATE TABLE weak_student_radar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id),
    risk_score FLOAT NOT NULL,
    risk_level risk_level DEFAULT 'MEDIUM',
    primary_risk_factor TEXT NOT NULL,
    shap_explanation JSONB NOT NULL,
    flagged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by_faculty_id UUID REFERENCES faculty_profiles(id),
    faculty_intervention_notes TEXT,
    is_intervened BOOLEAN DEFAULT FALSE,
    reviewed_at TIMESTAMP
);

-- ============================================================
-- [V2 NEW TABLES] — dropped in old schema.sql, never defined.
-- Added per UEI_Final_V1_Feature_Set.pdf Section 6
-- "Schema Prerequisites".
-- ============================================================

-- 9. Attendance Records Table
-- Needed for: Faculty attendance marking (My Courses page),
-- Student attendance %, Digital Twin attendance history.
-- Tied to a specific course_enrollment rather than raw
-- student_id/course_id so it inherits that enrollment's
-- academic_year/semester without duplicating the columns.
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty_profiles(id) ON DELETE SET NULL,
    attendance_date DATE NOT NULL,
    status attendance_status DEFAULT 'PRESENT',
    remarks TEXT,
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(enrollment_id, attendance_date)
);

-- 10. Student Skills Table
-- Needed for: Skills & Certifications page, Digital Twin skills
-- summary. Consolidates skills + certifications + project
-- evidence into one row per skill entry (matches the single
-- "student_skills" table name in the drop list rather than
-- three separate tables).
CREATE TABLE student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    proficiency_level skill_proficiency DEFAULT 'BEGINNER',
    progress_pct FLOAT DEFAULT 0.0,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_source VARCHAR(100),
    certification_issuer VARCHAR(150),
    certification_date DATE,
    credential_id VARCHAR(150),
    credential_url TEXT,
    evidence_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Internships Table
-- Needed for: Digital Twin, Admin student records.
CREATE TABLE internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    role_title VARCHAR(150),
    start_date DATE,
    end_date DATE,
    status internship_status DEFAULT 'ONGOING',
    stipend FLOAT,
    description TEXT,
    certificate_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Achievements Table
-- Needed for: Digital Twin, Admin student records.
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category achievement_category DEFAULT 'CERTIFICATION',
    description TEXT,
    achieved_on DATE,
    issuing_organization VARCHAR(200),
    proof_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Semester Records Table
-- Needed for: Academics page — semester-wise SGPA history.
-- Complements student_profiles.current_cgpa (running
-- cumulative figure) with the per-semester breakdown needed
-- to chart SGPA trend over time.
CREATE TABLE semester_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    sgpa FLOAT,
    credits_earned INT,
    credits_registered INT,
    backlogs_count INT DEFAULT 0,
    result_status VARCHAR(20) DEFAULT 'PASS',
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, semester, academic_year)
);

-- 14. Faculty Course Assignments Table
-- Needed for: Faculty "My Courses" page, Admin course
-- management — who teaches what, which section.
-- Pure junction table: if either parent is removed, the
-- assignment itself is meaningless, so CASCADE both sides.
CREATE TABLE faculty_course_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID REFERENCES faculty_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    section VARCHAR(10),
    academic_year VARCHAR(20) NOT NULL,
    semester INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(faculty_id, course_id, section, academic_year)
);

-- 15. Audit Logs Table
-- Needed for: Admin — account/security accountability.
-- user_id uses ON DELETE SET NULL (not CASCADE) so the audit
-- trail survives even if the acting user's account is later
-- removed.
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Indexes for Fast Query Performance
-- ============================================================
CREATE INDEX idx_students_roll ON student_profiles(roll_number);
CREATE INDEX idx_students_section ON student_profiles(section);
CREATE INDEX idx_risk_student ON weak_student_radar(student_id);
CREATE INDEX idx_risk_level ON weak_student_radar(risk_level);

-- [V2 NEW] indexes for the new tables
CREATE INDEX idx_attendance_enrollment ON attendance_records(enrollment_id);
CREATE INDEX idx_attendance_date ON attendance_records(attendance_date);
CREATE INDEX idx_skills_student ON student_skills(student_id);
CREATE INDEX idx_internships_student ON internships(student_id);
CREATE INDEX idx_achievements_student ON achievements(student_id);
CREATE INDEX idx_semester_records_student ON semester_records(student_id);
CREATE INDEX idx_faculty_assignments_faculty ON faculty_course_assignments(faculty_id);
CREATE INDEX idx_faculty_assignments_course ON faculty_course_assignments(course_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
