-- ============================================================
-- Baseline migration: 0_init
--
-- Source of truth: `pg_dump --schema-only` against the live,
-- verified UEI database (the one schema_v2.sql / schema.prisma
-- were both checked against), reformatted into Prisma Migrate's
-- section style. This file documents the schema Prisma should
-- consider already applied -- see prisma/migrations/README.md
-- for the exact baselining commands to run locally.
-- ============================================================

-- CreateEnum
CREATE TYPE "public"."achievement_category" AS ENUM ('HACKATHON', 'PUBLICATION', 'CONTEST', 'CERTIFICATION', 'SPORTS', 'CLUB');

-- CreateEnum
CREATE TYPE "public"."attendance_status" AS ENUM ('PRESENT', 'ABSENT', 'EXCUSED');

-- CreateEnum
CREATE TYPE "public"."course_type" AS ENUM ('THEORY', 'LAB');

-- CreateEnum
CREATE TYPE "public"."internship_status" AS ENUM ('ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."placement_outcome" AS ENUM ('NOT_PLACED', 'IN_PROCESS', 'PLACED');

-- CreateEnum
CREATE TYPE "public"."risk_level" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."skill_proficiency" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "public"."user_role" AS ENUM ('STUDENT', 'FACULTY', 'HOD', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."achievements" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "student_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "category" "public"."achievement_category" DEFAULT 'CERTIFICATION',
    "description" TEXT,
    "achieved_on" DATE,
    "issuing_organization" VARCHAR(200),
    "proof_url" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."attendance_records" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "enrollment_id" UUID,
    "faculty_id" UUID,
    "attendance_date" DATE NOT NULL,
    "status" "public"."attendance_status" DEFAULT 'PRESENT',
    "remarks" TEXT,
    "marked_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "user_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(100),
    "entity_id" UUID,
    "details" JSONB,
    "ip_address" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_enrollments" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "student_id" UUID,
    "course_id" UUID,
    "academic_year" VARCHAR(20) NOT NULL,
    "semester" INTEGER NOT NULL,
    "internal_marks" DOUBLE PRECISION DEFAULT 0.0,
    "mid_term_marks" DOUBLE PRECISION DEFAULT 0.0,
    "lab_marks" DOUBLE PRECISION DEFAULT 0.0,
    "final_exam_marks" DOUBLE PRECISION DEFAULT 0.0,
    "total_marks" DOUBLE PRECISION DEFAULT 0.0,
    "grade" VARCHAR(5),
    "is_backlog" BOOLEAN DEFAULT false,

    CONSTRAINT "course_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."courses" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "semester" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,
    "type" "public"."course_type" DEFAULT 'THEORY',
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."faculty_course_assignments" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "faculty_id" UUID,
    "course_id" UUID,
    "section" VARCHAR(10),
    "academic_year" VARCHAR(20) NOT NULL,
    "semester" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faculty_course_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."faculty_profiles" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "user_id" UUID,
    "employee_id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "department" VARCHAR(100) DEFAULT 'Computer Science & Engineering'::character varying,
    "designation" VARCHAR(100) NOT NULL,
    "specialization" VARCHAR(100),
    "phone" VARCHAR(20),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faculty_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."internships" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "student_id" UUID,
    "company_name" VARCHAR(200) NOT NULL,
    "role_title" VARCHAR(150),
    "start_date" DATE,
    "end_date" DATE,
    "status" "public"."internship_status" DEFAULT 'ONGOING',
    "stipend" DOUBLE PRECISION,
    "description" TEXT,
    "certificate_url" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "internships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."placement_readiness" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "student_id" UUID,
    "overall_score" DOUBLE PRECISION NOT NULL,
    "technical_score" DOUBLE PRECISION NOT NULL,
    "aptitude_score" DOUBLE PRECISION NOT NULL,
    "coding_profile_score" DOUBLE PRECISION NOT NULL,
    "recommended_actions" JSONB,
    "placement_status" "public"."placement_outcome" DEFAULT 'NOT_PLACED',
    "company" VARCHAR(200),
    "package" DOUBLE PRECISION,
    "evaluated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "placement_readiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."semester_records" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "student_id" UUID,
    "semester" INTEGER NOT NULL,
    "academic_year" VARCHAR(20) NOT NULL,
    "sgpa" DOUBLE PRECISION,
    "credits_earned" INTEGER,
    "credits_registered" INTEGER,
    "backlogs_count" INTEGER DEFAULT 0,
    "result_status" VARCHAR(20) DEFAULT 'PASS'::character varying,
    "published_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "semester_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_profiles" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "user_id" UUID,
    "roll_number" VARCHAR(50) NOT NULL,
    "registration_no" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "branch" VARCHAR(100) DEFAULT 'Computer Science & Engineering'::character varying,
    "section" VARCHAR(10) NOT NULL,
    "batch_year" VARCHAR(20) NOT NULL,
    "admission_date" DATE,
    "age" INTEGER,
    "scholarship_status" BOOLEAN DEFAULT false,
    "phone" VARCHAR(20),
    "aadhar_no" VARCHAR(20),
    "apar_id" VARCHAR(50),
    "aishe_id" VARCHAR(50),
    "current_semester" INTEGER DEFAULT 1,
    "current_cgpa" DOUBLE PRECISION DEFAULT 0.0,
    "total_credits" INTEGER DEFAULT 0,
    "overall_attendance" DOUBLE PRECISION DEFAULT 100.0,
    "github_url" TEXT,
    "leetcode_url" TEXT,
    "linkedin_url" TEXT,
    "resume_url" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student_skills" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "student_id" UUID,
    "skill_name" VARCHAR(150) NOT NULL,
    "category" VARCHAR(100),
    "proficiency_level" "public"."skill_proficiency" DEFAULT 'BEGINNER',
    "progress_pct" DOUBLE PRECISION DEFAULT 0.0,
    "is_verified" BOOLEAN DEFAULT false,
    "verification_source" VARCHAR(100),
    "certification_issuer" VARCHAR(150),
    "certification_date" DATE,
    "credential_id" VARCHAR(150),
    "credential_url" TEXT,
    "evidence_url" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "public"."user_role" DEFAULT 'STUDENT',
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."weak_student_radar" (
    "id" UUID DEFAULT gen_random_uuid() NOT NULL,
    "student_id" UUID,
    "course_id" UUID,
    "risk_score" DOUBLE PRECISION NOT NULL,
    "risk_level" "public"."risk_level" DEFAULT 'MEDIUM',
    "primary_risk_factor" TEXT NOT NULL,
    "shap_explanation" JSONB NOT NULL,
    "flagged_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "reviewed_by_faculty_id" UUID,
    "faculty_intervention_notes" TEXT,
    "is_intervened" BOOLEAN DEFAULT false,
    "reviewed_at" TIMESTAMP(6),

    CONSTRAINT "weak_student_radar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attendance_records_enrollment_id_attendance_date_key" ON "public"."attendance_records"("enrollment_id", "attendance_date");

-- CreateIndex
CREATE UNIQUE INDEX "course_enrollments_student_id_course_id_academic_year_key" ON "public"."course_enrollments"("student_id", "course_id", "academic_year");

-- CreateIndex
CREATE UNIQUE INDEX "courses_code_key" ON "public"."courses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_course_assignments_faculty_id_course_id_section_aca_key" ON "public"."faculty_course_assignments"("faculty_id", "course_id", "section", "academic_year");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_profiles_employee_id_key" ON "public"."faculty_profiles"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_profiles_user_id_key" ON "public"."faculty_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "placement_readiness_student_id_key" ON "public"."placement_readiness"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "semester_records_student_id_semester_academic_year_key" ON "public"."semester_records"("student_id", "semester", "academic_year");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_aadhar_no_key" ON "public"."student_profiles"("aadhar_no");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_apar_id_key" ON "public"."student_profiles"("apar_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_registration_no_key" ON "public"."student_profiles"("registration_no");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_roll_number_key" ON "public"."student_profiles"("roll_number");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_user_id_key" ON "public"."student_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "idx_achievements_student" ON "public"."achievements"("student_id");

-- CreateIndex
CREATE INDEX "idx_attendance_date" ON "public"."attendance_records"("attendance_date");

-- CreateIndex
CREATE INDEX "idx_attendance_enrollment" ON "public"."attendance_records"("enrollment_id");

-- CreateIndex
CREATE INDEX "idx_audit_logs_created" ON "public"."audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "idx_audit_logs_user" ON "public"."audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "idx_faculty_assignments_course" ON "public"."faculty_course_assignments"("course_id");

-- CreateIndex
CREATE INDEX "idx_faculty_assignments_faculty" ON "public"."faculty_course_assignments"("faculty_id");

-- CreateIndex
CREATE INDEX "idx_internships_student" ON "public"."internships"("student_id");

-- CreateIndex
CREATE INDEX "idx_risk_level" ON "public"."weak_student_radar"("risk_level");

-- CreateIndex
CREATE INDEX "idx_risk_student" ON "public"."weak_student_radar"("student_id");

-- CreateIndex
CREATE INDEX "idx_semester_records_student" ON "public"."semester_records"("student_id");

-- CreateIndex
CREATE INDEX "idx_skills_student" ON "public"."student_skills"("student_id");

-- CreateIndex
CREATE INDEX "idx_students_roll" ON "public"."student_profiles"("roll_number");

-- CreateIndex
CREATE INDEX "idx_students_section" ON "public"."student_profiles"("section");

-- AddForeignKey
ALTER TABLE "public"."achievements" ADD CONSTRAINT "achievements_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance_records" ADD CONSTRAINT "attendance_records_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "public"."course_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attendance_records" ADD CONSTRAINT "attendance_records_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_enrollments" ADD CONSTRAINT "course_enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."course_enrollments" ADD CONSTRAINT "course_enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."faculty_course_assignments" ADD CONSTRAINT "faculty_course_assignments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."faculty_course_assignments" ADD CONSTRAINT "faculty_course_assignments_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."faculty_profiles" ADD CONSTRAINT "faculty_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."internships" ADD CONSTRAINT "internships_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."placement_readiness" ADD CONSTRAINT "placement_readiness_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."semester_records" ADD CONSTRAINT "semester_records_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_profiles" ADD CONSTRAINT "student_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student_skills" ADD CONSTRAINT "student_skills_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."weak_student_radar" ADD CONSTRAINT "weak_student_radar_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."weak_student_radar" ADD CONSTRAINT "weak_student_radar_reviewed_by_faculty_id_fkey" FOREIGN KEY ("reviewed_by_faculty_id") REFERENCES "public"."faculty_profiles"("id") ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."weak_student_radar" ADD CONSTRAINT "weak_student_radar_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
