/**
 * Building Controller
 * Handles HTTP requests for building management
 */

const db = require('../config/database');
const { BuildingRepository } = require('../repositories');
const { NotFoundError, IntegrityError } = require('../middleware/errorHandler');

const buildingRepo = new BuildingRepository(db);

/**
 * Create a new building
 * POST /api/buildings
 */
async function createBuilding(req, res) {
  const building = await buildingRepo.create(req.body);
  res.status(201).json(building);
}

/**
 * Get all buildings (optionally filtered by portfolio)
 * GET /api/buildings?portfolio_id=1
 */
async function listBuildings(req, res) {
  const { limit, offset, page } = req.pagination;
  const { portfolio_id } = req.query;
  
  let buildings, total;
  
  if (portfolio_id) {
    buildings = await buildingRepo.findByPortfolio(portfolio_id, limit, offset);
    // Count buildings in portfolio
    const result = await db.query(
      'SELECT COUNT(*)::int as count FROM buildings WHERE portfolio_id = $1',
      [portfolio_id]
    );
    total = result.rows[0].count;
  } else {
    buildings = await buildingRepo.findAll(limit, offset);
    total = await buildingRepo.count();
  }
  
  res.paginate(buildings, total);
}

/**
 * Get building by ID with stats
 * GET /api/buildings/:id
 */
async function getBuilding(req, res) {
  const building = await buildingRepo.getBuildingWithStats(req.params.id);
  
  if (!building) {
    throw new NotFoundError('Building', req.params.id);
  }
  
  res.json(building);
}

/**
 * Update building
 * PUT /api/buildings/:id
 */
async function updateBuilding(req, res) {
  const exists = await buildingRepo.exists(req.params.id);
  if (!exists) {
    throw new NotFoundError('Building', req.params.id);
  }
  
  const building = await buildingRepo.update(req.params.id, req.body);
  res.json(building);
}

/**
 * Delete building
 * DELETE /api/buildings/:id
 */
async function deleteBuilding(req, res) {
  const exists = await buildingRepo.exists(req.params.id);
  if (!exists) {
    throw new NotFoundError('Building', req.params.id);
  }
  
  // Check referential integrity
  const floorCount = await buildingRepo.countFloors(req.params.id);
  if (floorCount > 0) {
    throw new IntegrityError(
      `Cannot delete building. Building has ${floorCount} floor(s). Remove all floors before deleting the building.`,
      { floors_count: floorCount }
    );
  }
  
  await buildingRepo.delete(req.params.id);
  res.status(204).send();
}

module.exports = {
  createBuilding,
  listBuildings,
  getBuilding,
  updateBuilding,
  deleteBuilding,
};
