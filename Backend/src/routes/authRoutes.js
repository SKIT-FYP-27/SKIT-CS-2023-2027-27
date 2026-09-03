const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => res.json({ message: "Auth Login Boundary" }));

module.exports = router;