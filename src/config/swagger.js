/**
 * Swagger/OpenAPI Configuration
 * Generates interactive API documentation
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ZoneIQ HVAC Fleet Platform API',
      version: '1.0.0',
      description: 'Asset Management & Point Catalogue REST API for HVAC Fleet Optimization',
      contact: {
        name: 'ZoneIQ Development Team',
        email: 'dev@zoneiq.example.com',
      },
      license: {
        name: 'UNLICENSED',
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Portfolio: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Downtown Campus' },
            code: { type: 'string', example: 'DTC' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        CreatePortfolio: {
          type: 'object',
          required: ['name', 'code'],
          properties: {
            name: { type: 'string', maxLength: 255, example: 'Downtown Campus' },
            code: { type: 'string', maxLength: 50, example: 'DTC' },
          },
        },
        UpdatePortfolio: {
          type: 'object',
          properties: {
            name: { type: 'string', maxLength: 255 },
            code: { type: 'string', maxLength: 50 },
          },
        },
        Building: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            portfolio_id: { type: 'integer' },
            name: { type: 'string' },
            code: { type: 'string' },
            address: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Floor: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            building_id: { type: 'integer' },
            name: { type: 'string' },
            code: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Zone: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            floor_id: { type: 'integer' },
            name: { type: 'string' },
            code: { type: 'string' },
            area_sqm: { type: 'number', format: 'float' },
            max_occupancy: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Device: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            zone_id: { type: 'integer' },
            serial_number: { type: 'string' },
            model: { type: 'string' },
            protocol: { type: 'string', enum: ['modbus-rtu', 'modbus-tcp', 'bacnet'] },
            firmware_version: { type: 'string' },
            device_profile: { type: 'string' },
            commissioning_state: { type: 'string', enum: ['pending', 'commissioned', 'decommissioned'] },
            health_status: { type: 'string', enum: ['healthy', 'degraded', 'offline', 'unknown'] },
            last_seen_at: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Point: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            device_id: { type: 'integer' },
            point_key: { type: 'string' },
            engineering_unit: { type: 'string' },
            data_type: { type: 'string', enum: ['int16', 'uint16', 'int32', 'uint32', 'float32', 'bool'] },
            scaling_factor: { type: 'number', default: 1.0 },
            direction: { type: 'string', enum: ['telemetry', 'command', 'both'] },
            register_type: { type: 'string', enum: ['holding', 'input', 'coil', 'discrete'], nullable: true },
            register_address: { type: 'integer', nullable: true },
            is_active: { type: 'boolean', default: true },
            created_by: { type: 'string' },
            updated_by: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        DeviceProfile: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            profile_name: { type: 'string' },
            version: { type: 'string' },
            description: { type: 'string' },
            required_points: { type: 'object' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'object' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { type: 'object' } },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                total_pages: { type: 'integer' },
                has_next: { type: 'boolean' },
                has_prev: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Portfolios', description: 'Portfolio management endpoints' },
      { name: 'Buildings', description: 'Building management endpoints' },
      { name: 'Floors', description: 'Floor management endpoints' },
      { name: 'Zones', description: 'Zone management endpoints' },
      { name: 'Devices', description: 'Device management endpoints' },
      { name: 'Points', description: 'Point catalogue endpoints' },
      { name: 'Device Profiles', description: 'Device profile endpoints' },
      { name: 'Health', description: 'System health and status endpoints' },
    ],
  },
  apis: ['./src/routes/*.js', './src/index.js'],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  if (process.env.ENABLE_SWAGGER_DOCS !== 'false') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'ZoneIQ API Documentation',
    }));
    
    // Swagger JSON endpoint
    app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }
}

module.exports = { setupSwagger, swaggerSpec };
