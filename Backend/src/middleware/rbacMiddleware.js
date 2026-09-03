module.exports = (requiredRole) => {
    return (req, res, next) => {
        // TODO: Check if user role matches requiredRole
        next();
    };
};