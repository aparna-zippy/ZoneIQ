-- Migration: Seed Device Profiles
-- Version: 1.0
-- Date: 2026-09-03
-- Description: Seeds initial device profiles for HVAC zone controllers

-- ============================================================================
-- UP Migration
-- ============================================================================

-- Insert hvac-zone-controller-v1 profile
INSERT INTO device_profiles (profile_name, version, description, required_points)
VALUES (
    'hvac-zone-controller-v1',
    '1.0',
    'Standard HVAC zone controller with temperature, humidity, CO2, and control points',
    '{
        "zone_temp": {
            "engineering_unit": "degC",
            "data_type": "int16",
            "scaling_factor": 0.1,
            "direction": "telemetry",
            "description": "Zone temperature sensor reading"
        },
        "zone_humidity": {
            "engineering_unit": "percent",
            "data_type": "uint16",
            "scaling_factor": 0.1,
            "direction": "telemetry",
            "description": "Zone relative humidity sensor reading"
        },
        "zone_co2": {
            "engineering_unit": "ppm",
            "data_type": "uint16",
            "scaling_factor": 1.0,
            "direction": "telemetry",
            "description": "Zone CO2 concentration sensor reading"
        },
        "setpoint_heat": {
            "engineering_unit": "degC",
            "data_type": "int16",
            "scaling_factor": 0.1,
            "direction": "both",
            "description": "Heating setpoint temperature"
        },
        "setpoint_cool": {
            "engineering_unit": "degC",
            "data_type": "int16",
            "scaling_factor": 0.1,
            "direction": "both",
            "description": "Cooling setpoint temperature"
        },
        "damper_position": {
            "engineering_unit": "percent",
            "data_type": "uint16",
            "scaling_factor": 0.1,
            "direction": "both",
            "description": "Fresh air damper position (0-100%)"
        },
        "valve_position": {
            "engineering_unit": "percent",
            "data_type": "uint16",
            "scaling_factor": 0.1,
            "direction": "both",
            "description": "Heating/cooling valve position (0-100%)"
        },
        "fan_speed": {
            "engineering_unit": "rpm",
            "data_type": "uint16",
            "scaling_factor": 1.0,
            "direction": "both",
            "description": "Supply fan speed in RPM"
        },
        "occupancy_count": {
            "engineering_unit": "count",
            "data_type": "uint16",
            "scaling_factor": 1.0,
            "direction": "telemetry",
            "description": "Number of occupants detected in zone"
        },
        "occupancy_detected": {
            "engineering_unit": "bool",
            "data_type": "bool",
            "scaling_factor": 1.0,
            "direction": "telemetry",
            "description": "Occupancy detection status (true/false)"
        },
        "alarm_status": {
            "engineering_unit": "bool",
            "data_type": "bool",
            "scaling_factor": 1.0,
            "direction": "telemetry",
            "description": "Alarm/fault status (true if alarm active)"
        },
        "system_mode": {
            "engineering_unit": "enum",
            "data_type": "uint16",
            "scaling_factor": 1.0,
            "direction": "both",
            "description": "System operating mode (0=off, 1=heat, 2=cool, 3=auto)"
        }
    }'::jsonb
)
ON CONFLICT (profile_name) DO NOTHING;

-- Verify the insert
DO $$
DECLARE
    profile_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO profile_count FROM device_profiles WHERE profile_name = 'hvac-zone-controller-v1';
    IF profile_count = 0 THEN
        RAISE EXCEPTION 'Failed to insert hvac-zone-controller-v1 profile';
    ELSE
        RAISE NOTICE 'Successfully seeded hvac-zone-controller-v1 profile with % required points', 
            jsonb_object_keys((SELECT required_points FROM device_profiles WHERE profile_name = 'hvac-zone-controller-v1')::jsonb);
    END IF;
END $$;

-- ============================================================================
-- Profile Summary:
-- ============================================================================
-- Profile: hvac-zone-controller-v1
-- Required Points: 12
-- - zone_temp (telemetry)
-- - zone_humidity (telemetry)
-- - zone_co2 (telemetry)
-- - setpoint_heat (both)
-- - setpoint_cool (both)
-- - damper_position (both)
-- - valve_position (both)
-- - fan_speed (both)
-- - occupancy_count (telemetry)
-- - occupancy_detected (telemetry)
-- - alarm_status (telemetry)
-- - system_mode (both)

-- ============================================================================
-- DOWN Migration (Rollback)
-- ============================================================================

-- Remove seeded device profiles
-- DELETE FROM device_profiles WHERE profile_name = 'hvac-zone-controller-v1';

-- Note: Uncomment the above DELETE statement when rolling back this migration
