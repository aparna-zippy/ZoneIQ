/**
 * Building Data Transfer Objects
 * Request/response validation schemas using Joi
 */

const Joi = require('joi');

/**
 * Create Building DTO
 */
const CreateBuildingDTO = Joi.object({
    portfolio_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Portfolio ID must be a number',
            'number.positive': 'Portfolio ID must be positive',
            'any.required': 'Portfolio ID is required'
        }),
    
    name: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Building name is required',
            'string.max': 'Building name must not exceed 255 characters'
        }),
    
    code: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Building code is required',
            'string.max': 'Building code must not exceed 50 characters'
        }),
    
    address: Joi.string()
        .trim()
        .max(500)
        .allow(null, '')
        .default(null)
        .messages({
            'string.max': 'Address must not exceed 500 characters'
        })
});

/**
 * Update Building DTO
 */
const UpdateBuildingDTO = Joi.object({
    name: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .messages({
            'string.empty': 'Building name cannot be empty',
            'string.max': 'Building name must not exceed 255 characters'
        }),
    
    code: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .messages({
            'string.empty': 'Building code cannot be empty',
            'string.max': 'Building code must not exceed 50 characters'
        }),
    
    address: Joi.string()
        .trim()
        .max(500)
        .allow(null, '')
        .messages({
            'string.max': 'Address must not exceed 500 characters'
        })
}).min(1); // At least one field required

/**
 * Building Query Params DTO
 */
const BuildingQueryParamsDTO = Joi.object({
    portfolio_id: Joi.number()
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
    CreateBuildingDTO,
    UpdateBuildingDTO,
    BuildingQueryParamsDTO
};
