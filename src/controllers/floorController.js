/**
 * Floor Controller
 * Handles HTTP requests for floor management
 */

const db = require('../config/database');
const { FloorRepository } = require('../repositories');
const { NotFoundError, IntegrityError } = require('../middleware/errorHandler');

const floorRepo = new FloorRepository(db);

/**
 * Create a new floor
 * POST /api/floors
 */
async function createFloor(req, res) {
  const floor = await floorRepo.create(req.body);
  res.status(201).json(floor);
}

/**
 * Get all floors (optionally filtered by building)
 * GET /api/floors?building_id=1
 */
async function listFloors(req, res) {
  const { limit, offset, page } = req.pagination;
  const { building_id } = req.query;
  
  let floors, total;
  
  if (building_id) {
    floors = await floorRepo.findByBuilding(building_id, limit, offset);
    // Count floors in building
    const result = await db.query(
      'SELECT COUNT(*)::int as count FROM floors WHERE building_id = $1',
      [building_id]
    );
    total = result.rows[0].count;
  } else {
    floors = await floorRepo.findAll(limit, offset);
    total = await floorRepo.count();
  }
  
  res.paginate(floors, total);
}

/**
 * Get floor by ID with stats
 * GET /api/floors/:id
 */
async function getFloor(req, res) {
  const floor = await floorRepo.getFloorWithStats(req.params.id);
  
  if (!floor) {
    throw new NotFoundError('Floor', req.params.id);
  }
  
  res.json(floor);
}

/**
 * Update floor
 * PUT /api/floors/:id
 */
async function updateFloor(req, res) {
  const exists = await floorRepo.exists(req.params.id);
  if (!exists) {
    throw new NotFoundError('Floor', req.params.id);
  }
  
  const floor = await floorRepo.update(req.params.id, req.body);
  res.json(floor);
}

/**
 * Delete floor
 * DELETE /api/floors/:id
 */
async function deleteFloor(req, res) {
  const exists = await floorRepo.exists(req.params.id);
  if (!exists) {
    throw new NotFoundError('Floor', req.params.id);
  }
  
  // Check referential integrity
  const zoneCount = await floorRepo.countZones(req.params.id);
  if (zoneCount > 0) {
    throw new IntegrityError(
      `Cannot delete floor. Floor has ${zoneCount} zone(s). Remove all zones before deleting the floor.`,
      { zones_count: zoneCount }
    );
  }
  
  await floorRepo.delete(req.params.id);
  res.status(204).send();
}

module.exports = {
  createFloor,
  listFloors,
  getFloor,
  updateFloor,
  deleteFloor,
};
