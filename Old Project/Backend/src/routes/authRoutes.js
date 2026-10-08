const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const ApiError = require('../utils/ApiError');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, errors.array()[0].msg));
    }
    next();
};

router.post(
    '/login',
    [body('email').isEmail().withMessage('Valid email is required'), body('password').notEmpty().withMessage('Password is required')],
    validate,
    authController.login
);

router.get('/me', authMiddleware, authController.me);

module.exports = router;
