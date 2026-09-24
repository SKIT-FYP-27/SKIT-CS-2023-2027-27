import { prisma } from "../prisma";

/**
 * The "Digital Twin" view — one call that pulls together everything
 * the Student/HOD dashboards need about a single student: profile,
 * account, enrollments+courses, skills, internships, achievements,
 * semester history, placement readiness and any open risk flags.
 *
 * Without Prisma this would be 6-7 separate hand-written JOIN
 * queries; `include` builds them all in one round trip.
 */
export function getStudentDigitalTwin(studentId: string) {
  return prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      user: { select: { email: true, role: true, isActive: true } },
      courseEnrollments: {
        include: { course: true },
        orderBy: { semester: "desc" },
      },
      skills: true,
      internships: { orderBy: { startDate: "desc" } },
      achievements: { orderBy: { achievedOn: "desc" } },
      semesterRecords: { orderBy: { semester: "asc" } },
      placementReadiness: true,
      weakStudentRadar: {
        where: { isIntervened: false },
        include: { course: true },
      },
    },
  });
}

/** All students in a given section, lightweight list for a roster view. */
export function listStudentsBySection(section: string) {
  return prisma.studentProfile.findMany({
    where: { section },
    select: {
      id: true,
      rollNumber: true,
      name: true,
      currentSemester: true,
      currentCgpa: true,
      overallAttendance: true,
    },
    orderBy: { rollNumber: "asc" },
  });
}

/**
 * Creates a User + StudentProfile together as one atomic operation —
 * if the profile insert fails (duplicate roll number, etc.) the user
 * row is rolled back too, so we never end up with an orphaned login
 * and no profile.
 */
export function createStudentWithAccount(input: {
  email: string;
  passwordHash: string;
  rollNumber: string;
  registrationNo: string;
  name: string;
  section: string;
  batchYear: string;
}) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        role: "STUDENT",
      },
    });

    const profile = await tx.studentProfile.create({
      data: {
        userId: user.id,
        rollNumber: input.rollNumber,
        registrationNo: input.registrationNo,
        name: input.name,
        section: input.section,
        batchYear: input.batchYear,
      },
    });

    return { user, profile };
  });
}
