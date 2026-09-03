/**
 * Device Profile Repository
 * Data access layer for device_profiles table
 */

const BaseRepository = require('./BaseRepository');

class DeviceProfileRepository extends BaseRepository {
    constructor(db) {
        super(db, 'device_profiles');
    }

    /**
     * Find device profile by name
     * @param {string} profileName - Profile name
     * @returns {Promise<Object|null>}
     */
    async findByName(profileName) {
        const query = 'SELECT * FROM device_profiles WHERE profile_name = $1';
        const result = await this.db.query(query, [profileName]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Find device profile by name and version
     * @param {string} profileName - Profile name
     * @param {string} version - Profile version
     * @returns {Promise<Object|null>}
     */
    async findByNameAndVersion(profileName, version) {
        const query = `
            SELECT * FROM device_profiles 
            WHERE profile_name = $1 AND version = $2
        `;
        const result = await this.db.query(query, [profileName, version]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * List all device profiles
     * @param {number} limit - Maximum number of records
     * @param {number} offset - Number of records to skip
     * @returns {Promise<Array>}
     */
    async listProfiles(limit = 20, offset = 0) {
        const query = `
            SELECT 
                id,
                profile_name,
                version,
                description,
                created_at,
                jsonb_object_keys(required_points) as point_count
            FROM device_profiles
            ORDER BY profile_name ASC, version DESC
            LIMIT $1 OFFSET $2
        `;
        const result = await this.db.query(query, [limit, offset]);
        return result.rows;
    }

    /**
     * Validate device points against profile requirements
     * @param {number} deviceId - Device ID
     * @returns {Promise<Object>} Validation result
     */
    async validateDevicePoints(deviceId) {
        const query = `
            WITH device_info AS (
                SELECT d.id, d.device_profile, dp.required_points
                FROM devices d
                JOIN device_profiles dp ON dp.profile_name = d.device_profile
                WHERE d.id = $1
            ),
            device_points AS (
                SELECT 
                    p.point_key,
                    p.engineering_unit,
                    p.data_type,
                    p.scaling_factor,
                    p.direction
                FROM points p
                WHERE p.device_id = $1 AND p.is_active = TRUE
            ),
            required_keys AS (
                SELECT jsonb_object_keys(required_points) as point_key
                FROM device_info
            ),
            validation AS (
                SELECT 
                    rk.point_key,
                    dp.point_key IS NOT NULL as exists_in_device,
                    di.required_points->rk.point_key as required_spec,
                    row_to_json(dp.*) as actual_spec
                FROM required_keys rk
                CROSS JOIN device_info di
                LEFT JOIN device_points dp ON dp.point_key = rk.point_key
            )
            SELECT 
                di.device_profile as profile_name,
                (
                    SELECT json_agg(v.point_key)
                    FROM validation v
                    WHERE v.exists_in_device = FALSE
                ) as missing_points,
                (
                    SELECT json_agg(
                        json_build_object(
                            'point_key', v.point_key,
                            'expected', v.required_spec,
                            'actual', v.actual_spec
                        )
                    )
                    FROM validation v
                    WHERE v.exists_in_device = TRUE
                    AND (
                        (v.actual_spec->>'engineering_unit') != (v.required_spec->>'engineering_unit')
                        OR (v.actual_spec->>'data_type') != (v.required_spec->>'data_type')
                        OR (v.actual_spec->>'direction') != (v.required_spec->>'direction')
                        OR ABS((v.actual_spec->>'scaling_factor')::numeric - (v.required_spec->>'scaling_factor')::numeric) > 0.0001
                    )
                ) as mismatched_points
            FROM device_info di
        `;
        
        const result = await this.db.query(query, [deviceId]);
        
        if (result.rows.length === 0) {
            return {
                compliant: false,
                error: 'Device or profile not found'
            };
        }
        
        const row = result.rows[0];
        const missingPoints = row.missing_points || [];
        const mismatchedPoints = row.mismatched_points || [];
        
        return {
            compliant: missingPoints.length === 0 && mismatchedPoints.length === 0,
            profile_name: row.profile_name,
            missing_points: missingPoints,
            mismatched_points: mismatchedPoints
        };
    }

    /**
     * Get required points for a profile
     * @param {string} profileName - Profile name
     * @returns {Promise<Object|null>} JSONB required_points object
     */
    async getRequiredPoints(profileName) {
        const query = `
            SELECT required_points 
            FROM device_profiles 
            WHERE profile_name = $1
        `;
        const result = await this.db.query(query, [profileName]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0].required_points;
    }

    /**
     * Check if profile exists
     * @param {string} profileName - Profile name
     * @returns {Promise<boolean>}
     */
    async profileExists(profileName) {
        const query = `
            SELECT EXISTS(
                SELECT 1 FROM device_profiles WHERE profile_name = $1
            )
        `;
        const result = await this.db.query(query, [profileName]);
        return result.rows[0].exists;
    }

    /**
     * Count devices using a profile
     * @param {string} profileName - Profile name
     * @returns {Promise<number>}
     */
    async countDevicesUsingProfile(profileName) {
        const query = `
            SELECT COUNT(*) as total 
            FROM devices 
            WHERE device_profile = $1
        `;
        const result = await this.db.query(query, [profileName]);
        return parseInt(result.rows[0].total, 10);
    }
}

module.exports = DeviceProfileRepository;
