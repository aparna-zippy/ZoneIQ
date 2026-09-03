/**
 * Request Validation Middleware
 * Validates request body, query params, and path params using Joi schemas
 */

const { ValidationError } = require('./errorHandler');

/**
 * Validate request against Joi schema
 * @param {Object} schema - Joi schema object with body, query, params properties
 */
function validateRequest(schema) {
  return (req, res, next) => {
    const validationErrors = {};

    // Validate body
    if (schema.body) {
      const { error, value } = schema.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        validationErrors.body = error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message.replace(/"/g, ''),
        }));
      } else {
        req.body = value;
      }
    }

    // Validate query params
    if (schema.query) {
      const { error, value } = schema.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        validationErrors.query = error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message.replace(/"/g, ''),
        }));
      } else {
        req.query = value;
      }
    }

    // Validate path params
    if (schema.params) {
      const { error, value } = schema.params.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        validationErrors.params = error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message.replace(/"/g, ''),
        }));
      } else {
        req.params = value;
      }
    }

    // If there are validation errors, throw
    if (Object.keys(validationErrors).length > 0) {
      throw new ValidationError('Request validation failed', validationErrors);
    }

    next();
  };
}

module.exports = validateRequest;
