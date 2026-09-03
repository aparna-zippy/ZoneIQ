/**
 * Zone Data Transfer Objects
 * Request/response validation schemas using Joi
 */

const Joi = require('joi');

/**
 * Create Zone DTO
 */
const CreateZoneDTO = Joi.object({
    floor_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Floor ID must be a number',
            'number.positive': 'Floor ID must be positive',
            'any.required': 'Floor ID is required'
        }),
    
    name: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Zone name is required',
            'string.max': 'Zone name must not exceed 255 characters'
        }),
    
    code: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Zone code is required',
            'string.max': 'Zone code must not exceed 50 characters'
        }),
    
    area_sqm: Joi.number()
        .positive()
        .precision(2)
        .allow(null)
        .default(null)
        .messages({
            'number.positive': 'Area must be a positive number'
        }),
    
    max_occupancy: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .default(null)
        .messages({
            'number.positive': 'Max occupancy must be a positive integer'
        })
});

/**
 * Update Zone DTO
 */
const UpdateZoneDTO = Joi.object({
    name: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .messages({
            'string.empty': 'Zone name cannot be empty',
            'string.max': 'Zone name must not exceed 255 characters'
        }),
    
    code: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .messages({
            'string.empty': 'Zone code cannot be empty',
            'string.max': 'Zone code must not exceed 50 characters'
        }),
    
    area_sqm: Joi.number()
        .positive()
        .precision(2)
        .allow(null)
        .messages({
            'number.positive': 'Area must be a positive number'
        }),
    
    max_occupancy: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .messages({
            'number.positive': 'Max occupancy must be a positive integer'
        })
}).min(1); // At least one field required

/**
 * Zone Filter DTO
 */
const ZoneFilterDTO = Joi.object({
    portfolio_id: Joi.number().integer().positive(),
    building_id: Joi.number().integer().positive(),
    floor_id: Joi.number().integer().positive(),
    min_area_sqm: Joi.number().positive(),
    max_area_sqm: Joi.number().positive(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
});

module.exports = {
    CreateZoneDTO,
    UpdateZoneDTO,
    ZoneFilterDTO
};
