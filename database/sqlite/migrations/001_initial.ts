import type { SQLiteDatabase } from "expo-sqlite";

export const migration001 = {
  version: 1,
  name: "initial_schema",

  async up(db: SQLiteDatabase): Promise<void> {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bands (
        band_id INTEGER PRIMARY KEY AUTOINCREMENT,
        band_name TEXT NOT NULL COLLATE NOCASE,
        slug TEXT,
        hometown TEXT DEFAULT 'Perth',
        state_region TEXT DEFAULT 'Western Australia',
        country_code TEXT DEFAULT 'AU',
        member_count INTEGER,
        formation_year INTEGER,
        status TEXT NOT NULL DEFAULT 'active'
          CHECK (status IN ('active', 'inactive', 'hiatus', 'unknown')),
        short_description TEXT,
        internal_notes TEXT,
        is_our_band INTEGER NOT NULL DEFAULT 0 CHECK (is_our_band IN (0, 1)),
        is_verified INTEGER NOT NULL DEFAULT 0 CHECK (is_verified IN (0, 1)),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        archived_at TEXT
      );

      CREATE UNIQUE INDEX IF NOT EXISTS uq_bands_name_active
      ON bands (band_name)
      WHERE archived_at IS NULL;
    `);
  },
};
