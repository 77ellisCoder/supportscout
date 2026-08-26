import type { SQLiteDatabase } from "expo-sqlite";

export const migration004 = {
    version: 4,
    name: "drink_riders",

    async up(db: SQLiteDatabase): Promise<void> {
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS gig_band_drink_tokens (
        token_id INTEGER PRIMARY KEY AUTOINCREMENT,
        gig_id INTEGER NOT NULL,
        band_id INTEGER NOT NULL,
        used INTEGER NOT NULL DEFAULT 0,
        used_at TEXT,

        FOREIGN KEY (gig_id)
          REFERENCES gigs(gig_id)
          ON DELETE CASCADE,

        FOREIGN KEY (band_id)
          REFERENCES bands(band_id)
          ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS
        idx_drink_tokens_gig_band
      ON gig_band_drink_tokens (
        gig_id,
        band_id
      );
    `);
    },
};