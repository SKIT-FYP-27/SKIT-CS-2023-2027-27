const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

async function getFacultyProfile(userId) {
    return prisma.facultyProfile.findUnique({ where: { userId } });
}

async function assertAssignedToCourse(facultyId, courseId, next) {
    const assignment = await prisma.facultyCourseAssignment.findFirst({
        where: { facultyId, courseId },
    });
    if (!assignment) {
        next(new ApiError(403, 'You are not assigned to this course'));
        return false;
    }
    return true;
}

exports.getMyCourses = asyncHandler(async (req, res, next) => {
    const faculty = await getFacultyProfile(req.user.id);
    if (!faculty) return next(new ApiError(404, 'Faculty profile not found'));

    const assignments = await prisma.facultyCourseAssignment.findMany({
        where: { facultyId: faculty.id },
        include: { course: true },
        orderBy: { assignedAt: 'desc' },
    });

    res.json({ assignments });
});

exports.getGradebook = asyncHandler(async (req, res, next) => {
    const faculty = await getFacultyProfile(req.user.id);
    if (!faculty) return next(new ApiError(404, 'Faculty profile not found'));

    const courseId = req.params.id;
    if (!(await assertAssignedToCourse(faculty.id, courseId, next))) return;

    const enrollments = await prisma.courseEnrollment.findMany({
        where: { courseId },
        include: { student: true },
        orderBy: { student: { rollNumber: 'asc' } },
    });

    res.json({ enrollments });
});

exports.updateGradebook = asyncHandler(async (req, res, next) => {
    const faculty = await getFacultyProfile(req.user.id);
    if (!faculty) return next(new ApiError(404, 'Faculty profile not found'));

    const courseId = req.params.id;
    if (!(await assertAssignedToCourse(faculty.id, courseId, next))) return;

    const { enrollments } = req.body;
    if (!Array.isArray(enrollments) || enrollments.length === 0) {
        return next(new ApiError(400, 'enrollments must be a non-empty array'));
    }

    const updated = await prisma.$transaction(
        enrollments.map(({ enrollmentId, internalMarks, midTermMarks, labMarks, finalExamMarks, grade, isBacklog }) =>
            prisma.courseEnrollment.update({
                where: { id: enrollmentId },
                data: { internalMarks, midTermMarks, labMarks, finalExamMarks, grade, isBacklog },
            })
        )
    );

    res.json({ updated });
});

exports.getAttendance = asyncHandler(async (req, res, next) => {
    const faculty = await getFacultyProfile(req.user.id);
    if (!faculty) return next(new ApiError(404, 'Faculty profile not found'));

    const courseId = req.params.id;
    if (!(await assertAssignedToCourse(faculty.id, courseId, next))) return;

    const records = await prisma.attendanceRecord.findMany({
        where: { enrollment: { courseId } },
        include: { enrollment: { include: { student: true } } },
        orderBy: { attendanceDate: 'desc' },
    });

    res.json({ records });
});

exports.markAttendance = asyncHandler(async (req, res, next) => {
    const faculty = await getFacultyProfile(req.user.id);
    if (!faculty) return next(new ApiError(404, 'Faculty profile not found'));

    const courseId = req.params.id;
    if (!(await assertAssignedToCourse(faculty.id, courseId, next))) return;

    const { attendanceDate, records } = req.body;
    if (!attendanceDate || !Array.isArray(records) || records.length === 0) {
        return next(new ApiError(400, 'attendanceDate and a non-empty records array are required'));
    }

    const results = await prisma.$transaction(
        records.map(({ enrollmentId, status, remarks }) =>
            prisma.attendanceRecord.upsert({
                where: { enrollmentId_attendanceDate: { enrollmentId, attendanceDate: new Date(attendanceDate) } },
                update: { status, remarks, facultyId: faculty.id },
                create: { enrollmentId, attendanceDate: new Date(attendanceDate), status, remarks, facultyId: faculty.id },
            })
        )
    );

    res.json({ records: results });
});

exports.getAtRiskStudents = asyncHandler(async (req, res, next) => {
    const faculty = await getFacultyProfile(req.user.id);
    if (!faculty) return next(new ApiError(404, 'Faculty profile not found'));

    const assignedCourseIds = (
        await prisma.facultyCourseAssignment.findMany({ where: { facultyId: faculty.id }, select: { courseId: true } })
    ).map((a) => a.courseId);

    const radar = await prisma.weakStudentRadar.findMany({
        where: { OR: [{ courseId: { in: assignedCourseIds } }, { courseId: null }] },
        include: { student: true, course: true },
        orderBy: { riskScore: 'desc' },
    });

    res.json({ radar });
});

exports.intervene = asyncHandler(async (req, res, next) => {
    const faculty = await getFacultyProfile(req.user.id);
    if (!faculty) return next(new ApiError(404, 'Faculty profile not found'));

    const { facultyInterventionNotes } = req.body;
    if (!facultyInterventionNotes) {
        return next(new ApiError(400, 'facultyInterventionNotes is required'));
    }

    const existing = await prisma.weakStudentRadar.findUnique({ where: { id: req.params.id } });
    if (!existing) return next(new ApiError(404, 'Risk record not found'));

    const radar = await prisma.weakStudentRadar.update({
        where: { id: req.params.id },
        data: {
            facultyInterventionNotes,
            isIntervened: true,
            reviewedByFacultyId: faculty.id,
            reviewedAt: new Date(),
        },
    });

    res.json({ radar });
});

exports.getStudentProfile = asyncHandler(async (req, res, next) => {
    const faculty = await getFacultyProfile(req.user.id);
    if (!faculty) return next(new ApiError(404, 'Faculty profile not found'));

    const assignedCourseIds = (
        await prisma.facultyCourseAssignment.findMany({ where: { facultyId: faculty.id }, select: { courseId: true } })
    ).map((a) => a.courseId);

    const onRoster = await prisma.courseEnrollment.findFirst({
        where: { studentId: req.params.id, courseId: { in: assignedCourseIds } },
    });
    if (!onRoster) {
        return next(new ApiError(403, 'This student is not on any of your assigned courses'));
    }

    const profile = await prisma.studentProfile.findUnique({
        where: { id: req.params.id },
        include: { semesterRecords: true, skills: true, achievements: true, internships: true, placementReadiness: true },
    });
    if (!profile) return next(new ApiError(404, 'Student not found'));

    res.json({ profile });
});
