/**
 * Portfolio Controller
 * Handles HTTP requests for portfolio management
 */

const db = require('../config/database');
const { PortfolioRepository } = require('../repositories');
const { NotFoundError, IntegrityError } = require('../middleware/errorHandler');

const portfolioRepo = new PortfolioRepository(db);

/**
 * Create a new portfolio
 * POST /api/portfolios
 */
async function createPortfolio(req, res) {
  const portfolio = await portfolioRepo.create(req.body);
  res.status(201).json(portfolio);
}

/**
 * Get all portfolios with stats
 * GET /api/portfolios
 */
async function listPortfolios(req, res) {
  const { limit, offset, page } = req.pagination;
  
  const portfolios = await portfolioRepo.listWithStats(limit, offset);
  const total = await portfolioRepo.count();
  
  res.paginate(portfolios, total);
}

/**
 * Get portfolio by ID with stats
 * GET /api/portfolios/:id
 */
async function getPortfolio(req, res) {
  const portfolio = await portfolioRepo.getPortfolioWithStats(req.params.id);
  
  if (!portfolio) {
    throw new NotFoundError('Portfolio', req.params.id);
  }
  
  res.json(portfolio);
}

/**
 * Get portfolio with full hierarchy
 * GET /api/portfolios/:id/hierarchy
 */
async function getPortfolioHierarchy(req, res) {
  const hierarchy = await portfolioRepo.getFullHierarchy(req.params.id);
  
  if (!hierarchy) {
    throw new NotFoundError('Portfolio', req.params.id);
  }
  
  res.json(hierarchy);
}

/**
 * Update portfolio
 * PUT /api/portfolios/:id
 */
async function updatePortfolio(req, res) {
  const exists = await portfolioRepo.exists(req.params.id);
  if (!exists) {
    throw new NotFoundError('Portfolio', req.params.id);
  }
  
  const portfolio = await portfolioRepo.update(req.params.id, req.body);
  res.json(portfolio);
}

/**
 * Delete portfolio
 * DELETE /api/portfolios/:id
 */
async function deletePortfolio(req, res) {
  const exists = await portfolioRepo.exists(req.params.id);
  if (!exists) {
    throw new NotFoundError('Portfolio', req.params.id);
  }
  
  // Check referential integrity
  const buildingCount = await portfolioRepo.countBuildings(req.params.id);
  if (buildingCount > 0) {
    throw new IntegrityError(
      `Cannot delete portfolio. Portfolio has ${buildingCount} building(s). Remove all buildings before deleting the portfolio.`,
      { buildings_count: buildingCount }
    );
  }
  
  await portfolioRepo.delete(req.params.id);
  res.status(204).send();
}

module.exports = {
  createPortfolio,
  listPortfolios,
  getPortfolio,
  getPortfolioHierarchy,
  updatePortfolio,
  deletePortfolio,
};
