const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (user) =>
    jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
        return next(new ApiError(401, 'Invalid email or password'));
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
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

    const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, role: true, isActive: true },
    });
    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    let profile = null;
    if (role === 'STUDENT') {
        profile = await prisma.studentProfile.findUnique({ where: { userId: id } });
    } else if (role === 'FACULTY') {
        profile = await prisma.facultyProfile.findUnique({ where: { userId: id } });
    }

    res.json({ user, profile });
});
