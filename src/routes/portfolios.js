/**
 * Portfolio Routes
 * Defines API endpoints for portfolio management
 */

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { asyncHandler } = require('../middleware/errorHandler');
const validateRequest = require('../middleware/validateRequest');
const { CreatePortfolioDTO, UpdatePortfolioDTO, PortfolioQueryParamsDTO } = require('../dto/PortfolioDTO');
const portfolioController = require('../controllers/portfolioController');

// Validation schemas
const idParam = Joi.object({
  id: Joi.number().integer().positive().required(),
});

/**
 * @swagger
 * /api/portfolios:
 *   post:
 *     summary: Create a new portfolio
 *     tags: [Portfolios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePortfolio'
 *     responses:
 *       201:
 *         description: Portfolio created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Portfolio code already exists
 */
router.post(
  '/',
  validateRequest({ body: CreatePortfolioDTO }),
  asyncHandler(portfolioController.createPortfolio)
);

/**
 * @swagger
 * /api/portfolios:
 *   get:
 *     summary: Get all portfolios with statistics
 *     tags: [Portfolios]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of portfolios
 */
router.get(
  '/',
  validateRequest({ query: PortfolioQueryParamsDTO }),
  asyncHandler(portfolioController.listPortfolios)
);

/**
 * @swagger
 * /api/portfolios/{id}:
 *   get:
 *     summary: Get portfolio by ID with statistics
 *     tags: [Portfolios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Portfolio details
 *       404:
 *         description: Portfolio not found
 */
router.get(
  '/:id',
  validateRequest({ params: idParam }),
  asyncHandler(portfolioController.getPortfolio)
);

/**
 * @swagger
 * /api/portfolios/{id}/hierarchy:
 *   get:
 *     summary: Get portfolio with full hierarchy
 *     tags: [Portfolios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Portfolio with complete hierarchy
 *       404:
 *         description: Portfolio not found
 */
router.get(
  '/:id/hierarchy',
  validateRequest({ params: idParam }),
  asyncHandler(portfolioController.getPortfolioHierarchy)
);

/**
 * @swagger
 * /api/portfolios/{id}:
 *   put:
 *     summary: Update portfolio
 *     tags: [Portfolios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePortfolio'
 *     responses:
 *       200:
 *         description: Portfolio updated successfully
 *       404:
 *         description: Portfolio not found
 */
router.put(
  '/:id',
  validateRequest({ params: idParam, body: UpdatePortfolioDTO }),
  asyncHandler(portfolioController.updatePortfolio)
);

/**
 * @swagger
 * /api/portfolios/{id}:
 *   delete:
 *     summary: Delete portfolio
 *     tags: [Portfolios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Portfolio deleted successfully
 *       404:
 *         description: Portfolio not found
 *       422:
 *         description: Cannot delete portfolio with buildings
 */
router.delete(
  '/:id',
  validateRequest({ params: idParam }),
  asyncHandler(portfolioController.deletePortfolio)
);

module.exports = router;
