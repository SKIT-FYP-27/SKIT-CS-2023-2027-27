const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Loads the student_profiles row named by :id and rejects unless it belongs
// to the logged-in user. Attaches the row to req.studentProfile.
module.exports = asyncHandler(async (req, res, next) => {
    const profile = await prisma.studentProfile.findUnique({ where: { id: req.params.id } });

    if (!profile) return next(new ApiError(404, 'Student not found'));
    if (profile.userId !== req.user.id) return next(new ApiError(403, 'You can only access your own student record'));

    req.studentProfile = profile;
    next();
});
