const express = require('express');
const router = express.Router();

const hodController = require('../controllers/hodController');

router.get('/overview', hodController.getOverview);
router.get('/academics', hodController.getAcademics);
router.get('/risk', hodController.getRiskAnalytics);
router.get('/batches', hodController.getBatchComparison);
router.get('/placement', hodController.getPlacementStatistics);

// Legacy stub, kept for backward compatibility with the original API spec
router.get('/analytics', hodController.getOverview);

module.exports = router;
