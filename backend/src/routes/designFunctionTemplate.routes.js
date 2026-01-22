const express = require('express');
const designFunctionTemplateController = require('../controllers/designFunctionTemplate.controller');

const router = express.Router();

router
  .route('/')
  .get(designFunctionTemplateController.getAllDesignFunctionTemplates)
  .post(designFunctionTemplateController.createDesignFunctionTemplate);

router
  .route('/:id')
  .get(designFunctionTemplateController.getDesignFunctionTemplate)
  .patch(designFunctionTemplateController.updateDesignFunctionTemplate)
  .delete(designFunctionTemplateController.deleteDesignFunctionTemplate);

module.exports = router;