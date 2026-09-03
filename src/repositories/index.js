/**
 * Repository Index
 * Central export point for all repositories
 */

const BaseRepository = require('./BaseRepository');
const PortfolioRepository = require('./PortfolioRepository');
const BuildingRepository = require('./BuildingRepository');
const FloorRepository = require('./FloorRepository');
const ZoneRepository = require('./ZoneRepository');
const DeviceRepository = require('./DeviceRepository');
const PointRepository = require('./PointRepository');
const DeviceProfileRepository = require('./DeviceProfileRepository');

module.exports = {
    BaseRepository,
    PortfolioRepository,
    BuildingRepository,
    FloorRepository,
    ZoneRepository,
    DeviceRepository,
    PointRepository,
    DeviceProfileRepository
};
