const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

module.exports = (req, res, next) => {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return next(new ApiError(401, 'Missing or malformed Authorization header'));
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.id, email: payload.email, role: payload.role };
        next();
    } catch (err) {
        next(new ApiError(401, 'Invalid or expired token'));
    }
};
