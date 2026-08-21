import type { SQLiteDatabase } from "expo-sqlite";

export const migration003 = {
    version: 3,
    name: "gigs",

    async up(db: SQLiteDatabase): Promise<void> {
        await db.execAsync(`
        CREATE TABLE IF NOT EXISTS gigs (
            gig_id INTEGER PRIMARY KEY AUTOINCREMENT,

            venue_id INTEGER,

            gig_date TEXT NOT NULL,

            event_name TEXT,

            notes TEXT,

            status TEXT NOT NULL DEFAULT 'confirmed'
                CHECK (
                    status IN (
                        'tentative',
                        'confirmed',
                        'completed',
                        'cancelled'
                    )
                ),

            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (venue_id)
            REFERENCES venues (venue_id)
            ON DELETE SET NULL
        );

        CREATE INDEX IF NOT EXISTS idx_gigs_venue
        ON gigs (venue_id);

        CREATE INDEX IF NOT EXISTS idx_gigs_date
        ON gigs (gig_date);

        CREATE TABLE IF NOT EXISTS gig_bands (
            gig_id INTEGER NOT NULL,
            band_id INTEGER NOT NULL,

            billing_order INTEGER,
            role TEXT,

            PRIMARY KEY (gig_id, band_id),

            FOREIGN KEY (gig_id)
                REFERENCES gigs (gig_id)
                ON DELETE CASCADE,

            FOREIGN KEY (band_id)
                REFERENCES bands (band_id)
                ON DELETE CASCADE
        );
    `);
    },
};