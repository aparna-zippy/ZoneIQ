/**
 * Floor Data Transfer Objects
 * Request/response validation schemas using Joi
 */

const Joi = require('joi');

/**
 * Create Floor DTO
 */
const CreateFloorDTO = Joi.object({
    building_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Building ID must be a number',
            'number.positive': 'Building ID must be positive',
            'any.required': 'Building ID is required'
        }),
    
    name: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Floor name is required',
            'string.max': 'Floor name must not exceed 255 characters'
        }),
    
    code: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Floor code is required',
            'string.max': 'Floor code must not exceed 50 characters'
        })
});

/**
 * Update Floor DTO
 */
const UpdateFloorDTO = Joi.object({
    name: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .messages({
            'string.empty': 'Floor name cannot be empty',
            'string.max': 'Floor name must not exceed 255 characters'
        }),
    
    code: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .messages({
            'string.empty': 'Floor code cannot be empty',
            'string.max': 'Floor code must not exceed 50 characters'
        })
}).min(1); // At least one field required

/**
 * Floor Query Params DTO
 */
const FloorQueryParamsDTO = Joi.object({
    building_id: Joi.number()
        .integer()
        .positive(),
    
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),
    
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(20)
});

module.exports = {
    CreateFloorDTO,
    UpdateFloorDTO,
    FloorQueryParamsDTO
};
