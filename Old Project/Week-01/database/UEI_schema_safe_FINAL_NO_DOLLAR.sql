-- UEI PLATFORM - COURSES, FACULTY & COURSE ENROLLMENT SEED
-- Schema-safe extension for the existing PostgreSQL UEI database.
-- Prerequisite: schema.sql + UEI_corrected_seed_1000_students.sql must already be loaded.
-- This file is idempotent: ON CONFLICT DO NOTHING / deterministic IDs prevent duplicate rows on rerun.

BEGIN;

  INSERT INTO users (id,email,password_hash,role) VALUES
    ('3f8d0a69-9c37-5997-a0bf-41068e75c552','faculty1@skit.ac.in','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','FACULTY'::user_role),
    ('b14ca183-aef1-5b53-b572-d75dc13b749f','faculty2@skit.ac.in','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','FACULTY'::user_role),
    ('3a526dc3-146e-5ffc-9315-062370b55289','faculty3@skit.ac.in','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','FACULTY'::user_role),
    ('3efbfef5-ee14-582e-9691-62516b88f88c','faculty4@skit.ac.in','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','FACULTY'::user_role),
    ('d06e0abd-0d7e-5e36-9a91-46be44f931d8','faculty5@skit.ac.in','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','FACULTY'::user_role),
    ('48ef41c7-bbff-5f87-b56f-570ccea26950','faculty6@skit.ac.in','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','FACULTY'::user_role),
    ('c173ff3c-1543-5c6c-8821-75aad7b210e2','faculty7@skit.ac.in','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','FACULTY'::user_role),
    ('8c6bfa7d-5e64-512a-aeb0-43a0d78163b4','faculty8@skit.ac.in','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','FACULTY'::user_role),
    ('7844ee63-a322-5723-882c-a984caaf4208','faculty9@skit.ac.in','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','FACULTY'::user_role),
    ('63e493b4-8963-5e29-bd63-61ca6035186a','faculty10@skit.ac.in','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','FACULTY'::user_role),
    ('cd9a47eb-3613-5a16-8f38-40c2de409760','faculty11@skit.ac.in','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','FACULTY'::user_role),
    ('0ffc5b94-4fc1-56fb-a831-43237ffc5447','faculty12@skit.ac.in','$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','FACULTY'::user_role)
  ON CONFLICT DO NOTHING;
INSERT INTO faculty_profiles (id,user_id,employee_id,name,department,designation,specialization,phone) VALUES
    ('fe5c93f6-e5a4-508d-aa3d-61d3961e79b6','3f8d0a69-9c37-5997-a0bf-41068e75c552','FAC2026001','Dr. Rajesh Sharma','Computer Science & Engineering','Assistant Professor','Data Structures & Algorithms','+91-90100000001'),
    ('aea15467-f034-51f8-bc1b-18594762d5ce','b14ca183-aef1-5b53-b572-d75dc13b749f','FAC2026002','Dr. Neha Verma','Computer Science & Engineering','Assistant Professor','Database Systems','+91-90200000002'),
    ('c21ecdfa-6821-58f3-80ad-01ad42723c64','3a526dc3-146e-5ffc-9315-062370b55289','FAC2026003','Dr. Amit Gupta','Computer Science & Engineering','Assistant Professor','Artificial Intelligence','+91-90300000003'),
    ('a4aa6329-cf7f-5e3f-958c-df3fbeeac2f0','3efbfef5-ee14-582e-9691-62516b88f88c','FAC2026004','Dr. Priya Mehta','Computer Science & Engineering','Assistant Professor','Machine Learning','+91-90400000004'),
    ('096bae8a-b448-52a4-b11b-94f573db47d7','d06e0abd-0d7e-5e36-9a91-46be44f931d8','FAC2026005','Dr. Sandeep Jain','Computer Science & Engineering','Assistant Professor','Computer Networks','+91-90500000005'),
    ('e22bf2b6-38c3-5617-9c4a-0acd181581d6','48ef41c7-bbff-5f87-b56f-570ccea26950','FAC2026006','Dr. Ritu Singh','Computer Science & Engineering','Assistant Professor','Operating Systems','+91-90600000006'),
    ('15ca48fc-df67-512c-815e-c085107e9c59','c173ff3c-1543-5c6c-8821-75aad7b210e2','FAC2026007','Dr. Vivek Agarwal','Computer Science & Engineering','Assistant Professor','Cloud Computing','+91-90700000007'),
    ('be990cb0-426f-5d38-9745-d477c185f5eb','8c6bfa7d-5e64-512a-aeb0-43a0d78163b4','FAC2026008','Dr. Pooja Saini','Computer Science & Engineering','Assistant Professor','Cyber Security','+91-90800000008'),
    ('d0409be6-f753-5863-8426-94a84553a16e','7844ee63-a322-5723-882c-a984caaf4208','FAC2026009','Dr. Manish Bansal','Computer Science & Engineering','Assistant Professor','Data Engineering','+91-90900000009'),
    ('d800e811-1ab0-565d-8548-728e67072757','63e493b4-8963-5e29-bd63-61ca6035186a','FAC2026010','Dr. Anjali Rathore','Computer Science & Engineering','Assistant Professor','Software Engineering','+91-91000000010'),
    ('3a618d80-06ca-5715-898b-c91424935f9c','cd9a47eb-3613-5a16-8f38-40c2de409760','FAC2026011','Dr. Karan Mathur','Computer Science & Engineering','Assistant Professor','Computer Architecture','+91-91100000011'),
    ('b84eb5f1-c2a0-59d4-9839-df45cf02a21f','0ffc5b94-4fc1-56fb-a831-43237ffc5447','FAC2026012','Dr. Nidhi Sharma','Computer Science & Engineering','Assistant Professor','Web Technologies','+91-91200000012')
ON CONFLICT DO NOTHING;

INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('817d9a6f-e405-58f8-991b-373c31bd4e25','CS101','Programming Fundamentals',1,4,'THEORY'::course_type,'Programming Fundamentals for CSE Semester 1. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('325f5f11-db40-5f00-816d-d66357e36c70','CS102','Discrete Mathematics',1,4,'THEORY'::course_type,'Discrete Mathematics for CSE Semester 1. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('945cbb28-3a50-5ed1-8e70-c416ee3f92f0','CS103','Digital Logic',1,4,'THEORY'::course_type,'Digital Logic for CSE Semester 1. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('cc6bfe47-d156-5f3c-a0a6-64be53ff1202','CS104','Communication Skills',1,3,'THEORY'::course_type,'Communication Skills for CSE Semester 1. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('c697ab81-ffed-5fa6-9b51-be0954571d20','CS105','Engineering Mathematics-I',1,3,'LAB'::course_type,'Engineering Mathematics-I for CSE Semester 1. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('5ceb5573-0231-5d70-848b-193fcfdb644c','CS106','Data Structures',2,4,'THEORY'::course_type,'Data Structures for CSE Semester 2. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('c8e42f25-4acd-5f8b-8bce-f0cab27cc71f','CS107','Database Management Systems',2,4,'THEORY'::course_type,'Database Management Systems for CSE Semester 2. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('5297007a-130e-5341-af7a-4e9027c2dadf','CS108','Computer Organization',2,4,'THEORY'::course_type,'Computer Organization for CSE Semester 2. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('f27d152a-f613-51a3-aea8-0506e5d24c3a','CS109','Object Oriented Programming',2,3,'THEORY'::course_type,'Object Oriented Programming for CSE Semester 2. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('f8b6ad01-594d-5e52-b325-ed9eb13211e1','CS110','Engineering Mathematics-II',2,3,'LAB'::course_type,'Engineering Mathematics-II for CSE Semester 2. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('4f40fe7b-0f58-50c8-a8ba-d900ce500bf5','CS201','Operating Systems',3,4,'THEORY'::course_type,'Operating Systems for CSE Semester 3. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('8f83553f-2110-548d-99ab-608af2fa910e','CS202','Computer Networks',3,4,'THEORY'::course_type,'Computer Networks for CSE Semester 3. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('4c3c9c46-363c-5d2d-9f8c-6c6fb93b6841','CS203','Design and Analysis of Algorithms',3,4,'THEORY'::course_type,'Design and Analysis of Algorithms for CSE Semester 3. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('28c5f6d1-a5f4-5b3a-881c-9c8bb402cded','CS204','Software Engineering',3,3,'THEORY'::course_type,'Software Engineering for CSE Semester 3. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('97d0e514-ef26-5ab2-9c46-65c2c877e602','CS205','Probability and Statistics',3,3,'LAB'::course_type,'Probability and Statistics for CSE Semester 3. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('40d412e8-fc3b-5972-8ff2-90b35de8a2d3','CS206','Theory of Computation',4,4,'THEORY'::course_type,'Theory of Computation for CSE Semester 4. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('859db046-894d-53cc-8cb4-3643d0c7f1fe','CS207','Web Technologies',4,4,'THEORY'::course_type,'Web Technologies for CSE Semester 4. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('a71f945b-22bf-5921-85a0-cb1acd7cb2e6','CS208','Artificial Intelligence',4,4,'THEORY'::course_type,'Artificial Intelligence for CSE Semester 4. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('21e87180-7538-5689-922d-8889674702ed','CS209','Compiler Design',4,3,'THEORY'::course_type,'Compiler Design for CSE Semester 4. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('730c5632-33dc-5e69-a798-6135043a47aa','CS210','Advanced Database Systems',4,3,'LAB'::course_type,'Advanced Database Systems for CSE Semester 4. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('907aaef5-5595-57e1-9574-073b85a0ede6','CS301','Machine Learning',5,4,'THEORY'::course_type,'Machine Learning for CSE Semester 5. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('a0f36168-6bb1-5e4f-abe6-7bf93036fc61','CS302','Cloud Computing',5,4,'THEORY'::course_type,'Cloud Computing for CSE Semester 5. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('28cfcc87-623d-5ee1-9f4c-42a28c40abe5','CS303','Distributed Systems',5,4,'THEORY'::course_type,'Distributed Systems for CSE Semester 5. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('d6104478-80d9-5dd2-a5bb-8d51c48b9a53','CS304','Computer Graphics',5,3,'THEORY'::course_type,'Computer Graphics for CSE Semester 5. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('c04d1c79-289b-5b83-9dc1-e40a66e21cd4','CS305','Data Mining',5,3,'LAB'::course_type,'Data Mining for CSE Semester 5. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('539f9c66-84f9-5b19-943a-cb15d62bbc33','CS306','Big Data Analytics',6,4,'THEORY'::course_type,'Big Data Analytics for CSE Semester 6. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('005078bd-c539-5c44-a631-7e7dd9fb778c','CS307','Cyber Security',6,4,'THEORY'::course_type,'Cyber Security for CSE Semester 6. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('d9518e1b-06ba-5f43-b6b9-67d017eaae5d','CS308','DevOps Engineering',6,4,'THEORY'::course_type,'DevOps Engineering for CSE Semester 6. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('2bc3bd90-0760-5d47-9467-5a5992c412e5','CS309','Mobile Application Development',6,3,'THEORY'::course_type,'Mobile Application Development for CSE Semester 6. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('29f10515-0a52-55f4-896b-fa882e11e38e','CS310','Natural Language Processing',6,3,'LAB'::course_type,'Natural Language Processing for CSE Semester 6. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('916c09ed-2ed2-523c-938c-f8e5f802f260','CS401','Deep Learning',7,4,'THEORY'::course_type,'Deep Learning for CSE Semester 7. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('f2cb5a54-6c19-507f-a8f0-8dd18f6e2c08','CS402','Data Engineering',7,4,'THEORY'::course_type,'Data Engineering for CSE Semester 7. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('8391f5b8-9ea8-5557-ba62-b728639eebe4','CS403','Blockchain Technology',7,4,'THEORY'::course_type,'Blockchain Technology for CSE Semester 7. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('d78e91ae-45ad-5c9a-932f-a6be52b73d0b','CS404','Information Security',7,3,'THEORY'::course_type,'Information Security for CSE Semester 7. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('c9bc158e-cea8-5133-81ff-3e5a0015a1b7','CS405','Project Management',7,3,'LAB'::course_type,'Project Management for CSE Semester 7. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('c9c69745-223f-512c-8448-88da8488a9f6','CS406','Generative AI',8,4,'THEORY'::course_type,'Generative AI for CSE Semester 8. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('15e65b0c-f14f-508d-a7d7-1cdf7d982718','CS407','MLOps',8,4,'THEORY'::course_type,'MLOps for CSE Semester 8. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('a5ab8d3a-6096-5a0a-b913-7cbd32d975e1','CS408','Cloud Data Engineering',8,4,'THEORY'::course_type,'Cloud Data Engineering for CSE Semester 8. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('5a4439f1-3db8-51ba-994b-fd0c10a7db49','CS409','Advanced Computer Vision',8,3,'THEORY'::course_type,'Advanced Computer Vision for CSE Semester 8. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;
  INSERT INTO courses (id,code,title,semester,credits,type,description) VALUES ('7f45759d-0065-5dfe-823b-1c9e640db3f2','CS410','Major Project',8,3,'LAB'::course_type,'Major Project for CSE Semester 8. Synthetic academic master data for UEI development and analytics.') ON CONFLICT DO NOTHING;

WITH marks AS (
  SELECT s.id AS student_id, c.id AS course_id, s.current_semester AS semester,
    ROUND(LEAST(20, GREATEST(0, 10 + s.current_cgpa * 0.80 + (ABS(hashtext(s.id::text || c.id::text || 'i')) % 31) / 10.0))::numeric,2)::double precision AS internal_marks,
    ROUND(LEAST(20, GREATEST(0, 9 + s.current_cgpa * 0.82 + (ABS(hashtext(s.id::text || c.id::text || 'm')) % 41) / 10.0))::numeric,2)::double precision AS mid_term_marks,
    ROUND(LEAST(20, GREATEST(0, 10 + s.current_cgpa * 0.85 + (ABS(hashtext(s.id::text || c.id::text || 'l')) % 31) / 10.0))::numeric,2)::double precision AS lab_marks,
    ROUND(LEAST(40, GREATEST(0, 18 + s.current_cgpa * 1.80 + (ABS(hashtext(s.id::text || c.id::text || 'f')) % 61) / 10.0))::numeric,2)::double precision AS final_exam_marks
  FROM student_profiles s JOIN courses c ON c.semester=s.current_semester
), scored AS (
  SELECT *, ROUND((internal_marks+mid_term_marks+lab_marks+final_exam_marks)::numeric,2)::double precision AS total_marks
  FROM marks
)
INSERT INTO course_enrollments (id,student_id,course_id,academic_year,semester,internal_marks,mid_term_marks,lab_marks,final_exam_marks,total_marks,grade,is_backlog)
SELECT md5(student_id::text || ':' || course_id::text || ':2026-27')::uuid,
  student_id,course_id,'2026-27',semester,internal_marks,mid_term_marks,lab_marks,final_exam_marks,total_marks,
  CASE WHEN total_marks>=90 THEN 'A+' WHEN total_marks>=80 THEN 'A' WHEN total_marks>=70 THEN 'B+' WHEN total_marks>=60 THEN 'B' WHEN total_marks>=50 THEN 'C' WHEN total_marks>=40 THEN 'D' ELSE 'F' END,
  total_marks < 40
FROM scored
ON CONFLICT DO NOTHING;

-- Attach every existing radar flag to a valid course in the student's current semester.
WITH ranked_courses AS (
  SELECT c.id, c.semester, ROW_NUMBER() OVER (PARTITION BY c.semester ORDER BY c.code) AS rn
  FROM courses c
), radar_map AS (
  SELECT r.id AS radar_id, rc.id AS course_id
  FROM weak_student_radar r
  JOIN student_profiles s ON s.id=r.student_id
  JOIN ranked_courses rc ON rc.semester=s.current_semester
  WHERE rc.rn = (ABS(hashtext(r.id::text)) % 5) + 1
)
UPDATE weak_student_radar r
SET course_id = m.course_id
FROM radar_map m
WHERE r.id=m.radar_id;

-- Assign faculty reviewers to a subset/all of radar records and mark intervention status deterministically.
WITH faculty AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY employee_id) AS rn FROM faculty_profiles
), mapped AS (
  SELECT r.id AS radar_id, f.id AS faculty_id,
         (ABS(hashtext(r.id::text || ':intervention')) % 100) < 60 AS intervened
  FROM weak_student_radar r CROSS JOIN LATERAL (
    SELECT id, rn FROM faculty WHERE rn=((ABS(hashtext(r.id::text)) % 12)+1)
  ) f
)
UPDATE weak_student_radar r
SET reviewed_by_faculty_id=m.faculty_id,
    is_intervened=m.intervened,
    faculty_intervention_notes=CASE WHEN m.intervened THEN 'Faculty intervention scheduled: mentoring, attendance follow-up and course support recommended.' ELSE NULL END,
    reviewed_at=CASE WHEN m.intervened THEN TIMESTAMP '2026-09-03 10:00:00' ELSE NULL END
FROM mapped m
WHERE r.id=m.radar_id;

-- ============================================================
-- POST-LOAD VALIDATION
-- These checks must return zero for integrity violations.
-- ============================================================

-- 1. Course count and semester coverage
SELECT semester, COUNT(*) AS course_count
FROM courses
GROUP BY semester
ORDER BY semester;

-- 2. Faculty must reference valid FACULTY users
SELECT COUNT(*) AS faculty_user_role_mismatch
FROM faculty_profiles fp
JOIN users u ON u.id = fp.user_id
WHERE u.role <> 'FACULTY'::user_role;

-- 3. Enrollments must reference existing students/courses
SELECT COUNT(*) AS orphan_enrollments
FROM course_enrollments ce
LEFT JOIN student_profiles s ON s.id = ce.student_id
LEFT JOIN courses c ON c.id = ce.course_id
WHERE s.id IS NULL OR c.id IS NULL;

-- 4. Same student/course/academic year must not repeat
SELECT COUNT(*) AS duplicate_enrollment_groups
FROM (
  SELECT student_id, course_id, academic_year
  FROM course_enrollments
  GROUP BY student_id, course_id, academic_year
  HAVING COUNT(*) > 1
) d;

-- 5. Radar records must have valid course and faculty references
SELECT COUNT(*) AS invalid_radar_links
FROM weak_student_radar r
LEFT JOIN student_profiles s ON s.id=r.student_id
LEFT JOIN courses c ON c.id=r.course_id
LEFT JOIN faculty_profiles f ON f.id=r.reviewed_by_faculty_id
WHERE s.id IS NULL OR c.id IS NULL OR f.id IS NULL;

COMMIT;
