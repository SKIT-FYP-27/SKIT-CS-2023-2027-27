SELECT 'users' AS table_name, COUNT(*) AS total
FROM users

UNION ALL

SELECT 'student_profiles', COUNT(*)
FROM student_profiles

UNION ALL

SELECT 'placement_readiness', COUNT(*)
FROM placement_readiness

UNION ALL

SELECT 'weak_student_radar', COUNT(*)
FROM weak_student_radar;