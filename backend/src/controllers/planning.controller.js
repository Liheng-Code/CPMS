const planningService = require('../services/planning.service');

exports.createPlanningTemplate = async (req, res, next) => {
  try {
    const planningTemplateData = req.body;
    // Basic validation
    if (!planningTemplateData.designFunctionTemplate || !planningTemplateData.designPhase) {
      return res.status(400).json({ message: 'Missing required planning template fields: designFunctionTemplate, designPhase' });
    }

    const newPlanningTemplate = await planningService.createPlanningTemplate(planningTemplateData);
    res.status(201).json(newPlanningTemplate);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};

exports.getAllPlanningTemplates = async (req, res, next) => {
  try {
    const planningTemplates = await planningService.getAllPlanningTemplates();
    res.status(200).json(planningTemplates);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};

// Other planning template controller methods would go here
