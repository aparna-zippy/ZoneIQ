/**
 * Pagination Helper Middleware
 * Provides utilities for paginating database results
 */

/**
 * Build pagination response
 * @param {Array} data - The data array
 * @param {number} page - Current page number (1-based)
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {Object} Paginated response with data and metadata
 */
function paginate(data, page, limit, total) {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total),
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1,
    },
  };
}

/**
 * Extract pagination params from request
 * @param {Object} req - Express request object
 * @returns {Object} { limit, offset, page }
 */
function getPaginationParams(req) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(
    parseInt(process.env.MAX_PAGE_SIZE) || 100,
    Math.max(1, parseInt(req.query.limit) || parseInt(process.env.DEFAULT_PAGE_SIZE) || 20)
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Middleware to attach pagination helpers to req object
 */
function paginationMiddleware(req, res, next) {
  // Attach pagination params
  req.pagination = getPaginationParams(req);

  // Attach paginate helper
  res.paginate = (data, total) => {
    return res.json(paginate(data, req.pagination.page, req.pagination.limit, total));
  };

  next();
}

module.exports = {
  paginate,
  getPaginationParams,
  paginationMiddleware,
};
