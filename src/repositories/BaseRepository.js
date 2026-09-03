/**
 * Base Repository
 * Abstract base class for all repositories with common CRUD operations
 */

class BaseRepository {
    constructor(db, tableName) {
        if (new.target === BaseRepository) {
            throw new TypeError('Cannot construct BaseRepository instances directly');
        }
        
        this.db = db;
        this.tableName = tableName;
    }

    /**
     * Find entity by ID
     * @param {number} id - Entity ID
     * @returns {Promise<Object|null>}
     */
    async findById(id) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
        const result = await this.db.query(query, [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Find all entities with optional limit and offset
     * @param {number} limit - Maximum number of records
     * @param {number} offset - Number of records to skip
     * @returns {Promise<Array>}
     */
    async findAll(limit = 100, offset = 0) {
        const query = `
            SELECT * FROM ${this.tableName}
            ORDER BY id ASC
            LIMIT $1 OFFSET $2
        `;
        const result = await this.db.query(query, [limit, offset]);
        return result.rows;
    }

    /**
     * Count total entities
     * @returns {Promise<number>}
     */
    async count() {
        const query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
        const result = await this.db.query(query);
        return parseInt(result.rows[0].total, 10);
    }

    /**
     * Create new entity
     * @param {Object} data - Entity data
     * @returns {Promise<Object>}
     */
    async create(data) {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        
        const query = `
            INSERT INTO ${this.tableName} (${columns.join(', ')})
            VALUES (${placeholders})
            RETURNING *
        `;
        
        const result = await this.db.query(query, values);
        return result.rows[0];
    }

    /**
     * Update entity by ID
     * @param {number} id - Entity ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object|null>}
     */
    async update(id, data) {
        const columns = Object.keys(data);
        const values = Object.values(data);
        
        // Add updated_at timestamp if not provided
        if (!data.updated_at) {
            columns.push('updated_at');
            values.push(new Date());
        }
        
        const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');
        
        const query = `
            UPDATE ${this.tableName}
            SET ${setClause}
            WHERE id = $${values.length + 1}
            RETURNING *
        `;
        
        const result = await this.db.query(query, [...values, id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }

    /**
     * Delete entity by ID
     * @param {number} id - Entity ID
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
        const result = await this.db.query(query, [id]);
        return result.rowCount > 0;
    }

    /**
     * Check if entity exists by ID
     * @param {number} id - Entity ID
     * @returns {Promise<boolean>}
     */
    async exists(id) {
        const query = `SELECT EXISTS(SELECT 1 FROM ${this.tableName} WHERE id = $1)`;
        const result = await this.db.query(query, [id]);
        return result.rows[0].exists;
    }

    /**
     * Execute custom query with parameters
     * @param {string} query - SQL query
     * @param {Array} params - Query parameters
     * @returns {Promise<Array>}
     */
    async executeQuery(query, params = []) {
        const result = await this.db.query(query, params);
        return result.rows;
    }
}

module.exports = BaseRepository;
