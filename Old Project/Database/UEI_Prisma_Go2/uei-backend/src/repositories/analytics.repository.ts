import { prisma } from "../prisma";

/** Placement outcome breakdown — count + average package per status. */
export async function getPlacementStats() {
  const rows = await prisma.placementReadiness.groupBy({
    by: ["placementStatus"],
    _count: { _all: true },
    _avg: { package: true, overallScore: true },
  });
  return rows.map((r) => ({
    status: r.placementStatus,
    count: r._count._all,
    avgPackageLpa: r._avg.package ? Math.round(r._avg.package * 100) / 100 : null,
    avgReadinessScore: r._avg.overallScore
      ? Math.round(r._avg.overallScore * 10) / 10
      : null,
  }));
}

/** Average CGPA + attendance per section — a quick HOD-level comparison. */
export async function getSectionPerformance() {
  const rows = await prisma.studentProfile.groupBy({
    by: ["section"],
    _avg: { currentCgpa: true, overallAttendance: true },
    _count: { _all: true },
    orderBy: { section: "asc" },
  });
  return rows.map((r) => ({
    section: r.section,
    studentCount: r._count._all,
    avgCgpa: r._avg.currentCgpa ? Math.round(r._avg.currentCgpa * 100) / 100 : null,
    avgAttendance: r._avg.overallAttendance
      ? Math.round(r._avg.overallAttendance * 10) / 10
      : null,
  }));
}

/** Course-wise pass/backlog breakdown for the current enrollments. */
export async function getCourseBacklogRates() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      code: true,
      title: true,
      _count: { select: { enrollments: true } },
      enrollments: { where: { isBacklog: true }, select: { id: true } },
    },
  });
  return courses
    .filter((c) => c._count.enrollments > 0)
    .map((c) => ({
      code: c.code,
      title: c.title,
      enrolled: c._count.enrollments,
      backlogs: c.enrollments.length,
      backlogRatePct:
        Math.round((c.enrollments.length / c._count.enrollments) * 1000) / 10,
    }));
}
