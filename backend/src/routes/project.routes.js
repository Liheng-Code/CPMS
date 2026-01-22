const express = require('express');
const projectController = require('../controllers/project.controller');

const router = express.Router();

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProjectById)
  .put(projectController.updateProject);

// Other project routes would go here (e.g., DELETE)

module.exports = router;
