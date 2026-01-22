const express = require('express');
const disciplineController = require('../controllers/discipline.controller');

const router = express.Router();

router
  .route('/')
  .get(disciplineController.getAllDisciplines)
  .post(disciplineController.createDiscipline);

router
  .route('/:id')
  .get(disciplineController.getDiscipline)
  .patch(disciplineController.updateDiscipline)
  .delete(disciplineController.deleteDiscipline);

module.exports = router;
