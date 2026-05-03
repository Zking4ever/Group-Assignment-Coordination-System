const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // 50 attempts per 15 minutes
  message: { error: "Too many authentication attempts, please try again after 15 minutes." }
});

// App Config
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/auth', authLimiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('GACS server is running');
});

// Route Middlewares
app.use('/auth', authRoutes);
app.use('/gacs/user', userRoutes);
app.use('/group', groupRoutes);
app.use('/assignment', assignmentRoutes);
app.use('/task', taskRoutes);
app.use('/notifications', notificationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
