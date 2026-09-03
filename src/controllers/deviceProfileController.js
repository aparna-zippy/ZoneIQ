/**
 * Device Profile Controller
 * Handles HTTP requests for device profile management
 */

const db = require('../config/database');
const { DeviceProfileRepository } = require('../repositories');
const { NotFoundError } = require('../middleware/errorHandler');

const profileRepo = new DeviceProfileRepository(db);

/**
 * Get all device profiles
 * GET /api/device-profiles
 */
async function listDeviceProfiles(req, res) {
  const { limit, offset } = req.pagination;
  
  const profiles = await profileRepo.findAll(limit, offset);
  const total = await profileRepo.count();
  
  res.paginate(profiles, total);
}

/**
 * Get device profile by name (latest version)
 * GET /api/device-profiles/:profileName
 */
async function getDeviceProfile(req, res) {
  const profile = await profileRepo.findByName(req.params.profileName);
  
  if (!profile) {
    throw new NotFoundError('Device Profile', req.params.profileName);
  }
  
  res.json(profile);
}

/**
 * Get required points for a profile
 * GET /api/device-profiles/:profileName/required-points
 */
async function getRequiredPoints(req, res) {
  const requiredPoints = await profileRepo.getRequiredPoints(req.params.profileName);
  
  if (!requiredPoints) {
    throw new NotFoundError('Device Profile', req.params.profileName);
  }
  
  res.json({
    profile_name: req.params.profileName,
    required_points: requiredPoints,
  });
}

/**
 * Validate device against its profile
 * GET /api/devices/:deviceId/profile-validation
 */
async function validateDeviceProfile(req, res) {
  const { deviceId } = req.params;
  
  const validation = await profileRepo.validateDevicePoints(deviceId);
  
  if (!validation) {
    throw new NotFoundError('Device', deviceId);
  }
  
  res.json(validation);
}

module.exports = {
  listDeviceProfiles,
  getDeviceProfile,
  getRequiredPoints,
  validateDeviceProfile,
};
