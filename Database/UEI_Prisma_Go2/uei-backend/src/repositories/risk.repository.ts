import { prisma, } from "../prisma";
import type { RiskLevel } from "@prisma/client";

/**
 * The weak-student radar list a faculty/HOD dashboard would show —
 * optionally filtered by risk level, newest flags first, with just
 * enough student/course context to act on without a second query.
 */
export function listWeakStudents(level?: RiskLevel) {
  return prisma.weakStudentRadar.findMany({
    where: level ? { riskLevel: level } : undefined,
    include: {
      student: { select: { rollNumber: true, name: true, section: true } },
      course: { select: { code: true, title: true } },
    },
    orderBy: { flaggedAt: "desc" },
  });
}

/** Full risk history for one student, across every course they were flagged in. */
export function getStudentRiskHistory(studentId: string) {
  return prisma.weakStudentRadar.findMany({
    where: { studentId },
    include: { course: { select: { code: true, title: true } } },
    orderBy: { flaggedAt: "desc" },
  });
}

/** Faculty records an intervention against a flagged risk entry. */
export function markIntervention(
  radarId: string,
  facultyId: string,
  notes: string
) {
  return prisma.weakStudentRadar.update({
    where: { id: radarId },
    data: {
      reviewedByFacultyId: facultyId,
      facultyInterventionNotes: notes,
      isIntervened: true,
      reviewedAt: new Date(),
    },
  });
}

/** How many flags exist per risk level right now — feeds a dashboard stat tile. */
export async function getRiskLevelBreakdown() {
  const rows = await prisma.weakStudentRadar.groupBy({
    by: ["riskLevel"],
    _count: { _all: true },
  });
  return rows.map((r) => ({ riskLevel: r.riskLevel, count: r._count._all }));
}
