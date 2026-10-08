const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

const EDITABLE_FIELDS = ['phone', 'githubUrl', 'leetcodeUrl', 'linkedinUrl', 'resumeUrl', 'avatarUrl'];

exports.getProfile = asyncHandler(async (req, res) => {
    res.json({ profile: req.studentProfile });
});

exports.updateProfile = asyncHandler(async (req, res) => {
    const data = {};
    for (const field of EDITABLE_FIELDS) {
        if (req.body[field] !== undefined) data[field] = req.body[field];
    }

    const profile = await prisma.studentProfile.update({ where: { id: req.params.id }, data });
    res.json({ profile });
});

exports.getAcademics = asyncHandler(async (req, res) => {
    const [semesterRecords, enrollments] = await Promise.all([
        prisma.semesterRecord.findMany({
            where: { studentId: req.params.id },
            orderBy: { semester: 'asc' },
        }),
        prisma.courseEnrollment.findMany({
            where: { studentId: req.params.id },
            include: { course: true },
            orderBy: { semester: 'asc' },
        }),
    ]);

    res.json({ semesterRecords, enrollments });
});

exports.getSkills = asyncHandler(async (req, res) => {
    const [skills, achievements, internships] = await Promise.all([
        prisma.studentSkill.findMany({ where: { studentId: req.params.id }, orderBy: { skillName: 'asc' } }),
        prisma.achievement.findMany({ where: { studentId: req.params.id }, orderBy: { achievedOn: 'desc' } }),
        prisma.internship.findMany({ where: { studentId: req.params.id }, orderBy: { startDate: 'desc' } }),
    ]);

    res.json({ skills, achievements, internships });
});

exports.getPlacement = asyncHandler(async (req, res) => {
    const placement = await prisma.placementReadiness.findUnique({ where: { studentId: req.params.id } });
    res.json({ placement });
});
