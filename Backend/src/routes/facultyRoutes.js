const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const facultyController = require('../controllers/facultyController');
const ApiError = require('../utils/ApiError');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, errors.array()[0].msg));
    }
    next();
};

router.get('/courses', facultyController.getMyCourses);
router.get('/courses/:id/gradebook', facultyController.getGradebook);
router.put('/courses/:id/gradebook', [body('enrollments').isArray({ min: 1 })], validate, facultyController.updateGradebook);
router.get('/courses/:id/attendance', facultyController.getAttendance);
router.post(
    '/courses/:id/attendance',
    [body('attendanceDate').isISO8601(), body('records').isArray({ min: 1 })],
    validate,
    facultyController.markAttendance
);

router.get('/at-risk', facultyController.getAtRiskStudents);
router.post(
    '/at-risk/:id/intervene',
    [body('facultyInterventionNotes').isString().notEmpty()],
    validate,
    facultyController.intervene
);

router.get('/students/:id', facultyController.getStudentProfile);

// Legacy stub, kept for backward compatibility with the original API spec
router.get('/risk-radar', facultyController.getAtRiskStudents);

module.exports = router;
