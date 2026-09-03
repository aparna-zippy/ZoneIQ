/**
 * Device Repository
 * Data access layer for devices table
 */

const BaseRepository = require('./BaseRepository');

class DeviceRepository extends BaseRepository {
    constructor(db) {
        super(db, 'devices');
    }

    /**
     * Find device by serial number
     * @param {string} serialNumber - Device serial number
     * @returns {Promise<Object|null>}
     */
    async findBySerialNumber(serialNumber) {
        const query = 'SELECT * FROM devices WHERE serial_number = $1';
        const result = await this.db.query(query, [serialNumber]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Find devices by zone ID
     * @param {number} zoneId - Zone ID
     * @param {Object} filters - Optional filters
     * @returns {Promise<Array>}
     */
    async findByZone(zoneId, filters = {}) {
        let query = 'SELECT * FROM devices WHERE zone_id = $1';
        const params = [zoneId];
        let paramIndex = 2;

        if (filters.protocol) {
            query += ` AND protocol = $${paramIndex}`;
            params.push(filters.protocol);
            paramIndex++;
        }

        if (filters.commissioning_state) {
            query += ` AND commissioning_state = $${paramIndex}`;
            params.push(filters.commissioning_state);
            paramIndex++;
        }

        if (filters.health_status) {
            query += ` AND health_status = $${paramIndex}`;
            params.push(filters.health_status);
            paramIndex++;
        }

        if (filters.device_profile) {
            query += ` AND device_profile = $${paramIndex}`;
            params.push(filters.device_profile);
            paramIndex++;
        }

        query += ' ORDER BY serial_number ASC';

        const result = await this.db.query(query, params);
        return result.rows;
    }

    /**
     * Filter devices with advanced criteria
     * @param {Object} filters - Filter criteria
     * @param {number} limit - Maximum number of records
     * @param {number} offset - Number of records to skip
     * @returns {Promise<Array>}
     */
    async filterDevices(filters, limit = 20, offset = 0) {
        let query = `
            SELECT 
                d.*,
                z.name as zone_name,
                z.code as zone_code,
                f.name as floor_name,
                b.name as building_name,
                p.name as portfolio_name
            FROM devices d
            LEFT JOIN zones z ON z.id = d.zone_id
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

        if (filters.zone_id) {
            query += ` AND d.zone_id = $${paramIndex}`;
            params.push(filters.zone_id);
            paramIndex++;
        }

        if (filters.protocol) {
            query += ` AND d.protocol = $${paramIndex}`;
            params.push(filters.protocol);
            paramIndex++;
        }

        if (filters.commissioning_state) {
            query += ` AND d.commissioning_state = $${paramIndex}`;
            params.push(filters.commissioning_state);
            paramIndex++;
        }

        if (filters.health_status) {
            query += ` AND d.health_status = $${paramIndex}`;
            params.push(filters.health_status);
            paramIndex++;
        }

        if (filters.device_profile) {
            query += ` AND d.device_profile = $${paramIndex}`;
            params.push(filters.device_profile);
            paramIndex++;
        }

        if (filters.serial_number) {
            query += ` AND d.serial_number ILIKE $${paramIndex}`;
            params.push(`%${filters.serial_number}%`);
            paramIndex++;
        }

        query += ` ORDER BY d.serial_number ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await this.db.query(query, params);
        return result.rows;
    }

    /**
     * Count devices matching filters
     * @param {Object} filters - Filter criteria
     * @returns {Promise<number>}
     */
    async countFiltered(filters) {
        let query = `
            SELECT COUNT(*) as total
            FROM devices d
            LEFT JOIN zones z ON z.id = d.zone_id
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

        if (filters.zone_id) {
            query += ` AND d.zone_id = $${paramIndex}`;
            params.push(filters.zone_id);
            paramIndex++;
        }

        if (filters.protocol) {
            query += ` AND d.protocol = $${paramIndex}`;
            params.push(filters.protocol);
            paramIndex++;
        }

        if (filters.commissioning_state) {
            query += ` AND d.commissioning_state = $${paramIndex}`;
            params.push(filters.commissioning_state);
            paramIndex++;
        }

        if (filters.health_status) {
            query += ` AND d.health_status = $${paramIndex}`;
            params.push(filters.health_status);
            paramIndex++;
        }

        if (filters.device_profile) {
            query += ` AND d.device_profile = $${paramIndex}`;
            params.push(filters.device_profile);
            paramIndex++;
        }

        const result = await this.db.query(query, params);
        return parseInt(result.rows[0].total, 10);
    }

    /**
     * Update device health status
     * @param {number} deviceId - Device ID
     * @param {string} healthStatus - New health status
     * @returns {Promise<Object|null>}
     */
    async updateHealthStatus(deviceId, healthStatus) {
        const query = `
            UPDATE devices
            SET health_status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `;
        const result = await this.db.query(query, [healthStatus, deviceId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Update last seen timestamp
     * @param {number} deviceId - Device ID
     * @param {Date} timestamp - Last seen timestamp
     * @returns {Promise<boolean>}
     */
    async updateLastSeen(deviceId, timestamp = new Date()) {
        const query = `
            UPDATE devices
            SET last_seen_at = $1, updated_at = NOW()
            WHERE id = $2
        `;
        const result = await this.db.query(query, [timestamp, deviceId]);
        return result.rowCount > 0;
    }

    /**
     * Get devices with point counts
     * @param {number} zoneId - Zone ID
     * @returns {Promise<Array>}
     */
    async getDevicesWithPointCounts(zoneId) {
        const query = `
            SELECT 
                d.*,
                COUNT(DISTINCT p.id) FILTER (WHERE p.is_active = TRUE) as active_point_count,
                COUNT(DISTINCT p.id) as total_point_count
            FROM devices d
            LEFT JOIN points p ON p.device_id = d.id
            WHERE d.zone_id = $1
            GROUP BY d.id
            ORDER BY d.serial_number ASC
        `;
        const result = await this.db.query(query, [zoneId]);
        return result.rows;
    }
}

module.exports = DeviceRepository;
