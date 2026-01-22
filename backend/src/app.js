const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const projectRoutes = require('./routes/project.routes'); // Corrected import path
const planningRoutes = require('./routes/planning.routes'); // Import planning routes
const taskRoutes = require('./routes/task.routes'); // Import task routes
const disciplineRoutes = require('./routes/discipline.routes'); // Import discipline routes
const groupFunctionRoutes = require('./routes/groupFunction.routes'); // Import groupFunction routes
const designFunctionTemplateRoutes = require('./routes/designFunctionTemplate.routes'); // Import design function template routes
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-name.vercel.app'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Use project routes
app.use('/api/projects', projectRoutes);

// Use planning routes
app.use('/api/planning-templates', planningRoutes);

// Use task routes
app.use('/api/tasks', taskRoutes);

// Use discipline routes
app.use('/api/disciplines', disciplineRoutes);

// Use group function routes
app.use('/api/group-functions', groupFunctionRoutes);

// Use design function template routes
app.use('/api/design-function-templates', designFunctionTemplateRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;