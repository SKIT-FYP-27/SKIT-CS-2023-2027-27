const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const studentController = require('../controllers/studentController');
const ensureOwnStudent = require('../middleware/ownershipMiddleware');
const ApiError = require('../utils/ApiError');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, errors.array()[0].msg));
    }
    next();
};

router.get('/:id', ensureOwnStudent, studentController.getProfile);

router.put(
    '/:id',
    ensureOwnStudent,
    [
        body('phone').optional().isString(),
        body('githubUrl').optional().isURL().withMessage('githubUrl must be a valid URL'),
        body('leetcodeUrl').optional().isURL().withMessage('leetcodeUrl must be a valid URL'),
        body('linkedinUrl').optional().isURL().withMessage('linkedinUrl must be a valid URL'),
        body('resumeUrl').optional().isURL().withMessage('resumeUrl must be a valid URL'),
        body('avatarUrl').optional().isURL().withMessage('avatarUrl must be a valid URL'),
    ],
    validate,
    studentController.updateProfile
);

router.get('/:id/academics', ensureOwnStudent, studentController.getAcademics);
router.get('/:id/skills', ensureOwnStudent, studentController.getSkills);
router.get('/:id/placement', ensureOwnStudent, studentController.getPlacement);

module.exports = router;
