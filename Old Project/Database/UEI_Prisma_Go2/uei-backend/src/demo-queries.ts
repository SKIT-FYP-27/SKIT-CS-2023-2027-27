/**
 * Go 2 demo — exercises the repository layer against the seeded
 * database and prints the results. Run with:
 *   npm run demo:queries
 */
import { prisma } from "./prisma";
import { listStudentsBySection, getStudentDigitalTwin } from "./repositories/student.repository";
import { listWeakStudents, getRiskLevelBreakdown } from "./repositories/risk.repository";
import { getPlacementStats, getSectionPerformance, getCourseBacklogRates } from "./repositories/analytics.repository";

async function main() {
  console.log("=== Section A roster (first 5) ===");
  const roster = await listStudentsBySection("A");
  console.table(roster.slice(0, 5));

  if (roster.length > 0) {
    console.log(`\n=== Digital Twin for ${roster[0].name} ===`);
    const twin = await getStudentDigitalTwin(roster[0].id);
    console.log({
      name: twin?.name,
      cgpa: twin?.currentCgpa,
      enrollments: twin?.courseEnrollments.length,
      skills: twin?.skills.length,
      openRiskFlags: twin?.weakStudentRadar.length,
    });
  }

  console.log("\n=== Risk level breakdown ===");
  console.table(await getRiskLevelBreakdown());

  console.log("\n=== Top 5 HIGH-risk flags ===");
  const highRisk = await listWeakStudents("HIGH");
  console.table(
    highRisk.slice(0, 5).map((r) => ({
      student: r.student?.name,
      course: r.course?.code,
      riskScore: r.riskScore,
      factor: r.primaryRiskFactor,
    }))
  );

  console.log("\n=== Placement stats ===");
  console.table(await getPlacementStats());

  console.log("\n=== Section performance ===");
  console.table(await getSectionPerformance());

  console.log("\n=== Course backlog rates (top 5) ===");
  const backlogs = await getCourseBacklogRates();
  console.table(
    backlogs.sort((a, b) => b.backlogRatePct - a.backlogRatePct).slice(0, 5)
  );
}

main()
  .catch((e) => {
    console.error("Demo failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
