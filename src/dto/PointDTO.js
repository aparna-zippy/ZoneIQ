/**
 * Point Data Transfer Objects
 * Request/response validation schemas using Joi
 */

const Joi = require('joi');

/**
 * Create Point DTO
 */
const CreatePointDTO = Joi.object({
    device_id: Joi.number()
        .integer()
        .positive()
        .required(),
    
    point_key: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .pattern(/^[a-z0-9_]+$/)
        .required()
        .messages({
            'string.pattern.base': 'Point key must contain only lowercase letters, numbers, and underscores'
        }),
    
    engineering_unit: Joi.string()
        .trim()
        .min(1)
        .max(20)
        .required(),
    
    data_type: Joi.string()
        .valid('int16', 'uint16', 'int32', 'uint32', 'float32', 'bool')
        .required(),
    
    scaling_factor: Joi.number()
        .min(0.000001)
        .max(1000000)
        .default(1.0)
        .messages({
            'number.min': 'Scaling factor must be greater than 0'
        }),
    
    direction: Joi.string()
        .valid('telemetry', 'command', 'both')
        .required(),
    
    register_type: Joi.string()
        .valid('holding', 'input', 'coil', 'discrete')
        .allow(null)
        .default(null),
    
    register_address: Joi.number()
        .integer()
        .min(0)
        .allow(null)
        .default(null),
    
    created_by: Joi.string()
        .trim()
        .max(100)
        .required()
});

/**
 * Bulk Create Points DTO
 */
const BulkCreatePointsDTO = Joi.object({
    device_id: Joi.number()
        .integer()
        .positive()
        .required(),
    
    points: Joi.array()
        .items(
            Joi.object({
                point_key: Joi.string().trim().min(1).max(100).pattern(/^[a-z0-9_]+$/).required(),
                engineering_unit: Joi.string().trim().min(1).max(20).required(),
                data_type: Joi.string().valid('int16', 'uint16', 'int32', 'uint32', 'float32', 'bool').required(),
                scaling_factor: Joi.number().min(0.000001).max(1000000).default(1.0),
                direction: Joi.string().valid('telemetry', 'command', 'both').required(),
                register_type: Joi.string().valid('holding', 'input', 'coil', 'discrete').allow(null).default(null),
                register_address: Joi.number().integer().min(0).allow(null).default(null)
            })
        )
        .min(1)
        .max(50)
        .required()
        .messages({
            'array.min': 'At least one point must be provided',
            'array.max': 'Cannot create more than 50 points at once'
        }),
    
    created_by: Joi.string()
        .trim()
        .max(100)
        .required()
});

/**
 * Update Point DTO
 */
const UpdatePointDTO = Joi.object({
    engineering_unit: Joi.string().trim().min(1).max(20),
    data_type: Joi.string().valid('int16', 'uint16', 'int32', 'uint32', 'float32', 'bool'),
    scaling_factor: Joi.number().min(0.000001).max(1000000),
    direction: Joi.string().valid('telemetry', 'command', 'both'),
    register_type: Joi.string().valid('holding', 'input', 'coil', 'discrete').allow(null),
    register_address: Joi.number().integer().min(0).allow(null),
    is_active: Joi.boolean(),
    updated_by: Joi.string().trim().max(100).required()
}).min(2); // At least one field + updated_by

/**
 * Point Query Params DTO
 */
const PointQueryParamsDTO = Joi.object({
    active_only: Joi.boolean().default(true)
});

module.exports = {
    CreatePointDTO,
    BulkCreatePointsDTO,
    UpdatePointDTO,
    PointQueryParamsDTO
};
