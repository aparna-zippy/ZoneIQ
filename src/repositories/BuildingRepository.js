/**
 * Building Repository
 * Data access layer for buildings table
 */

const BaseRepository = require('./BaseRepository');

class BuildingRepository extends BaseRepository {
    constructor(db) {
        super(db, 'buildings');
    }

    /**
     * Find buildings by portfolio ID
     * @param {number} portfolioId - Portfolio ID
     * @param {number} limit - Maximum number of records
     * @param {number} offset - Number of records to skip
     * @returns {Promise<Array>}
     */
    async findByPortfolio(portfolioId, limit = 20, offset = 0) {
        const query = `
            SELECT * FROM buildings
            WHERE portfolio_id = $1
            ORDER BY name ASC
            LIMIT $2 OFFSET $3
        `;
        const result = await this.db.query(query, [portfolioId, limit, offset]);
        return result.rows;
    }

    /**
     * Find building by code within a portfolio
     * @param {number} portfolioId - Portfolio ID
     * @param {string} code - Building code
     * @returns {Promise<Object|null>}
     */
    async findByCodeInPortfolio(portfolioId, code) {
        const query = `
            SELECT * FROM buildings
            WHERE portfolio_id = $1 AND code = $2
        `;
        const result = await this.db.query(query, [portfolioId, code]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Get building with floor and zone counts
     * @param {number} buildingId - Building ID
     * @returns {Promise<Object|null>}
     */
    async getBuildingWithStats(buildingId) {
        const query = `
            SELECT 
                b.*,
                p.name as portfolio_name,
                p.code as portfolio_code,
                COUNT(DISTINCT f.id) as floor_count,
                COUNT(DISTINCT z.id) as zone_count,
                COUNT(DISTINCT d.id) as device_count
            FROM buildings b
            LEFT JOIN portfolios p ON p.id = b.portfolio_id
            LEFT JOIN floors f ON f.building_id = b.id
            LEFT JOIN zones z ON z.floor_id = f.id
            LEFT JOIN devices d ON d.zone_id = z.id
            WHERE b.id = $1
            GROUP BY b.id, p.id
        `;
        const result = await this.db.query(query, [buildingId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Check if building code is unique within portfolio
     * @param {number} portfolioId - Portfolio ID
     * @param {string} code - Building code
     * @param {number} excludeId - Optional building ID to exclude
     * @returns {Promise<boolean>}
     */
    async isCodeUniqueInPortfolio(portfolioId, code, excludeId = null) {
        let query = `
            SELECT EXISTS(
                SELECT 1 FROM buildings 
                WHERE portfolio_id = $1 AND code = $2
        `;
        const params = [portfolioId, code];
        
        if (excludeId) {
            query += ' AND id != $3';
            params.push(excludeId);
        }
        
        query += ')';
        
        const result = await this.db.query(query, params);
        return !result.rows[0].exists;
    }

    /**
     * Count buildings in portfolio
     * @param {number} portfolioId - Portfolio ID
     * @returns {Promise<number>}
     */
    async countByPortfolio(portfolioId) {
        const query = 'SELECT COUNT(*) as total FROM buildings WHERE portfolio_id = $1';
        const result = await this.db.query(query, [portfolioId]);
        return parseInt(result.rows[0].total, 10);
    }

    /**
     * Verify building belongs to portfolio (for referential integrity checks)
     * @param {number} buildingId - Building ID
     * @param {number} portfolioId - Portfolio ID
     * @returns {Promise<boolean>}
     */
    async verifyBelongsToPortfolio(buildingId, portfolioId) {
        const query = `
            SELECT EXISTS(
                SELECT 1 FROM buildings 
                WHERE id = $1 AND portfolio_id = $2
            )
        `;
        const result = await this.db.query(query, [buildingId, portfolioId]);
        return result.rows[0].exists;
    }
}

module.exports = BuildingRepository;
