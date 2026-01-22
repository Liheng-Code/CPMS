const Task = require('../models/task.model');

exports.createTask = async (taskData) => {
  try {
    const newTask = new Task(taskData);
    await newTask.save();
    return newTask;
  } catch (error) {
    console.error('Error in task service (createTask):', error);
    throw new Error('Could not create task');
  }
};

exports.getAllTasks = async () => {
  try {
    const tasks = await Task.find({});
    return tasks;
  } catch (error) {
    console.error('Error in task service (getAllTasks):', error);
    throw new Error('Could not retrieve tasks');
  }
};

exports.getTaskById = async (id) => {
  try {
    const task = await Task.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  } catch (error) {
    console.error('Error in task service (getTaskById):', error);
    throw new Error('Could not retrieve task');
  }
};

exports.updateTask = async (id, taskData) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, taskData, { 
      new: true, 
      runValidators: true 
    });
    if (!updatedTask) {
      throw new Error('Task not found');
    }
    return updatedTask;
  } catch (error) {
    console.error('Error in task service (updateTask):', error);
    throw new Error('Could not update task');
  }
};

exports.deleteTask = async (id) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      throw new Error('Task not found');
    }
    return deletedTask;
  } catch (error) {
    console.error('Error in task service (deleteTask):', error);
    throw new Error('Could not delete task');
  }
};
