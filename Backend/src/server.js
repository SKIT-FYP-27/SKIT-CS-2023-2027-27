require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON payloads

// Import Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const hodRoutes = require('./routes/hodRoutes');

// API Route Boundaries
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/hod', hodRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.json({ message: "UEI Platform Core API Running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server initialized on port ${PORT}`);
});
