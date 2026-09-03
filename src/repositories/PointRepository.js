/**
 * Point Repository
 * Data access layer for points (device telemetry/command points)
 */

const BaseRepository = require('./BaseRepository');

class PointRepository extends BaseRepository {
    constructor(db) {
        super(db, 'points');
    }

    /**
     * Find points by device ID
     * @param {number} deviceId - Device ID
     * @param {boolean} activeOnly - Return only active points
     * @returns {Promise<Array>}
     */
    async findByDevice(deviceId, activeOnly = true) {
        let query = 'SELECT * FROM points WHERE device_id = $1';
        
        if (activeOnly) {
            query += ' AND is_active = TRUE';
        }
        
        query += ' ORDER BY point_key ASC';
        
        const result = await this.db.query(query, [deviceId]);
        return result.rows;
    }

    /**
     * Find point by device and point key
     * @param {number} deviceId - Device ID
     * @param {string} pointKey - Point key
     * @returns {Promise<Object|null>}
     */
    async findByDeviceAndKey(deviceId, pointKey) {
        const query = `
            SELECT * FROM points
            WHERE device_id = $1 AND point_key = $2
        `;
        const result = await this.db.query(query, [deviceId, pointKey]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Validate device points against profile requirements
     * @param {number} deviceId - Device ID
     * @param {Object} requiredPoints - Required points from device profile
     * @returns {Promise<Object>} Validation result with missing/extra/mismatched points
     */
    async validateAgainstProfile(deviceId, requiredPoints) {
        const existingPoints = await this.findByDevice(deviceId, true);
        
        const existingKeys = new Set(existingPoints.map(p => p.point_key));
        const requiredKeys = new Set(Object.keys(requiredPoints));
        
        const missing = [];
        const extra = [];
        const mismatched = [];
        
        // Check for missing required points
        for (const key of requiredKeys) {
            if (!existingKeys.has(key)) {
                missing.push(key);
            }
        }
        
        // Check for extra points and validate specifications
        for (const point of existingPoints) {
            if (!requiredKeys.has(point.point_key)) {
                extra.push(point.point_key);
            } else {
                // Validate point specifications
                const required = requiredPoints[point.point_key];
                const issues = [];
                
                if (point.engineering_unit !== required.engineering_unit) {
                    issues.push(`unit: expected ${required.engineering_unit}, got ${point.engineering_unit}`);
                }
                
                if (point.data_type !== required.data_type) {
                    issues.push(`data_type: expected ${required.data_type}, got ${point.data_type}`);
                }
                
                if (parseFloat(point.scaling_factor) !== parseFloat(required.scaling_factor)) {
                    issues.push(`scaling: expected ${required.scaling_factor}, got ${point.scaling_factor}`);
                }
                
                if (point.direction !== required.direction) {
                    issues.push(`direction: expected ${required.direction}, got ${point.direction}`);
                }
                
                if (issues.length > 0) {
                    mismatched.push({
                        point_key: point.point_key,
                        issues: issues
                    });
                }
            }
        }
        
        return {
            is_valid: missing.length === 0 && mismatched.length === 0,
            missing,
            extra,
            mismatched
        };
    }

    /**
     * Bulk create points for a device
     * @param {number} deviceId - Device ID
     * @param {Array} pointsData - Array of point objects
     * @param {string} createdBy - User creating the points
     * @returns {Promise<Array>} Created points
     */
    async bulkCreate(deviceId, pointsData, createdBy) {
        const values = [];
        const valueStrings = [];
        
        pointsData.forEach((point, index) => {
            const baseIndex = index * 10;
            valueStrings.push(`(
                $${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, 
                $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6},
                $${baseIndex + 7}, $${baseIndex + 8}, $${baseIndex + 9}, $${baseIndex + 10}
            )`);
            
            values.push(
                deviceId,
                point.point_key,
                point.engineering_unit,
                point.data_type,
                point.scaling_factor || 1.0,
                point.direction,
                point.register_type || null,
                point.register_address || null,
                createdBy,
                createdBy
            );
        });
        
        const query = `
            INSERT INTO points (
                device_id, point_key, engineering_unit, data_type,
                scaling_factor, direction, register_type, register_address,
                created_by, updated_by
            )
            VALUES ${valueStrings.join(', ')}
            RETURNING *
        `;
        
        const result = await this.db.query(query, values);
        return result.rows;
    }

    /**
     * Soft delete point (set is_active = false)
     * @param {number} pointId - Point ID
     * @param {string} updatedBy - User performing the deletion
     * @returns {Promise<boolean>}
     */
    async softDelete(pointId, updatedBy) {
        const query = `
            UPDATE points
            SET is_active = FALSE, updated_by = $1, updated_at = NOW()
            WHERE id = $2
        `;
        const result = await this.db.query(query, [updatedBy, pointId]);
        return result.rowCount > 0;
    }

    /**
     * Reactivate a soft-deleted point
     * @param {number} pointId - Point ID
     * @param {string} updatedBy - User reactivating the point
     * @returns {Promise<boolean>}
     */
    async reactivate(pointId, updatedBy) {
        const query = `
            UPDATE points
            SET is_active = TRUE, updated_by = $1, updated_at = NOW()
            WHERE id = $2
        `;
        const result = await this.db.query(query, [updatedBy, pointId]);
        return result.rowCount > 0;
    }

    /**
     * Get point catalogue (all unique point keys with counts)
     * @returns {Promise<Array>}
     */
    async getPointCatalogue() {
        const query = `
            SELECT 
                point_key,
                engineering_unit,
                data_type,
                direction,
                COUNT(*) as usage_count,
                COUNT(DISTINCT device_id) as device_count
            FROM points
            WHERE is_active = TRUE
            GROUP BY point_key, engineering_unit, data_type, direction
            ORDER BY point_key ASC
        `;
        const result = await this.db.query(query);
        return result.rows;
    }

    /**
     * Count points by device
     * @param {number} deviceId - Device ID
     * @param {boolean} activeOnly - Count only active points
     * @returns {Promise<number>}
     */
    async countByDevice(deviceId, activeOnly = true) {
        let query = 'SELECT COUNT(*) as total FROM points WHERE device_id = $1';
        
        if (activeOnly) {
            query += ' AND is_active = TRUE';
        }
        
        const result = await this.db.query(query, [deviceId]);
        return parseInt(result.rows[0].total, 10);
    }
}

module.exports = PointRepository;
