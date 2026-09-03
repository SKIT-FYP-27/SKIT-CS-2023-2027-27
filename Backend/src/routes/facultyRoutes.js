const express = require('express');
const router = express.Router();

router.get('/risk-radar', (req, res) => res.json({ message: "Faculty Risk Radar Boundary" }));

module.exports = router;