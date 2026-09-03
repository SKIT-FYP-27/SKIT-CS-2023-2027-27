const express = require('express');
const router = express.Router();

router.get('/analytics', (req, res) => res.json({ message: "HOD Analytics Boundary" }));

module.exports = router;