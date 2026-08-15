import type { SQLiteDatabase } from "expo-sqlite";

export const migration002 = {
    version: 2,
    name: "venues",

    async up(db: SQLiteDatabase): Promise<void> {
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS venues (
        venue_id INTEGER PRIMARY KEY AUTOINCREMENT,

        venue_name TEXT NOT NULL COLLATE NOCASE,
        slug TEXT,

        suburb TEXT,
        state_region TEXT NOT NULL DEFAULT 'Western Australia',
        country_code TEXT NOT NULL DEFAULT 'AU',

        address TEXT,

        capacity INTEGER,
        venue_type TEXT,

        website_url TEXT,
        booking_url TEXT,
        booking_email TEXT,

        short_description TEXT,
        internal_notes TEXT,

        status TEXT NOT NULL DEFAULT 'active'
          CHECK (
            status IN (
              'active',
              'inactive',
              'closed',
              'unknown'
            )
          ),

        is_verified INTEGER NOT NULL DEFAULT 0
          CHECK (is_verified IN (0, 1)),

        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        archived_at TEXT
      );

      CREATE UNIQUE INDEX IF NOT EXISTS uq_venues_name_active
      ON venues (venue_name)
      WHERE archived_at IS NULL;

      CREATE INDEX IF NOT EXISTS idx_venues_suburb
      ON venues (suburb);

      CREATE INDEX IF NOT EXISTS idx_venues_status
      ON venues (status);
    `);
    },
};