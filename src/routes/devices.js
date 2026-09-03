/**
 * Device Routes
 * Defines API endpoints for device management
 */

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { asyncHandler } = require('../middleware/errorHandler');
const validateRequest = require('../middleware/validateRequest');
const { CreateDeviceDTO, UpdateDeviceDTO, DeviceFilterDTO } = require('../dto/DeviceDTO');
const deviceController = require('../controllers/deviceController');

const idParam = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const healthUpdateSchema = Joi.object({
  health_status: Joi.string().valid('healthy', 'degraded', 'offline', 'unknown').required(),
});

router.post(
  '/',
  validateRequest({ body: CreateDeviceDTO }),
  asyncHandler(deviceController.createDevice)
);

router.get(
  '/',
  validateRequest({ query: DeviceFilterDTO }),
  asyncHandler(deviceController.listDevices)
);

router.get(
  '/:id',
  validateRequest({ params: idParam }),
  asyncHandler(deviceController.getDevice)
);

router.put(
  '/:id',
  validateRequest({ params: idParam, body: UpdateDeviceDTO }),
  asyncHandler(deviceController.updateDevice)
);

router.patch(
  '/:id/health',
  validateRequest({ params: idParam, body: healthUpdateSchema }),
  asyncHandler(deviceController.updateDeviceHealth)
);

router.delete(
  '/:id',
  validateRequest({ params: idParam }),
  asyncHandler(deviceController.deleteDevice)
);

module.exports = router;
