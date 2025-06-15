-- add_entry_number_migration.sql

-- 1. Add the entry_number column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='avanan_alerts' AND column_name='entry_number'
    ) THEN
        ALTER TABLE avanan_alerts ADD COLUMN entry_number SERIAL;
    END IF;
END$$;

-- 2. Backfill entry_number for existing rows based on timestamp (oldest = 1)
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY timestamp ASC) AS rn
  FROM avanan_alerts
)
UPDATE avanan_alerts
SET entry_number = numbered.rn
FROM numbered
WHERE avanan_alerts.id = numbered.id;

-- 3. Make entry_number unique and not null
CREATE UNIQUE INDEX IF NOT EXISTS avanan_alerts_entry_number_idx ON avanan_alerts(entry_number);
ALTER TABLE avanan_alerts ALTER COLUMN entry_number SET NOT NULL;

-- 4. Set the SERIAL sequence to the max value
SELECT setval(
  pg_get_serial_sequence('avanan_alerts', 'entry_number'),
  (SELECT MAX(entry_number) FROM avanan_alerts)
);