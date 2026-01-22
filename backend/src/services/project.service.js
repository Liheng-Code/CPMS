const Project = require('../models/project.model');

exports.createProject = async (projectData) => {
  try {
    const newProject = new Project(projectData);
    await newProject.save();
    return newProject;
  } catch (error) {
    console.error('Error in project service (createProject):', error);
    throw new Error('Could not create project');
  }
};

exports.getAllProjects = async () => {
  try {
    const projects = await Project.find({});
    return projects;
  } catch (error) {
    console.error('Error in project service (getAllProjects):', error);
    throw new Error('Could not retrieve projects');
  }
};

exports.updateProject = async (id, projectData) => {
  try {
    // FindByIdAndUpdate options:
    // new: true returns the updated document
    // runValidators: true runs schema validators on the update
    const updatedProject = await Project.findByIdAndUpdate(id, projectData, { new: true, runValidators: true });
    return updatedProject;
  } catch (error) {
    console.error('Error in project service (updateProject):', error);
    throw new Error('Could not update project');
  }
};

exports.getProjectById = async (id) => {
  try {
    const project = await Project.findById(id);
    return project;
  } catch (error) {
    console.error('Error in project service (getProjectById):', error);
    throw new Error('Could not retrieve project');
  }
};

// Other project service methods would go here
