require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

const SEED_USERS = [
    {
        email: 'student1@uei.edu',
        password: 'Student@123',
        role: 'STUDENT',
        profile: {
            rollNumber: 'CS2027-001',
            registrationNo: 'REG2027001',
            name: 'Test Student',
            section: 'A',
            batchYear: '2023-2027',
        },
    },
    {
        email: 'faculty1@uei.edu',
        password: 'Faculty@123',
        role: 'FACULTY',
        profile: {
            employeeId: 'EMP001',
            name: 'Test Faculty',
            designation: 'Assistant Professor',
        },
    },
    {
        email: 'hod1@uei.edu',
        password: 'Hod@123',
        role: 'HOD',
        profile: null,
    },
];

async function upsertUser({ email, password, role }) {
    const passwordHash = await bcrypt.hash(password, 10);

    return prisma.user.upsert({
        where: { email },
        update: { passwordHash },
        create: { email, passwordHash, role },
    });
}

async function upsertStudentProfile(userId, profile) {
    await prisma.studentProfile.upsert({
        where: { userId },
        update: {},
        create: { userId, ...profile },
    });
}

async function upsertFacultyProfile(userId, profile) {
    await prisma.facultyProfile.upsert({
        where: { userId },
        update: {},
        create: { userId, ...profile },
    });
}

async function run() {
    for (const seedUser of SEED_USERS) {
        const user = await upsertUser(seedUser);

        if (seedUser.role === 'STUDENT') {
            await upsertStudentProfile(user.id, seedUser.profile);
        } else if (seedUser.role === 'FACULTY') {
            await upsertFacultyProfile(user.id, seedUser.profile);
        }

        console.log(`Seeded ${seedUser.role} -> ${seedUser.email} / ${seedUser.password}`);
    }

    await prisma.$disconnect();
}

run().catch(async (err) => {
    console.error('Seed failed:', err);
    await prisma.$disconnect();
    process.exit(1);
});
