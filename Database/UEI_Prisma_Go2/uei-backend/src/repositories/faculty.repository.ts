import { prisma } from "../prisma";
import type { AttendanceStatus } from "@prisma/client";

/** A faculty member's "My Courses" page — every section they teach this year. */
export function getFacultyCourseLoad(facultyId: string) {
  return prisma.facultyCourseAssignment.findMany({
    where: { facultyId },
    include: { course: true },
    orderBy: [{ academicYear: "desc" }, { semester: "asc" }],
  });
}

/**
 * Marks one attendance record for a student's enrollment. `upsert`
 * means re-marking the same session (same enrollment + date) just
 * updates the status instead of throwing a unique-constraint error,
 * which matches how attendance_records.@@unique([enrollmentId, attendanceDate])
 * is meant to be used.
 */
export function markAttendance(
  enrollmentId: string,
  facultyId: string,
  attendanceDate: Date,
  status: AttendanceStatus
) {
  return prisma.attendanceRecord.upsert({
    where: {
      enrollmentId_attendanceDate: { enrollmentId, attendanceDate },
    },
    create: { enrollmentId, facultyId, attendanceDate, status },
    update: { status, facultyId },
  });
}

/** Attendance % for one enrollment, computed from its recorded sessions. */
export async function getEnrollmentAttendancePct(enrollmentId: string) {
  const total = await prisma.attendanceRecord.count({ where: { enrollmentId } });
  if (total === 0) return null;
  const present = await prisma.attendanceRecord.count({
    where: { enrollmentId, status: "PRESENT" },
  });
  return Math.round((present / total) * 1000) / 10; // one decimal place
}
