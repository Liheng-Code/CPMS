const express = require('express');
const planningController = require('../controllers/planning.controller');

const router = express.Router();

router
  .route('/')
  .get(planningController.getAllPlanningTemplates)
  .post(planningController.createPlanningTemplate);

// Other planning template routes would go here

module.exports = router;
