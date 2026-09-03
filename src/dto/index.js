/**
 * DTO Index
 * Central export point for all Data Transfer Objects
 */

const PortfolioDTO = require('./PortfolioDTO');
const BuildingDTO = require('./BuildingDTO');
const FloorDTO = require('./FloorDTO');
const ZoneDTO = require('./ZoneDTO');
const DeviceDTO = require('./DeviceDTO');
const PointDTO = require('./PointDTO');

module.exports = {
    // Portfolio DTOs
    CreatePortfolioDTO: PortfolioDTO.CreatePortfolioDTO,
    UpdatePortfolioDTO: PortfolioDTO.UpdatePortfolioDTO,
    PortfolioQueryParamsDTO: PortfolioDTO.PortfolioQueryParamsDTO,
    
    // Building DTOs
    CreateBuildingDTO: BuildingDTO.CreateBuildingDTO,
    UpdateBuildingDTO: BuildingDTO.UpdateBuildingDTO,
    BuildingQueryParamsDTO: BuildingDTO.BuildingQueryParamsDTO,
    
    // Floor DTOs
    CreateFloorDTO: FloorDTO.CreateFloorDTO,
    UpdateFloorDTO: FloorDTO.UpdateFloorDTO,
    FloorQueryParamsDTO: FloorDTO.FloorQueryParamsDTO,
    
    // Zone DTOs
    CreateZoneDTO: ZoneDTO.CreateZoneDTO,
    UpdateZoneDTO: ZoneDTO.UpdateZoneDTO,
    ZoneFilterDTO: ZoneDTO.ZoneFilterDTO,
    
    // Device DTOs
    CreateDeviceDTO: DeviceDTO.CreateDeviceDTO,
    UpdateDeviceDTO: DeviceDTO.UpdateDeviceDTO,
    DeviceFilterDTO: DeviceDTO.DeviceFilterDTO,
    
    // Point DTOs
    CreatePointDTO: PointDTO.CreatePointDTO,
    BulkCreatePointsDTO: PointDTO.BulkCreatePointsDTO,
    UpdatePointDTO: PointDTO.UpdatePointDTO,
    PointQueryParamsDTO: PointDTO.PointQueryParamsDTO
};
