# ZoneIQ HVAC Fleet Platform

**Asset Management & Point Catalogue Module**

## Overview

ZoneIQ is a comprehensive HVAC fleet optimization and air-quality monitoring platform designed for managing large-scale building portfolios. This module provides foundational asset management capabilities including portfolio hierarchy, device inventory, point catalogue management, and data integrity controls.

## Features

### Asset Management (User Stories 1.1 - 1.4)
- **Portfolio Hierarchy Management**: Navigate and manage portfolios → buildings → floors → zones
- **Device Inventory**: Track HVAC devices with protocol support (Modbus RTU/TCP, BACnet)
- **Advanced Filtering**: Filter assets by location, protocol, commissioning state, and health status
- **Data Integrity Protection**: Prevent orphaned records and cascading deletions

### Point Catalogue (User Stories 2.1 - 2.3)
- **Device Points**: Manage telemetry and command points for each device
- **Profile Consistency**: Enforce device profile compliance with automated validation
- **Controlled Vocabulary**: Standardized point catalogue across the fleet

## Architecture

### Technology Stack
- **Runtime**: Node.js 18+
- **Database**: PostgreSQL 14+ with JSONB support
- **Framework**: Express.js
- **Validation**: Joi
- **Testing**: Jest + Supertest

### Project Structure
```
ZoneIQ/
├── migrations/          # Database migration scripts (sequential execution)
│   ├── 20260903_1200_create_portfolio_hierarchy_tables.sql
│   ├── 20260903_1210_create_device_tables.sql
│   ├── 20260903_1220_create_point_catalogue_tables.sql
│   ├── 20260903_1230_create_device_profiles_table.sql
│   ├── 20260903_1240_add_indexes.sql
│   └── 20260903_1250_seed_device_profiles.sql
├── src/
│   ├── config/          # Configuration (database, env)
│   ├── repositories/    # Data access layer
│   │   ├── BaseRepository.js
│   │   ├── PortfolioRepository.js
│   │   ├── BuildingRepository.js
│   │   ├── FloorRepository.js
│   │   ├── ZoneRepository.js
│   │   ├── DeviceRepository.js
│   │   ├── PointRepository.js
│   │   ├── DeviceProfileRepository.js
│   │   └── index.js
│   ├── controllers/     # API route handlers
│   ├── dto/             # Request/response validation schemas
│   │   ├── PortfolioDTO.js
│   │   ├── BuildingDTO.js
│   │   ├── FloorDTO.js
│   │   ├── ZoneDTO.js
│   │   ├── DeviceDTO.js
│   │   ├── PointDTO.js
│   │   └── index.js
│   └── models/          # Domain models/entities
├── scripts/             # Utility scripts
│   └── migrate.js       # Database migration runner
├── tests/               # Test suites (unit, integration, e2e)
├── docs/                # User stories and requirements
├── spec.md              # Technical specification
├── PLAN.md              # 8-week implementation plan
└── TASKS.md             # Detailed task breakdown (59 tasks)
```

## Database Schema

### Core Tables
1. **portfolios**: Top-level portfolio entities
2. **buildings**: Buildings within portfolios
3. **floors**: Floors within buildings
4. **zones**: HVAC zones within floors
5. **devices**: HVAC zone controllers and devices
6. **points**: Telemetry and command points for devices
7. **device_profiles**: Device profile definitions with required points (JSONB)

### Referential Integrity
- Foreign key cascade: `ON DELETE RESTRICT` (prevents orphaned records)
- Unique constraints: Codes must be unique within parent scope
- Check constraints: Validates enums, positive values, non-empty strings

## Getting Started

### Prerequisites
- Node.js 18+ and npm 9+
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aparna-zippy/ZoneIQ.git
   cd ZoneIQ
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run database migrations**
   ```bash
   # Using migration script (recommended)
   npm run migrate:status   # Check migration status
   npm run migrate:up       # Run all pending migrations
   
   # Or using psql directly
   psql -U your_user -d zoneiq_db -f migrations/20260903_1200_create_portfolio_hierarchy_tables.sql
   psql -U your_user -d zoneiq_db -f migrations/20260903_1210_create_device_tables.sql
   psql -U your_user -d zoneiq_db -f migrations/20260903_1220_create_point_catalogue_tables.sql
   psql -U your_user -d zoneiq_db -f migrations/20260903_1230_create_device_profiles_table.sql
   psql -U your_user -d zoneiq_db -f migrations/20260903_1240_add_indexes.sql
   psql -U your_user -d zoneiq_db -f migrations/20260903_1250_seed_device_profiles.sql
   ```

5. **Verify installation**
   ```bash
   npm test
   ```

### Development

```bash
# Run in development mode with auto-reload
npm run dev

# Run tests with coverage
npm test

# Run integration tests
npm run test:integration

# Lint code
npm run lint

# Format code
npm run format
```

## API Endpoints

### Portfolio Management
- `GET /api/v1/portfolios` - List portfolios with stats
- `GET /api/v1/portfolios/:id` - Get portfolio details
- `POST /api/v1/portfolios` - Create portfolio
- `PUT /api/v1/portfolios/:id` - Update portfolio
- `DELETE /api/v1/portfolios/:id` - Delete portfolio

### Device Management
- `GET /api/v1/devices` - Filter devices
- `GET /api/v1/devices/:id` - Get device details
- `POST /api/v1/devices` - Create device
- `PUT /api/v1/devices/:id` - Update device
- `DELETE /api/v1/devices/:id` - Delete device

### Point Catalogue
- `GET /api/v1/devices/:deviceId/points` - List device points
- `POST /api/v1/devices/:deviceId/points` - Create point
- `POST /api/v1/devices/:deviceId/points/bulk` - Bulk create points
- `PUT /api/v1/points/:id` - Update point
- `DELETE /api/v1/points/:id` - Soft delete point
- `GET /api/v1/catalogue/points` - Get point catalogue

## Testing

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test database operations and API endpoints
- **Coverage Target**: >85% (branches, functions, lines, statements)

```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:integration    # Integration tests only
```

## Contributing

This project follows the Git Feature Branch workflow:

1. Create feature branch from `main`
2. Implement changes with tests
3. Commit with descriptive messages
4. Push to remote
5. Create pull request

## License

UNLICENSED - Internal use only

## Documentation

- [User Stories](docs/00_user_stories_overview.md)
- [Technical Specification](spec.md)
- [Implementation Plan](PLAN.md)
- [Task Breakdown](TASKS.md)

## Support

For issues or questions, contact the ZoneIQ Development Team.
