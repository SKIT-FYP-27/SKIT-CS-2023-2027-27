const ApiError = require('../utils/ApiError');

// Usage: rbacMiddleware('HOD') or rbacMiddleware(['FACULTY', 'HOD'])
module.exports = (allowedRoles) => {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'Not authenticated'));
        }

        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, 'Insufficient role permissions'));
        }

        next();
    };
};
