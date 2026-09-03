/**
 * Device Profile Routes
 * Defines API endpoints for device profile management
 */

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { asyncHandler } = require('../middleware/errorHandler');
const validateRequest = require('../middleware/validateRequest');
const deviceProfileController = require('../controllers/deviceProfileController');

const profileNameParam = Joi.object({
  profileName: Joi.string().required(),
});

const deviceIdParam = Joi.object({
  deviceId: Joi.number().integer().positive().required(),
});

router.get(
  '/',
  asyncHandler(deviceProfileController.listDeviceProfiles)
);

router.get(
  '/:profileName',
  validateRequest({ params: profileNameParam }),
  asyncHandler(deviceProfileController.getDeviceProfile)
);

router.get(
  '/:profileName/required-points',
  validateRequest({ params: profileNameParam }),
  asyncHandler(deviceProfileController.getRequiredPoints)
);

// Device profile validation
router.get(
  '/devices/:deviceId/profile-validation',
  validateRequest({ params: deviceIdParam }),
  asyncHandler(deviceProfileController.validateDeviceProfile)
);

module.exports = router;
