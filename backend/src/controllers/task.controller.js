const taskService = require('../services/task.service');
const catchAsync = require('../utils/catchAsync');

exports.createTask = catchAsync(async (req, res, next) => {
  const taskData = req.body;
  if (!taskData.taskName) {
    return res.status(400).json({ message: 'Missing required task field: taskName' });
  }

  const newTask = await taskService.createTask(taskData);
  res.status(201).json(newTask);
});

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await taskService.getAllTasks();
  res.status(200).json(tasks);
});

exports.getTask = catchAsync(async (req, res, next) => {
  const task = await taskService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.status(200).json(task);
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const updatedTask = await taskService.updateTask(req.params.id, req.body);
  if (!updatedTask) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.status(200).json(updatedTask);
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const deletedTask = await taskService.deleteTask(req.params.id);
  if (!deletedTask) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.status(204).send(); // No content for successful deletion
});
