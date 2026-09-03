/**
 * Floor Repository
 * Data access layer for floors table
 */

const BaseRepository = require('./BaseRepository');

class FloorRepository extends BaseRepository {
    constructor(db) {
        super(db, 'floors');
    }

    /**
     * Find floors by building ID
     * @param {number} buildingId - Building ID
     * @param {number} limit - Maximum number of records
     * @param {number} offset - Number of records to skip
     * @returns {Promise<Array>}
     */
    async findByBuilding(buildingId, limit = 20, offset = 0) {
        const query = `
            SELECT * FROM floors
            WHERE building_id = $1
            ORDER BY name ASC
            LIMIT $2 OFFSET $3
        `;
        const result = await this.db.query(query, [buildingId, limit, offset]);
        return result.rows;
    }

    /**
     * Find floor by code within a building
     * @param {number} buildingId - Building ID
     * @param {string} code - Floor code
     * @returns {Promise<Object|null>}
     */
    async findByBuildingAndCode(buildingId, code) {
        const query = `
            SELECT * FROM floors
            WHERE building_id = $1 AND code = $2
        `;
        const result = await this.db.query(query, [buildingId, code]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Get floor with zone count
     * @param {number} floorId - Floor ID
     * @returns {Promise<Object|null>}
     */
    async getFloorWithStats(floorId) {
        const query = `
            SELECT 
                f.*,
                b.name as building_name,
                b.code as building_code,
                p.name as portfolio_name,
                COUNT(DISTINCT z.id) as zone_count,
                COUNT(DISTINCT d.id) as device_count
            FROM floors f
            LEFT JOIN buildings b ON b.id = f.building_id
            LEFT JOIN portfolios p ON p.id = b.portfolio_id
            LEFT JOIN zones z ON z.floor_id = f.id
            LEFT JOIN devices d ON d.zone_id = z.id
            WHERE f.id = $1
            GROUP BY f.id, b.id, p.id
        `;
        const result = await this.db.query(query, [floorId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Check if floor has zones (for delete integrity check)
     * @param {number} floorId - Floor ID
     * @returns {Promise<boolean>}
     */
    async hasZones(floorId) {
        const query = `
            SELECT EXISTS(
                SELECT 1 FROM zones WHERE floor_id = $1
            )
        `;
        const result = await this.db.query(query, [floorId]);
        return result.rows[0].exists;
    }

    /**
     * Count zones in floor
     * @param {number} floorId - Floor ID
     * @returns {Promise<number>}
     */
    async countZones(floorId) {
        const query = 'SELECT COUNT(*) as total FROM zones WHERE floor_id = $1';
        const result = await this.db.query(query, [floorId]);
        return parseInt(result.rows[0].total, 10);
    }

    /**
     * Check if floor code is unique within building
     * @param {number} buildingId - Building ID
     * @param {string} code - Floor code
     * @param {number} excludeId - Optional floor ID to exclude
     * @returns {Promise<boolean>}
     */
    async isCodeUniqueInBuilding(buildingId, code, excludeId = null) {
        let query = `
            SELECT EXISTS(
                SELECT 1 FROM floors 
                WHERE building_id = $1 AND code = $2
        `;
        const params = [buildingId, code];
        
        if (excludeId) {
            query += ' AND id != $3';
            params.push(excludeId);
        }
        
        query += ')';
        
        const result = await this.db.query(query, params);
        return !result.rows[0].exists;
    }

    /**
     * Count floors in building
     * @param {number} buildingId - Building ID
     * @returns {Promise<number>}
     */
    async countByBuilding(buildingId) {
        const query = 'SELECT COUNT(*) as total FROM floors WHERE building_id = $1';
        const result = await this.db.query(query, [buildingId]);
        return parseInt(result.rows[0].total, 10);
    }

    /**
     * Verify floor belongs to building (for referential integrity checks)
     * @param {number} floorId - Floor ID
     * @param {number} buildingId - Building ID
     * @returns {Promise<boolean>}
     */
    async verifyBelongsToBuilding(floorId, buildingId) {
        const query = `
            SELECT EXISTS(
                SELECT 1 FROM floors 
                WHERE id = $1 AND building_id = $2
            )
        `;
        const result = await this.db.query(query, [floorId, buildingId]);
        return result.rows[0].exists;
    }
}

module.exports = FloorRepository;
