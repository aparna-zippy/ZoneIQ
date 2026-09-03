/**
 * Portfolio Repository
 * Data access layer for portfolios table
 */

const BaseRepository = require('./BaseRepository');

class PortfolioRepository extends BaseRepository {
    constructor(db) {
        super(db, 'portfolios');
    }

    /**
     * Find portfolio by unique code
     * @param {string} code - Portfolio code
     * @returns {Promise<Object|null>}
     */
    async findByCode(code) {
        const query = 'SELECT * FROM portfolios WHERE code = $1';
        const result = await this.db.query(query, [code]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Get portfolio hierarchy with buildings count
     * @param {number} portfolioId - Portfolio ID
     * @returns {Promise<Object|null>}
     */
    async getPortfolioWithStats(portfolioId) {
        const query = `
            SELECT 
                p.*,
                COUNT(DISTINCT b.id) as building_count,
                COUNT(DISTINCT f.id) as floor_count,
                COUNT(DISTINCT z.id) as zone_count,
                COUNT(DISTINCT d.id) as device_count
            FROM portfolios p
            LEFT JOIN buildings b ON b.portfolio_id = p.id
            LEFT JOIN floors f ON f.building_id = b.id
            LEFT JOIN zones z ON z.floor_id = f.id
            LEFT JOIN devices d ON d.zone_id = z.id
            WHERE p.id = $1
            GROUP BY p.id
        `;
        
        const result = await this.db.query(query, [portfolioId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * List all portfolios with hierarchy statistics
     * @param {number} limit - Maximum number of records
     * @param {number} offset - Number of records to skip
     * @returns {Promise<Array>}
     */
    async listWithStats(limit = 20, offset = 0) {
        const query = `
            SELECT 
                p.*,
                COUNT(DISTINCT b.id) as building_count,
                COUNT(DISTINCT f.id) as floor_count,
                COUNT(DISTINCT z.id) as zone_count,
                COUNT(DISTINCT d.id) as device_count
            FROM portfolios p
            LEFT JOIN buildings b ON b.portfolio_id = p.id
            LEFT JOIN floors f ON f.building_id = b.id
            LEFT JOIN zones z ON z.floor_id = f.id
            LEFT JOIN devices d ON d.zone_id = z.id
            GROUP BY p.id
            ORDER BY p.name ASC
            LIMIT $1 OFFSET $2
        `;
        
        const result = await this.db.query(query, [limit, offset]);
        return result.rows;
    }

    /**
     * Check if portfolio code is unique (for validation)
     * @param {string} code - Portfolio code to check
     * @param {number} excludeId - Optional portfolio ID to exclude (for updates)
     * @returns {Promise<boolean>}
     */
    async isCodeUnique(code, excludeId = null) {
        let query = 'SELECT EXISTS(SELECT 1 FROM portfolios WHERE code = $1';
        const params = [code];
        
        if (excludeId) {
            query += ' AND id != $2';
            params.push(excludeId);
        }
        
        query += ')';
        
        const result = await this.db.query(query, params);
        return !result.rows[0].exists; // Return true if code is unique
    }

    /**
     * Get full portfolio hierarchy (portfolios -> buildings -> floors -> zones)
     * @param {number} portfolioId - Portfolio ID
     * @returns {Promise<Object|null>}
     */
    async getFullHierarchy(portfolioId) {
        const query = `
            WITH portfolio_data AS (
                SELECT * FROM portfolios WHERE id = $1
            ),
            building_data AS (
                SELECT 
                    b.*,
                    json_agg(
                        json_build_object(
                            'id', f.id,
                            'name', f.name,
                            'code', f.code,
                            'zones', (
                                SELECT json_agg(
                                    json_build_object(
                                        'id', z.id,
                                        'name', z.name,
                                        'code', z.code,
                                        'area_sqm', z.area_sqm,
                                        'max_occupancy', z.max_occupancy
                                    )
                                )
                                FROM zones z WHERE z.floor_id = f.id
                            )
                        )
                    ) FILTER (WHERE f.id IS NOT NULL) as floors
                FROM buildings b
                LEFT JOIN floors f ON f.building_id = b.id
                WHERE b.portfolio_id = $1
                GROUP BY b.id
            )
            SELECT 
                p.*,
                json_agg(
                    json_build_object(
                        'id', b.id,
                        'name', b.name,
                        'code', b.code,
                        'address', b.address,
                        'floors', b.floors
                    )
                ) FILTER (WHERE b.id IS NOT NULL) as buildings
            FROM portfolio_data p
            LEFT JOIN building_data b ON TRUE
            GROUP BY p.id, p.name, p.code, p.created_at, p.updated_at
        `;
        
        const result = await this.db.query(query, [portfolioId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Check if portfolio has buildings (for delete integrity check)
     * @param {number} portfolioId - Portfolio ID
     * @returns {Promise<boolean>}
     */
    async hasBuildings(portfolioId) {
        const query = `
            SELECT EXISTS(
                SELECT 1 FROM buildings WHERE portfolio_id = $1
            )
        `;
        const result = await this.db.query(query, [portfolioId]);
        return result.rows[0].exists;
    }

    /**
     * Count buildings in portfolio
     * @param {number} portfolioId - Portfolio ID
     * @returns {Promise<number>}
     */
    async countBuildings(portfolioId) {
        const query = 'SELECT COUNT(*) as total FROM buildings WHERE portfolio_id = $1';
        const result = await this.db.query(query, [portfolioId]);
        return parseInt(result.rows[0].total, 10);
    }
}

module.exports = PortfolioRepository;
