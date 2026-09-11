const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (user) =>
    jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const { rows } = await db.query(
        'SELECT id, email, password_hash, role, is_active FROM users WHERE email = $1',
        [email]
    );
    const user = rows[0];

    if (!user || !user.is_active) {
        return next(new ApiError(401, 'Invalid email or password'));
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return next(new ApiError(401, 'Invalid email or password'));
    }

    const token = signToken(user);
    res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role },
    });
});

exports.me = asyncHandler(async (req, res, next) => {
    const { id, role } = req.user;

    const { rows } = await db.query('SELECT id, email, role, is_active FROM users WHERE id = $1', [id]);
    const user = rows[0];
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    let profile = null;
    if (role === 'STUDENT') {
        const result = await db.query('SELECT * FROM student_profiles WHERE user_id = $1', [id]);
        profile = result.rows[0] || null;
    } else if (role === 'FACULTY') {
        const result = await db.query('SELECT * FROM faculty_profiles WHERE user_id = $1', [id]);
        profile = result.rows[0] || null;
    }

    res.json({ user, profile });
});
