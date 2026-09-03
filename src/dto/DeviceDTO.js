/**
 * Device Data Transfer Objects
 * Request/response validation schemas using Joi
 */

const Joi = require('joi');

/**
 * Create Device DTO
 */
const CreateDeviceDTO = Joi.object({
    zone_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Zone ID must be a number',
            'number.positive': 'Zone ID must be positive',
            'any.required': 'Zone ID is required'
        }),
    
    serial_number: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Serial number is required',
            'string.max': 'Serial number must not exceed 100 characters'
        }),
    
    model: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Model is required',
            'string.max': 'Model must not exceed 100 characters'
        }),
    
    protocol: Joi.string()
        .valid('modbus-rtu', 'modbus-tcp', 'bacnet')
        .required()
        .messages({
            'any.only': 'Protocol must be one of: modbus-rtu, modbus-tcp, bacnet',
            'any.required': 'Protocol is required'
        }),
    
    firmware_version: Joi.string()
        .trim()
        .max(50)
        .allow(null, '')
        .default(null),
    
    device_profile: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Device profile is required',
            'string.max': 'Device profile must not exceed 100 characters'
        }),
    
    commissioning_state: Joi.string()
        .valid('pending', 'commissioned', 'decommissioned')
        .default('pending')
        .messages({
            'any.only': 'Commissioning state must be one of: pending, commissioned, decommissioned'
        })
});

/**
 * Update Device DTO
 */
const UpdateDeviceDTO = Joi.object({
    model: Joi.string()
        .trim()
        .min(1)
        .max(100),
    
    protocol: Joi.string()
        .valid('modbus-rtu', 'modbus-tcp', 'bacnet'),
    
    firmware_version: Joi.string()
        .trim()
        .max(50)
        .allow(null, ''),
    
    device_profile: Joi.string()
        .trim()
        .min(1)
        .max(100),
    
    commissioning_state: Joi.string()
        .valid('pending', 'commissioned', 'decommissioned'),
    
    health_status: Joi.string()
        .valid('healthy', 'degraded', 'offline', 'unknown')
}).min(1);

/**
 * Device Filter DTO
 */
const DeviceFilterDTO = Joi.object({
    portfolio_id: Joi.number().integer().positive(),
    building_id: Joi.number().integer().positive(),
    zone_id: Joi.number().integer().positive(),
    protocol: Joi.string().valid('modbus-rtu', 'modbus-tcp', 'bacnet'),
    commissioning_state: Joi.string().valid('pending', 'commissioned', 'decommissioned'),
    health_status: Joi.string().valid('healthy', 'degraded', 'offline', 'unknown'),
    device_profile: Joi.string().trim().max(100),
    serial_number: Joi.string().trim().max(100),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
});

module.exports = {
    CreateDeviceDTO,
    UpdateDeviceDTO,
    DeviceFilterDTO
};
