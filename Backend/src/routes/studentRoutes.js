const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => res.json({ message: "Student Profile Boundary" }));
router.get('/academics', (req, res) => res.json({ message: "Student Academics Boundary" }));

module.exports = router;