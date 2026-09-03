/**
 * Portfolio Data Transfer Objects
 * Request/response validation schemas using Joi
 */

const Joi = require('joi');

/**
 * Create Portfolio DTO
 */
const CreatePortfolioDTO = Joi.object({
    name: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Portfolio name is required',
            'string.max': 'Portfolio name must not exceed 255 characters'
        }),
    
    code: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .pattern(/^[A-Z0-9_-]+$/)
        .required()
        .messages({
            'string.empty': 'Portfolio code is required',
            'string.pattern.base': 'Portfolio code must contain only uppercase letters, numbers, hyphens, and underscores',
            'string.max': 'Portfolio code must not exceed 50 characters'
        })
});

/**
 * Update Portfolio DTO
 */
const UpdatePortfolioDTO = Joi.object({
    name: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .messages({
            'string.empty': 'Portfolio name cannot be empty',
            'string.max': 'Portfolio name must not exceed 255 characters'
        }),
    
    code: Joi.string()
        .trim()
        .min(1)
        .max(50)
        .pattern(/^[A-Z0-9_-]+$/)
        .messages({
            'string.empty': 'Portfolio code cannot be empty',
            'string.pattern.base': 'Portfolio code must contain only uppercase letters, numbers, hyphens, and underscores',
            'string.max': 'Portfolio code must not exceed 50 characters'
        })
}).min(1); // At least one field required

/**
 * Portfolio Query Params DTO
 */
const PortfolioQueryParamsDTO = Joi.object({
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
    CreatePortfolioDTO,
    UpdatePortfolioDTO,
    PortfolioQueryParamsDTO
};
