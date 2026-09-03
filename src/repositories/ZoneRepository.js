/**
 * Zone Repository
 * Data access layer for zones table
 */

const BaseRepository = require('./BaseRepository');

class ZoneRepository extends BaseRepository {
    constructor(db) {
        super(db, 'zones');
    }

    /**
     * Find zones by floor ID
     * @param {number} floorId - Floor ID
     * @param {number} limit - Maximum number of records
     * @param {number} offset - Number of records to skip
     * @returns {Promise<Array>}
     */
    async findByFloor(floorId, limit = 20, offset = 0) {
        const query = `
            SELECT * FROM zones
            WHERE floor_id = $1
            ORDER BY name ASC
            LIMIT $2 OFFSET $3
        `;
        const result = await this.db.query(query, [floorId, limit, offset]);
        return result.rows;
    }

    /**
     * Find zone by code within a floor
     * @param {number} floorId - Floor ID
     * @param {string} code - Zone code
     * @returns {Promise<Object|null>}
     */
    async findByFloorAndCode(floorId, code) {
        const query = `
            SELECT * FROM zones
            WHERE floor_id = $1 AND code = $2
        `;
        const result = await this.db.query(query, [floorId, code]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Filter zones with hierarchy context
     * @param {Object} filters - Filter criteria
     * @param {number} limit - Maximum number of records
     * @param {number} offset - Number of records to skip
     * @returns {Promise<Array>}
     */
    async filterZones(filters, limit = 20, offset = 0) {
        let query = `
            SELECT 
                z.*,
                f.name as floor_name,
                f.code as floor_code,
                b.name as building_name,
                b.code as building_code,
                p.name as portfolio_name,
                p.code as portfolio_code
            FROM zones z
            LEFT JOIN floors f ON f.id = z.floor_id
            LEFT JOIN buildings b ON b.id = f.building_id
            LEFT JOIN portfolios p ON p.id = b.portfolio_id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (filters.portfolio_id) {
            query += ` AND p.id = $${paramIndex}`;
            params.push(filters.portfolio_id);
            paramIndex++;
        }

        if (filters.building_id) {
            query += ` AND b.id = $${paramIndex}`;
            params.push(filters.building_id);
            paramIndex++;
        }

        if (filters.floor_id) {
            query += ` AND z.floor_id = $${paramIndex}`;
            params.push(filters.floor_id);
            paramIndex++;
        }

        if (filters.min_area_sqm) {
            query += ` AND z.area_sqm >= $${paramIndex}`;
            params.push(filters.min_area_sqm);
            paramIndex++;
        }

        if (filters.max_area_sqm) {
            query += ` AND z.area_sqm <= $${paramIndex}`;
            params.push(filters.max_area_sqm);
            paramIndex++;
        }

        query += ` ORDER BY z.name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await this.db.query(query, params);
        return result.rows;
    }

    /**
     * Count zones matching filters
     * @param {Object} filters - Filter criteria
     * @returns {Promise<number>}
     */
    async countFiltered(filters) {
        let query = `
            SELECT COUNT(*) as total
            FROM zones z
            LEFT JOIN floors f ON f.id = z.floor_id
            LEFT JOIN buildings b ON b.id = f.building_id
            LEFT JOIN portfolios p ON p.id = b.portfolio_id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (filters.portfolio_id) {
            query += ` AND p.id = $${paramIndex}`;
            params.push(filters.portfolio_id);
            paramIndex++;
        }

        if (filters.building_id) {
            query += ` AND b.id = $${paramIndex}`;
            params.push(filters.building_id);
            paramIndex++;
        }

        if (filters.floor_id) {
            query += ` AND z.floor_id = $${paramIndex}`;
            params.push(filters.floor_id);
            paramIndex++;
        }

        if (filters.min_area_sqm) {
            query += ` AND z.area_sqm >= $${paramIndex}`;
            params.push(filters.min_area_sqm);
            paramIndex++;
        }

        if (filters.max_area_sqm) {
            query += ` AND z.area_sqm <= $${paramIndex}`;
            params.push(filters.max_area_sqm);
            paramIndex++;
        }

        const result = await this.db.query(query, params);
        return parseInt(result.rows[0].total, 10);
    }

    /**
     * Get zone with device count and stats
     * @param {number} zoneId - Zone ID
     * @returns {Promise<Object|null>}
     */
    async getZoneWithStats(zoneId) {
        const query = `
            SELECT 
                z.*,
                f.name as floor_name,
                b.name as building_name,
                p.name as portfolio_name,
                COUNT(DISTINCT d.id) as device_count,
                COUNT(DISTINCT d.id) FILTER (WHERE d.commissioning_state = 'commissioned') as commissioned_device_count,
                COUNT(DISTINCT pt.id) FILTER (WHERE pt.is_active = TRUE) as active_point_count
            FROM zones z
            LEFT JOIN floors f ON f.id = z.floor_id
            LEFT JOIN buildings b ON b.id = f.building_id
            LEFT JOIN portfolios p ON p.id = b.portfolio_id
            LEFT JOIN devices d ON d.zone_id = z.id
            LEFT JOIN points pt ON pt.device_id = d.id
            WHERE z.id = $1
            GROUP BY z.id, f.id, b.id, p.id
        `;
        const result = await this.db.query(query, [zoneId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Check if zone has devices (for delete integrity check)
     * @param {number} zoneId - Zone ID
     * @returns {Promise<boolean>}
     */
    async hasDevices(zoneId) {
        const query = `
            SELECT EXISTS(
                SELECT 1 FROM devices WHERE zone_id = $1
            )
        `;
        const result = await this.db.query(query, [zoneId]);
        return result.rows[0].exists;
    }

    /**
     * Count devices in zone
     * @param {number} zoneId - Zone ID
     * @returns {Promise<number>}
     */
    async countDevices(zoneId) {
        const query = 'SELECT COUNT(*) as total FROM devices WHERE zone_id = $1';
        const result = await this.db.query(query, [zoneId]);
        return parseInt(result.rows[0].total, 10);
    }

    /**
     * Check if zone code is unique within floor
     * @param {number} floorId - Floor ID
     * @param {string} code - Zone code
     * @param {number} excludeId - Optional zone ID to exclude
     * @returns {Promise<boolean>}
     */
    async isCodeUniqueInFloor(floorId, code, excludeId = null) {
        let query = `
            SELECT EXISTS(
                SELECT 1 FROM zones 
                WHERE floor_id = $1 AND code = $2
        `;
        const params = [floorId, code];
        
        if (excludeId) {
            query += ' AND id != $3';
            params.push(excludeId);
        }
        
        query += ')';
        
        const result = await this.db.query(query, params);
        return !result.rows[0].exists;
    }

    /**
     * Count zones in floor
     * @param {number} floorId - Floor ID
     * @returns {Promise<number>}
     */
    async countByFloor(floorId) {
        const query = 'SELECT COUNT(*) as total FROM zones WHERE floor_id = $1';
        const result = await this.db.query(query, [floorId]);
        return parseInt(result.rows[0].total, 10);
    }
}

module.exports = ZoneRepository;
