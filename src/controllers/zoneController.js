/**
 * Zone Controller
 * Handles HTTP requests for zone management
 */

const db = require('../config/database');
const { ZoneRepository } = require('../repositories');
const { NotFoundError, IntegrityError } = require('../middleware/errorHandler');

const zoneRepo = new ZoneRepository(db);

/**
 * Create a new zone
 * POST /api/zones
 */
async function createZone(req, res) {
  const zone = await zoneRepo.create(req.body);
  res.status(201).json(zone);
}

/**
 * Get all zones with advanced filtering
 * GET /api/zones?portfolio_id=1&building_id=1&floor_id=1&min_area_sqm=20&max_area_sqm=100
 */
async function listZones(req, res) {
  const { limit, offset, page } = req.pagination;
  const { portfolio_id, building_id, floor_id, min_area_sqm, max_area_sqm } = req.query;
  
  const filters = {};
  if (portfolio_id) filters.portfolio_id = portfolio_id;
  if (building_id) filters.building_id = building_id;
  if (floor_id) filters.floor_id = floor_id;
  if (min_area_sqm) filters.min_area_sqm = min_area_sqm;
  if (max_area_sqm) filters.max_area_sqm = max_area_sqm;
  
  const zones = await zoneRepo.filterZones(filters, limit, offset);
  const total = await zoneRepo.countFiltered(filters);
  
  res.paginate(zones, total);
}

/**
 * Get zone by ID with stats
 * GET /api/zones/:id
 */
async function getZone(req, res) {
  const zone = await zoneRepo.getZoneWithStats(req.params.id);
  
  if (!zone) {
    throw new NotFoundError('Zone', req.params.id);
  }
  
  res.json(zone);
}

/**
 * Update zone
 * PUT /api/zones/:id
 */
async function updateZone(req, res) {
  const exists = await zoneRepo.exists(req.params.id);
  if (!exists) {
    throw new NotFoundError('Zone', req.params.id);
  }
  
  const zone = await zoneRepo.update(req.params.id, req.body);
  res.json(zone);
}

/**
 * Delete zone
 * DELETE /api/zones/:id
 */
async function deleteZone(req, res) {
  const exists = await zoneRepo.exists(req.params.id);
  if (!exists) {
    throw new NotFoundError('Zone', req.params.id);
  }
  
  // Check referential integrity
  const deviceCount = await zoneRepo.countDevices(req.params.id);
  if (deviceCount > 0) {
    throw new IntegrityError(
      `Cannot delete zone. Zone has ${deviceCount} device(s). Remove all devices before deleting the zone.`,
      { devices_count: deviceCount }
    );
  }
  
  await zoneRepo.delete(req.params.id);
  res.status(204).send();
}

module.exports = {
  createZone,
  listZones,
  getZone,
  updateZone,
  deleteZone,
};
