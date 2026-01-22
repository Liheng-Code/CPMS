const designFunctionTemplateService = require('../services/designFunctionTemplate.service');
const catchAsync = require('../utils/catchAsync');

exports.createDesignFunctionTemplate = catchAsync(async (req, res, next) => {
  const templateData = req.body;
  if (!templateData.name || !templateData.groupFunction) {
    return res.status(400).json({ message: 'Missing required fields: name and groupFunction are required' });
  }

  const newTemplate = await designFunctionTemplateService.createDesignFunctionTemplate(templateData);
  res.status(201).json(newTemplate);
});

exports.getAllDesignFunctionTemplates = catchAsync(async (req, res, next) => {
  const templates = await designFunctionTemplateService.getAllDesignFunctionTemplates();
  res.status(200).json(templates);
});

exports.getDesignFunctionTemplate = catchAsync(async (req, res, next) => {
  const template = await designFunctionTemplateService.getDesignFunctionTemplateById(req.params.id);
  if (!template) {
    return res.status(404).json({ message: 'Design function template not found' });
  }
  res.status(200).json(template);
});

exports.updateDesignFunctionTemplate = catchAsync(async (req, res, next) => {
  const updatedTemplate = await designFunctionTemplateService.updateDesignFunctionTemplate(req.params.id, req.body);
  if (!updatedTemplate) {
    return res.status(404).json({ message: 'Design function template not found' });
  }
  res.status(200).json(updatedTemplate);
});

exports.deleteDesignFunctionTemplate = catchAsync(async (req, res, next) => {
  const deletedTemplate = await designFunctionTemplateService.deleteDesignFunctionTemplate(req.params.id);
  if (!deletedTemplate) {
    return res.status(404).json({ message: 'Design function template not found' });
  }
  res.status(204).send();
});