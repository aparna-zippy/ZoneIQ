/**
 * Floor Routes
 * Defines API endpoints for floor management
 */

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { asyncHandler } = require('../middleware/errorHandler');
const validateRequest = require('../middleware/validateRequest');
const { CreateFloorDTO, UpdateFloorDTO, FloorQueryParamsDTO } = require('../dto/FloorDTO');
const floorController = require('../controllers/floorController');

const idParam = Joi.object({
  id: Joi.number().integer().positive().required(),
});

router.post(
  '/',
  validateRequest({ body: CreateFloorDTO }),
  asyncHandler(floorController.createFloor)
);

router.get(
  '/',
  validateRequest({ query: FloorQueryParamsDTO }),
  asyncHandler(floorController.listFloors)
);

router.get(
  '/:id',
  validateRequest({ params: idParam }),
  asyncHandler(floorController.getFloor)
);

router.put(
  '/:id',
  validateRequest({ params: idParam, body: UpdateFloorDTO }),
  asyncHandler(floorController.updateFloor)
);

router.delete(
  '/:id',
  validateRequest({ params: idParam }),
  asyncHandler(floorController.deleteFloor)
);

module.exports = router;
