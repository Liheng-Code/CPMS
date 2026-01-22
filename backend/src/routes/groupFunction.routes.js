const express = require('express');
const router = express.Router();
const groupFunctionController = require('../controllers/groupFunction.controller');

router
  .route('/')
  .get(groupFunctionController.getAllGroupFunctions)
  .post(groupFunctionController.createGroupFunction);

router
  .route('/:id')
  .get(groupFunctionController.getGroupFunction)
  .patch(groupFunctionController.updateGroupFunction)
  .delete(groupFunctionController.deleteGroupFunction);

module.exports = router;
