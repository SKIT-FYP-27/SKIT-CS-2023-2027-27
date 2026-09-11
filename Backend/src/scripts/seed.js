require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const SEED_USERS = [
    {
        email: 'student1@uei.edu',
        password: 'Student@123',
        role: 'STUDENT',
        profile: {
            roll_number: 'CS2027-001',
            registration_no: 'REG2027001',
            name: 'Test Student',
            section: 'A',
            batch_year: '2023-2027',
        },
    },
    {
        email: 'faculty1@uei.edu',
        password: 'Faculty@123',
        role: 'FACULTY',
        profile: {
            employee_id: 'EMP001',
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

    const { rows } = await db.query(
        `INSERT INTO users (email, password_hash, role)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
         RETURNING id`,
        [email, passwordHash, role]
    );

    return rows[0].id;
}

async function upsertStudentProfile(userId, profile) {
    await db.query(
        `INSERT INTO student_profiles (user_id, roll_number, registration_no, name, section, batch_year)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id) DO NOTHING`,
        [userId, profile.roll_number, profile.registration_no, profile.name, profile.section, profile.batch_year]
    );
}

async function upsertFacultyProfile(userId, profile) {
    await db.query(
        `INSERT INTO faculty_profiles (user_id, employee_id, name, designation)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id) DO NOTHING`,
        [userId, profile.employee_id, profile.name, profile.designation]
    );
}

async function run() {
    for (const seedUser of SEED_USERS) {
        const userId = await upsertUser(seedUser);

        if (seedUser.role === 'STUDENT') {
            await upsertStudentProfile(userId, seedUser.profile);
        } else if (seedUser.role === 'FACULTY') {
            await upsertFacultyProfile(userId, seedUser.profile);
        }

        console.log(`Seeded ${seedUser.role} -> ${seedUser.email} / ${seedUser.password}`);
    }

    await db.pool.end();
}

run().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
