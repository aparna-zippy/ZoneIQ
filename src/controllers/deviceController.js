/**
 * Device Controller
 * Handles HTTP requests for device management
 */

const db = require('../config/database');
const { DeviceRepository } = require('../repositories');
const { NotFoundError, IntegrityError } = require('../middleware/errorHandler');

const deviceRepo = new DeviceRepository(db);

/**
 * Create a new device
 * POST /api/devices
 */
async function createDevice(req, res) {
  const device = await deviceRepo.create(req.body);
  res.status(201).json(device);
}

/**
 * Get all devices with advanced filtering
 * GET /api/devices?zone_id=1&protocol=modbus-tcp&commissioning_state=commissioned
 */
async function listDevices(req, res) {
  const { limit, offset, page } = req.pagination;
  const { portfolio_id, building_id, zone_id, protocol, commissioning_state, health_status, device_profile, serial_number } = req.query;
  
  const filters = {};
  if (portfolio_id) filters.portfolio_id = portfolio_id;
  if (building_id) filters.building_id = building_id;
  if (zone_id) filters.zone_id = zone_id;
  if (protocol) filters.protocol = protocol;
  if (commissioning_state) filters.commissioning_state = commissioning_state;
  if (health_status) filters.health_status = health_status;
  if (device_profile) filters.device_profile = device_profile;
  if (serial_number) filters.serial_number = serial_number;
  
  const devices = await deviceRepo.filterDevices(filters, limit, offset);
  const total = await deviceRepo.countFiltered(filters);
  
  res.paginate(devices, total);
}

/**
 * Get device by ID
 * GET /api/devices/:id
 */
async function getDevice(req, res) {
  const device = await deviceRepo.findById(req.params.id);
  
  if (!device) {
    throw new NotFoundError('Device', req.params.id);
  }
  
  res.json(device);
}

/**
 * Update device
 * PUT /api/devices/:id
 */
async function updateDevice(req, res) {
  const exists = await deviceRepo.exists(req.params.id);
  if (!exists) {
    throw new NotFoundError('Device', req.params.id);
  }
  
  const device = await deviceRepo.update(req.params.id, req.body);
  res.json(device);
}

/**
 * Delete device
 * DELETE /api/devices/:id
 */
async function deleteDevice(req, res) {
  const exists = await deviceRepo.exists(req.params.id);
  if (!exists) {
    throw new NotFoundError('Device', req.params.id);
  }
  
  // Check referential integrity
  const pointCount = await deviceRepo.countPoints(req.params.id);
  if (pointCount > 0) {
    throw new IntegrityError(
      `Cannot delete device. Device has ${pointCount} point(s). Remove all points before deleting the device.`,
      { points_count: pointCount }
    );
  }
  
  await deviceRepo.delete(req.params.id);
  res.status(204).send();
}

/**
 * Update device health status
 * PATCH /api/devices/:id/health
 */
async function updateDeviceHealth(req, res) {
  const exists = await deviceRepo.exists(req.params.id);
  if (!exists) {
    throw new NotFoundError('Device', req.params.id);
  }
  
  await deviceRepo.updateHealthStatus(req.params.id, req.body.health_status);
  await deviceRepo.updateLastSeen(req.params.id, new Date());
  
  const device = await deviceRepo.findById(req.params.id);
  res.json(device);
}

module.exports = {
  createDevice,
  listDevices,
  getDevice,
  updateDevice,
  deleteDevice,
  updateDeviceHealth,
};
