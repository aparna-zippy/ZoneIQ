/**
 * Zone Routes
 * Defines API endpoints for zone management
 */

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { asyncHandler } = require('../middleware/errorHandler');
const validateRequest = require('../middleware/validateRequest');
const { CreateZoneDTO, UpdateZoneDTO, ZoneFilterDTO } = require('../dto/ZoneDTO');
const zoneController = require('../controllers/zoneController');

const idParam = Joi.object({
  id: Joi.number().integer().positive().required(),
});

router.post(
  '/',
  validateRequest({ body: CreateZoneDTO }),
  asyncHandler(zoneController.createZone)
);

router.get(
  '/',
  validateRequest({ query: ZoneFilterDTO }),
  asyncHandler(zoneController.listZones)
);

router.get(
  '/:id',
  validateRequest({ params: idParam }),
  asyncHandler(zoneController.getZone)
);

router.put(
  '/:id',
  validateRequest({ params: idParam, body: UpdateZoneDTO }),
  asyncHandler(zoneController.updateZone)
);

router.delete(
  '/:id',
  validateRequest({ params: idParam }),
  asyncHandler(zoneController.deleteZone)
);

module.exports = router;
