const projectService = require('../services/project.service');

exports.createProject = async (req, res, next) => {
  try {
    const projectData = req.body;
    // Basic validation (more comprehensive validation would be done in service or a dedicated validator)
    if (!projectData.projectName || !projectData.startDate || !projectData.status) {
      return res.status(400).json({ message: 'Missing required project fields: projectName, startDate, status' });
    }

    const newProject = await projectService.createProject(projectData);
    res.status(201).json(newProject);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projectData = req.body;

    const updatedProject = await projectService.updateProject(id, projectData);

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await projectService.getProjectById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};

// Other project controller methods would go here
