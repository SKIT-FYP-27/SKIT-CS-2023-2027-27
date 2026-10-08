const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
};
