# Database Migrations

This directory contains PostgreSQL database migration scripts for the ZoneIQ HVAC Fleet Platform.

## Migration Files

Migrations are executed in alphabetical/chronological order:

1. **20260903_1200_create_portfolio_hierarchy_tables.sql** - Creates portfolios, buildings, floors, zones
2. **20260903_1210_create_device_tables.sql** - Creates devices table
3. **20260903_1220_create_point_catalogue_tables.sql** - Creates points table
4. **20260903_1230_create_device_profiles_table.sql** - Creates device_profiles table
5. **20260903_1240_add_indexes.sql** - Adds performance indexes
6. **20260903_1250_seed_device_profiles.sql** - Seeds initial device profiles

## Running Migrations

### Using psql (PostgreSQL CLI)

```bash
# Run all migrations
psql -U your_user -d zoneiq_db -f migrations/20260903_1200_create_portfolio_hierarchy_tables.sql
psql -U your_user -d zoneiq_db -f migrations/20260903_1210_create_device_tables.sql
psql -U your_user -d zoneiq_db -f migrations/20260903_1220_create_point_catalogue_tables.sql
psql -U your_user -d zoneiq_db -f migrations/20260903_1230_create_device_profiles_table.sql
psql -U your_user -d zoneiq_db -f migrations/20260903_1240_add_indexes.sql
psql -U your_user -d zoneiq_db -f migrations/20260903_1250_seed_device_profiles.sql
```

### Using Node.js Migration Tool

If using a Node.js migration tool (TypeORM, Knex, etc.), configure it to read these SQL files.

## Rollback

To rollback migrations, uncomment the DROP statements in each migration file's DOWN section and execute in reverse order.

**Important:** Always backup your database before running migrations or rollbacks!

## Database Requirements

- PostgreSQL 14+
- JSONB support (for device_profiles table)
- GIN index support (for JSONB queries)

## Verification

After running migrations, verify with:

```sql
-- Check all tables created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check device profile seeded
SELECT profile_name, version, jsonb_object_keys(required_points) as point 
FROM device_profiles;
```

## Naming Convention

Migration files follow the pattern: `YYYYMMDD_HHMM_description.sql`

- **YYYYMMDD**: Date (e.g., 20260903)
- **HHMM**: Time in 24-hour format (e.g., 1200)
- **description**: Brief description using underscores (e.g., create_device_tables)
