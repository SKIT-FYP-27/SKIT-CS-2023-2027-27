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

const authMiddleware = require('./middleware/authMiddleware');
const rbacMiddleware = require('./middleware/rbacMiddleware');
const errorHandler = require('./middleware/errorHandler');

// API Route Boundaries
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', authMiddleware, rbacMiddleware('STUDENT'), studentRoutes);
app.use('/api/v1/faculty', authMiddleware, rbacMiddleware(['FACULTY', 'HOD']), facultyRoutes);
app.use('/api/v1/hod', authMiddleware, rbacMiddleware('HOD'), hodRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.json({ message: "UEI Platform Core API Running" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Centralized error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server initialized on port ${PORT}`);
});
