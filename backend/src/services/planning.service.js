const PlanningTemplate = require('../models/planningTemplate.model');

exports.createPlanningTemplate = async (planningTemplateData) => {
  try {
    const newPlanningTemplate = new PlanningTemplate(planningTemplateData);
    await newPlanningTemplate.save();
    return newPlanningTemplate;
  } catch (error) {
    console.error('Error in planning service (createPlanningTemplate):', error);
    throw new Error('Could not create planning template');
  }
};

exports.getAllPlanningTemplates = async () => {
  try {
    const planningTemplates = await PlanningTemplate.find({});
    return planningTemplates;
  } catch (error) {
    console.error('Error in planning service (getAllPlanningTemplates):', error);
    throw new Error('Could not retrieve planning templates');
  }
};

// Other planning template service methods (e.g., getById, update, delete) would go here
