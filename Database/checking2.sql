SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;


SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;


SELECT
    tc.table_name,
    kcu.column_name,
    tc.constraint_type,
    ccu.table_name AS referenced_table,
    ccu.column_name AS referenced_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON tc.constraint_name = ccu.constraint_name
    AND tc.table_schema = ccu.table_schema
WHERE tc.table_schema = 'public'
  AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')
ORDER BY tc.table_name, tc.constraint_type;



SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_type;


SELECT
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM pg_type t
JOIN pg_enum e
    ON t.oid = e.enumtypid
WHERE t.typname IN ('user_role', 'course_type', 'risk_level')
ORDER BY t.typname, e.enumsortorder;

SELECT 'users' AS table_name, COUNT(*) AS total FROM users
UNION ALL
SELECT 'student_profiles', COUNT(*) FROM student_profiles
UNION ALL
SELECT 'placement_readiness', COUNT(*) FROM placement_readiness
UNION ALL
SELECT 'faculty_profiles', COUNT(*) FROM faculty_profiles
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'course_enrollments', COUNT(*) FROM course_enrollments
UNION ALL
SELECT 'weak_student_radar', COUNT(*) FROM weak_student_radar
ORDER BY table_name;



SELECT
    (SELECT COUNT(*) 
     FROM faculty_profiles fp
     JOIN users u ON u.id = fp.user_id
     WHERE u.role <> 'FACULTY'::user_role) AS faculty_role_errors,

    (SELECT COUNT(*) 
     FROM course_enrollments ce
     LEFT JOIN student_profiles s ON s.id = ce.student_id
     LEFT JOIN courses c ON c.id = ce.course_id
     WHERE s.id IS NULL OR c.id IS NULL) AS orphan_enrollments,

    (SELECT COUNT(*) 
     FROM (
        SELECT student_id, course_id, academic_year
        FROM course_enrollments
        GROUP BY student_id, course_id, academic_year
        HAVING COUNT(*) > 1
     ) x) AS duplicate_enrollments,

    (SELECT COUNT(*) 
     FROM weak_student_radar r
     LEFT JOIN student_profiles s ON s.id = r.student_id
     LEFT JOIN courses c ON c.id = r.course_id
     LEFT JOIN faculty_profiles f ON f.id = r.reviewed_by_faculty_id
     WHERE s.id IS NULL OR c.id IS NULL OR f.id IS NULL) AS invalid_radar_links;