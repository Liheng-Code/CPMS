const groupFunctionService = require('../services/groupFunction.service');
const catchAsync = require('../utils/catchAsync');

const getAllGroupFunctions = catchAsync(async (req, res) => {
  const groupFunctions = await groupFunctionService.getAllGroupFunctions();
  res.send(groupFunctions);
});

const createGroupFunction = catchAsync(async (req, res) => {
  const groupFunction = await groupFunctionService.createGroupFunction(req.body);
  res.status(201).send(groupFunction);
});

const getGroupFunction = catchAsync(async (req, res) => {
  const groupFunction = await groupFunctionService.getGroupFunctionById(req.params.id);
  if (!groupFunction) {
    return res.status(404).send();
  }
  res.send(groupFunction);
});

const updateGroupFunction = catchAsync(async (req, res) => {
  const groupFunction = await groupFunctionService.updateGroupFunction(req.params.id, req.body);
  if (!groupFunction) {
    return res.status(404).send();
  }
  res.send(groupFunction);
});

const deleteGroupFunction = catchAsync(async (req, res) => {
  const groupFunction = await groupFunctionService.deleteGroupFunction(req.params.id);
  if (!groupFunction) {
    return res.status(404).send();
  }
  res.status(204).send();
});

module.exports = {
  getAllGroupFunctions,
  createGroupFunction,
  getGroupFunction,
  updateGroupFunction,
  deleteGroupFunction,
};
