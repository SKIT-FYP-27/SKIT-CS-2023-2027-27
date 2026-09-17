/**
 * Quick sanity check that Prisma Client can connect to the database
 * and read through a couple of relations. Run with:
 *   npm run test:connection
 *
 * (Requires `npm install` + `npx prisma generate` to have been run
 * first, so the Prisma Client is generated from schema.prisma.)
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  const studentCount = await prisma.studentProfile.count();
  const facultyCount = await prisma.facultyProfile.count();
  const courseCount = await prisma.course.count();

  console.log("Connected to database successfully.\n");
  console.log(`users:             ${userCount}`);
  console.log(`student_profiles:  ${studentCount}`);
  console.log(`faculty_profiles:  ${facultyCount}`);
  console.log(`courses:           ${courseCount}`);

  // one relational query to prove the Prisma models/relations work
  const sample = await prisma.studentProfile.findFirst({
    include: {
      user: true,
      courseEnrollments: { take: 2, include: { course: true } },
    },
  });
  console.log("\nSample student (with relations):");
  console.log(JSON.stringify(sample, null, 2));
}

main()
  .catch((e) => {
    console.error("Connection/query failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
