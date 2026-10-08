-- ============================================================
-- UNIFIED EDUCATION INTERFACE (UEI) - STANDALONE POSTGRESQL SCHEMA
-- Project ID: SKIT/CS/2023-2027/27 (CS-27)
-- ============================================================

-- Drop existing tables if re-running
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS weak_student_radar CASCADE;
DROP TABLE IF EXISTS placement_readiness CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS internships CASCADE;
DROP TABLE IF EXISTS student_skills CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS semester_records CASCADE;
DROP TABLE IF EXISTS faculty_course_assignments CASCADE;
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

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('STUDENT', 'FACULTY', 'HOD', 'ADMIN');
CREATE TYPE course_type AS ENUM ('THEORY', 'LAB');
CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'EXCUSED');
CREATE TYPE internship_status AS ENUM ('ONGOING', 'COMPLETED');
CREATE TYPE achievement_category AS ENUM ('HACKATHON', 'PUBLICATION', 'CONTEST', 'CERTIFICATION', 'SPORTS', 'CLUB');
CREATE TYPE risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

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
CREATE TABLE placement_readiness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID UNIQUE REFERENCES student_profiles(id) ON DELETE CASCADE,
    overall_score FLOAT NOT NULL,
    technical_score FLOAT NOT NULL,
    aptitude_score FLOAT NOT NULL,
    coding_profile_score FLOAT NOT NULL,
    recommended_actions JSONB,
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

-- Indexes for Fast Query Performance
CREATE INDEX idx_students_roll ON student_profiles(roll_number);
CREATE INDEX idx_students_section ON student_profiles(section);
CREATE INDEX idx_risk_student ON weak_student_radar(student_id);
CREATE INDEX idx_risk_level ON weak_student_radar(risk_level);
