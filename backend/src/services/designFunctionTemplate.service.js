const DesignFunctionTemplate = require('../models/designFunctionTemplate.model');
const GroupFunction = require('../models/groupFunction.model');

exports.createDesignFunctionTemplate = async (templateData) => {
  try {
    const newTemplate = new DesignFunctionTemplate(templateData);
    await newTemplate.save();
    return await newTemplate.populate('groupFunction');
  } catch (error) {
    console.error('Error in design function template service (createDesignFunctionTemplate):', error);
    throw new Error('Could not create design function template');
  }
};

exports.getAllDesignFunctionTemplates = async () => {
  try {
    const templates = await DesignFunctionTemplate.find({}).populate('groupFunction');
    return templates;
  } catch (error) {
    console.error('Error in design function template service (getAllDesignFunctionTemplates):', error);
    throw new Error('Could not retrieve design function templates');
  }
};

exports.getDesignFunctionTemplateById = async (id) => {
  try {
    const template = await DesignFunctionTemplate.findById(id).populate('groupFunction');
    return template;
  } catch (error) {
    console.error('Error in design function template service (getDesignFunctionTemplateById):', error);
    throw new Error('Could not retrieve design function template');
  }
};

exports.updateDesignFunctionTemplate = async (id, updateData) => {
  try {
    const updatedTemplate = await DesignFunctionTemplate.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('groupFunction');
    return updatedTemplate;
  } catch (error) {
    console.error('Error in design function template service (updateDesignFunctionTemplate):', error);
    throw new Error('Could not update design function template');
  }
};

exports.deleteDesignFunctionTemplate = async (id) => {
  try {
    const deletedTemplate = await DesignFunctionTemplate.findByIdAndDelete(id);
    return deletedTemplate;
  } catch (error) {
    console.error('Error in design function template service (deleteDesignFunctionTemplate):', error);
    throw new Error('Could not delete design function template');
  }
};