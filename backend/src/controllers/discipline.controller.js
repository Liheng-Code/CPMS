const disciplineService = require('../services/discipline.service');
const catchAsync = require('../utils/catchAsync');

exports.createDiscipline = catchAsync(async (req, res, next) => {
  const disciplineData = req.body;
  if (!disciplineData.name) {
    return res.status(400).json({ message: 'Missing required discipline field: name' });
  }

  const newDiscipline = await disciplineService.createDiscipline(disciplineData);
  res.status(201).json(newDiscipline);
});

exports.getAllDisciplines = catchAsync(async (req, res, next) => {
  const disciplines = await disciplineService.getAllDisciplines();
  res.status(200).json(disciplines);
});

exports.getDiscipline = catchAsync(async (req, res, next) => {
  const discipline = await disciplineService.getDisciplineById(req.params.id);
  if (!discipline) {
    return res.status(404).json({ message: 'Discipline not found' });
  }
  res.status(200).json(discipline);
});

exports.updateDiscipline = catchAsync(async (req, res, next) => {
  const updatedDiscipline = await disciplineService.updateDiscipline(req.params.id, req.body);
  if (!updatedDiscipline) {
    return res.status(404).json({ message: 'Discipline not found' });
  }
  res.status(200).json(updatedDiscipline);
});

exports.deleteDiscipline = catchAsync(async (req, res, next) => {
  const deletedDiscipline = await disciplineService.deleteDiscipline(req.params.id);
  if (!deletedDiscipline) {
    return res.status(404).json({ message: 'Discipline not found' });
  }
  res.status(204).send(); // No content for successful deletion
});
