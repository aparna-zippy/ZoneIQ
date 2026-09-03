/**
 * Point Routes
 * Defines API endpoints for point catalogue management
 */

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { asyncHandler } = require('../middleware/errorHandler');
const validateRequest = require('../middleware/validateRequest');
const { CreatePointDTO, BulkCreatePointsDTO, UpdatePointDTO, PointQueryParamsDTO } = require('../dto/PointDTO');
const pointController = require('../controllers/pointController');

const idParam = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const deviceIdParam = Joi.object({
  deviceId: Joi.number().integer().positive().required(),
});

const reactivateSchema = Joi.object({
  updated_by: Joi.string().max(255).required(),
});

const deletePointSchema = Joi.object({
  updated_by: Joi.string().max(255).required(),
});

// Point catalogue endpoint (global)
router.get(
  '/catalogue',
  asyncHandler(pointController.getPointCatalogue)
);

// Device-specific point routes
router.post(
  '/devices/:deviceId/points',
  validateRequest({ params: deviceIdParam, body: CreatePointDTO }),
  asyncHandler(pointController.createPoint)
);

router.post(
  '/devices/:deviceId/points/bulk',
  validateRequest({ params: deviceIdParam, body: BulkCreatePointsDTO }),
  asyncHandler(pointController.bulkCreatePoints)
);

router.get(
  '/devices/:deviceId/points',
  validateRequest({ params: deviceIdParam, query: PointQueryParamsDTO }),
  asyncHandler(pointController.listDevicePoints)
);

router.get(
  '/devices/:deviceId/points/validate',
  validateRequest({ params: deviceIdParam }),
  asyncHandler(pointController.validateDevicePoints)
);

// Individual point operations
router.get(
  '/:id',
  validateRequest({ params: idParam }),
  asyncHandler(pointController.getPoint)
);

router.put(
  '/:id',
  validateRequest({ params: idParam, body: UpdatePointDTO }),
  asyncHandler(pointController.updatePoint)
);

router.delete(
  '/:id',
  validateRequest({ params: idParam, body: deletePointSchema }),
  asyncHandler(pointController.deletePoint)
);

router.post(
  '/:id/reactivate',
  validateRequest({ params: idParam, body: reactivateSchema }),
  asyncHandler(pointController.reactivatePoint)
);

module.exports = router;
