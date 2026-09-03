/**
 * Building Routes
 * Defines API endpoints for building management
 */

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { asyncHandler } = require('../middleware/errorHandler');
const validateRequest = require('../middleware/validateRequest');
const { CreateBuildingDTO, UpdateBuildingDTO, BuildingQueryParamsDTO } = require('../dto/BuildingDTO');
const buildingController = require('../controllers/buildingController');

const idParam = Joi.object({
  id: Joi.number().integer().positive().required(),
});

router.post(
  '/',
  validateRequest({ body: CreateBuildingDTO }),
  asyncHandler(buildingController.createBuilding)
);

router.get(
  '/',
  validateRequest({ query: BuildingQueryParamsDTO }),
  asyncHandler(buildingController.listBuildings)
);

router.get(
  '/:id',
  validateRequest({ params: idParam }),
  asyncHandler(buildingController.getBuilding)
);

router.put(
  '/:id',
  validateRequest({ params: idParam, body: UpdateBuildingDTO }),
  asyncHandler(buildingController.updateBuilding)
);

router.delete(
  '/:id',
  validateRequest({ params: idParam }),
  asyncHandler(buildingController.deleteBuilding)
);

module.exports = router;
