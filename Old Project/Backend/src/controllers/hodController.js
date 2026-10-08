const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

exports.getOverview = asyncHandler(async (req, res) => {
    const [studentAgg, riskCounts, placedCount, totalStudents] = await Promise.all([
        prisma.studentProfile.aggregate({ _avg: { currentCgpa: true, overallAttendance: true } }),
        prisma.weakStudentRadar.groupBy({ by: ['riskLevel'], _count: true }),
        prisma.placementReadiness.count({ where: { placementStatus: 'PLACED' } }),
        prisma.studentProfile.count(),
    ]);

    const riskDistribution = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    riskCounts.forEach((r) => {
        riskDistribution[r.riskLevel] = r._count;
    });

    res.json({
        averageCgpa: studentAgg._avg.currentCgpa,
        averageAttendance: studentAgg._avg.overallAttendance,
        totalStudents,
        placementRate: totalStudents ? placedCount / totalStudents : 0,
        highRiskCount: riskDistribution.HIGH,
        riskDistribution,
    });
});

exports.getAcademics = asyncHandler(async (req, res) => {
    const [semesterTrend, gradeDistribution, batchAcademics] = await Promise.all([
        prisma.semesterRecord.groupBy({
            by: ['semester'],
            _avg: { sgpa: true },
            orderBy: { semester: 'asc' },
        }),
        prisma.courseEnrollment.groupBy({ by: ['grade'], _count: true }),
        prisma.studentProfile.groupBy({
            by: ['batchYear'],
            _avg: { currentCgpa: true },
            orderBy: { batchYear: 'asc' },
        }),
    ]);

    res.json({ semesterTrend, gradeDistribution, batchAcademics });
});

exports.getRiskAnalytics = asyncHandler(async (req, res) => {
    const [riskCounts, interventionCounts, highRiskStudents] = await Promise.all([
        prisma.weakStudentRadar.groupBy({ by: ['riskLevel'], _count: true }),
        prisma.weakStudentRadar.groupBy({ by: ['isIntervened'], _count: true }),
        prisma.weakStudentRadar.findMany({
            where: { riskLevel: 'HIGH' },
            include: { student: true, course: true },
            orderBy: { riskScore: 'desc' },
            take: 50,
        }),
    ]);

    const riskDistribution = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    riskCounts.forEach((r) => {
        riskDistribution[r.riskLevel] = r._count;
    });

    const intervention = { intervened: 0, pending: 0 };
    interventionCounts.forEach((r) => {
        if (r.isIntervened) intervention.intervened = r._count;
        else intervention.pending = r._count;
    });

    res.json({ riskDistribution, intervention, highRiskStudents });
});

exports.getBatchComparison = asyncHandler(async (req, res) => {
    const students = await prisma.studentProfile.findMany({
        select: { batchYear: true, currentCgpa: true, overallAttendance: true, placementReadiness: true },
    });

    const byBatch = {};
    for (const s of students) {
        if (!byBatch[s.batchYear]) {
            byBatch[s.batchYear] = { batchYear: s.batchYear, studentCount: 0, cgpaSum: 0, attendanceSum: 0, placedCount: 0 };
        }
        const b = byBatch[s.batchYear];
        b.studentCount += 1;
        b.cgpaSum += s.currentCgpa ?? 0;
        b.attendanceSum += s.overallAttendance ?? 0;
        if (s.placementReadiness?.placementStatus === 'PLACED') b.placedCount += 1;
    }

    const batches = Object.values(byBatch)
        .map((b) => ({
            batchYear: b.batchYear,
            studentCount: b.studentCount,
            averageCgpa: b.studentCount ? b.cgpaSum / b.studentCount : 0,
            averageAttendance: b.studentCount ? b.attendanceSum / b.studentCount : 0,
            placementRate: b.studentCount ? b.placedCount / b.studentCount : 0,
        }))
        .sort((a, b) => a.batchYear.localeCompare(b.batchYear));

    res.json({ batches });
});

exports.getPlacementStatistics = asyncHandler(async (req, res) => {
    const [statusCounts, packageAgg, companies, totalStudents] = await Promise.all([
        prisma.placementReadiness.groupBy({ by: ['placementStatus'], _count: true }),
        prisma.placementReadiness.aggregate({
            where: { placementStatus: 'PLACED' },
            _avg: { package: true },
            _max: { package: true },
        }),
        prisma.placementReadiness.findMany({
            where: { company: { not: null } },
            select: { company: true },
            distinct: ['company'],
        }),
        prisma.studentProfile.count(),
    ]);

    const byStatus = { NOT_PLACED: 0, IN_PROCESS: 0, PLACED: 0 };
    statusCounts.forEach((s) => {
        byStatus[s.placementStatus] = s._count;
    });

    res.json({
        placementRate: totalStudents ? byStatus.PLACED / totalStudents : 0,
        totalOffers: byStatus.PLACED,
        averagePackage: packageAgg._avg.package,
        highestPackage: packageAgg._max.package,
        statusBreakdown: byStatus,
        companies: companies.map((c) => c.company),
    });
});
