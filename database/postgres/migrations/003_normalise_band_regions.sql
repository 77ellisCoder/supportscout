BEGIN;

-- Normalise existing Australian state value
UPDATE bands
SET state_region = 'WA'
WHERE TRIM(LOWER(state_region)) = 'western australia';

-- Normalise casing as a precaution
UPDATE bands
SET state_region = UPPER(TRIM(state_region))
WHERE state_region IS NOT NULL;

UPDATE bands
SET country_code = UPPER(TRIM(country_code))
WHERE country_code IS NOT NULL;

-- Tighten column definitions
ALTER TABLE bands
    ALTER COLUMN state_region TYPE VARCHAR(10),
    ALTER COLUMN country_code TYPE CHAR(2);

COMMIT;