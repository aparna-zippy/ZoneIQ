/**
 * Point Controller
 * Handles HTTP requests for point catalogue management
 */

const db = require('../config/database');
const { PointRepository } = require('../repositories');
const { NotFoundError } = require('../middleware/errorHandler');

const pointRepo = new PointRepository(db);

/**
 * Create a new point for a device
 * POST /api/devices/:deviceId/points
 */
async function createPoint(req, res) {
  const pointData = {
    ...req.body,
    device_id: req.params.deviceId,
  };
  
  const point = await pointRepo.create(pointData);
  res.status(201).json(point);
}

/**
 * Bulk create points for a device
 * POST /api/devices/:deviceId/points/bulk
 */
async function bulkCreatePoints(req, res) {
  const { points, created_by } = req.body;
  const deviceId = req.params.deviceId;
  
  const createdPoints = await pointRepo.bulkCreate(deviceId, points, created_by);
  
  res.status(201).json({
    message: `Successfully created ${createdPoints.length} point(s)`,
    points: createdPoints,
  });
}

/**
 * Get all points for a device
 * GET /api/devices/:deviceId/points?active_only=true
 */
async function listDevicePoints(req, res) {
  const { deviceId } = req.params;
  const { active_only } = req.query;
  
  const activeOnly = active_only === 'true' || active_only === true;
  const points = await pointRepo.findByDevice(deviceId, activeOnly);
  
  res.json({ data: points });
}

/**
 * Get point catalogue (all points with usage statistics)
 * GET /api/points/catalogue
 */
async function getPointCatalogue(req, res) {
  const catalogue = await pointRepo.getPointCatalogue();
  res.json({ data: catalogue });
}

/**
 * Get point by ID
 * GET /api/points/:id
 */
async function getPoint(req, res) {
  const point = await pointRepo.findById(req.params.id);
  
  if (!point) {
    throw new NotFoundError('Point', req.params.id);
  }
  
  res.json(point);
}

/**
 * Update point
 * PUT /api/points/:id
 */
async function updatePoint(req, res) {
  const exists = await pointRepo.exists(req.params.id);
  if (!exists) {
    throw new NotFoundError('Point', req.params.id);
  }
  
  const point = await pointRepo.update(req.params.id, req.body);
  res.json(point);
}

/**
 * Soft delete (deactivate) point
 * DELETE /api/points/:id
 */
async function deletePoint(req, res) {
  const exists = await pointRepo.exists(req.params.id);
  if (!exists) {
    throw new NotFoundError('Point', req.params.id);
  }
  
  const { updated_by } = req.body;
  await pointRepo.softDelete(req.params.id, updated_by);
  
  res.status(204).send();
}

/**
 * Reactivate a soft-deleted point
 * POST /api/points/:id/reactivate
 */
async function reactivatePoint(req, res) {
  const exists = await pointRepo.exists(req.params.id);
  if (!exists) {
    throw new NotFoundError('Point', req.params.id);
  }
  
  const { updated_by } = req.body;
  const point = await pointRepo.reactivate(req.params.id, updated_by);
  
  res.json(point);
}

/**
 * Validate device points against profile
 * GET /api/devices/:deviceId/points/validate
 */
async function validateDevicePoints(req, res) {
  const { deviceId } = req.params;
  
  // Get required points from device profile
  const deviceResult = await db.query(
    'SELECT device_profile FROM devices WHERE id = $1',
    [deviceId]
  );
  
  if (deviceResult.rows.length === 0) {
    throw new NotFoundError('Device', deviceId);
  }
  
  const profileName = deviceResult.rows[0].device_profile;
  
  const profileResult = await db.query(
    'SELECT required_points FROM device_profiles WHERE profile_name = $1 ORDER BY id DESC LIMIT 1',
    [profileName]
  );
  
  if (profileResult.rows.length === 0) {
    return res.json({
      is_valid: false,
      message: `Device profile '${profileName}' not found`,
    });
  }
  
  const requiredPoints = profileResult.rows[0].required_points;
  const validation = await pointRepo.validateAgainstProfile(deviceId, requiredPoints);
  
  res.json(validation);
}

module.exports = {
  createPoint,
  bulkCreatePoints,
  listDevicePoints,
  getPointCatalogue,
  getPoint,
  updatePoint,
  deletePoint,
  reactivatePoint,
  validateDevicePoints,
};
