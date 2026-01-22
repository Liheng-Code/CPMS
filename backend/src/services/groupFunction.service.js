const GroupFunction = require('../models/groupFunction.model');

const getAllGroupFunctions = async () => {
  return await GroupFunction.find().sort({ displayOrder: 1 });
};

const createGroupFunction = async (groupFunctionData) => {
  const groupFunction = new GroupFunction(groupFunctionData);
  return await groupFunction.save();
};

const getGroupFunctionById = async (id) => {
  return await GroupFunction.findById(id);
};

const updateGroupFunction = async (id, groupFunctionData) => {
  return await GroupFunction.findByIdAndUpdate(id, groupFunctionData, { new: true });
};

const deleteGroupFunction = async (id) => {
  return await GroupFunction.findByIdAndDelete(id);
};

module.exports = {
  getAllGroupFunctions,
  createGroupFunction,
  getGroupFunctionById,
  updateGroupFunction,
  deleteGroupFunction,
};
