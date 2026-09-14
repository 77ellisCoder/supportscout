import type {
    SQLiteDatabase,
} from "expo-sqlite";

export const migration007 = {
    version: 7,
    name: "postgres_sync",

    async up(
        db: SQLiteDatabase
    ): Promise<void> {

        /*
         * Keep the local gigs schema aligned
         * with PostgreSQL.
         */

        await db.execAsync(`
            ALTER TABLE gigs
                ADD COLUMN start_time TEXT;

            ALTER TABLE gigs
                ADD COLUMN end_time TEXT;
        `);

        /*
         * Users
         */

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY,

                email TEXT NOT NULL UNIQUE,

                display_name TEXT,

                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS user_bands (
                user_id INTEGER NOT NULL,
                band_id INTEGER NOT NULL,

                relationship TEXT NOT NULL
                    DEFAULT 'member',

                PRIMARY KEY (
                    user_id,
                    band_id
                ),

                FOREIGN KEY (
                    user_id
                )
                    REFERENCES users (
                        user_id
                    )
                    ON DELETE CASCADE,

                FOREIGN KEY (
                    band_id
                )
                    REFERENCES bands (
                        band_id
                    )
                    ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS
                idx_user_bands_band
            ON user_bands (
                band_id
            );
        `);

        /*
         * Rehearsal locations
         */

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS
                rehearsal_locations (
                    rehearsal_location_id
                        INTEGER PRIMARY KEY,

                    name TEXT NOT NULL,

                    address TEXT,
                    suburb TEXT,

                    state TEXT NOT NULL
                        DEFAULT 'WA',

                    postcode TEXT,

                    phone TEXT,
                    email TEXT,

                    website TEXT,
                    booking_url TEXT,

                    default_session_minutes
                        INTEGER,

                    indicative_rate REAL,

                    notes TEXT,

                    active INTEGER NOT NULL
                        DEFAULT 1
                        CHECK (
                            active IN (0, 1)
                        ),

                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

            CREATE INDEX IF NOT EXISTS
                idx_rehearsal_locations_name
            ON rehearsal_locations (
                name
            );
        `);

        /*
         * Band rehearsal locations
         */

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS
                band_rehearsal_locations (
                    band_id INTEGER NOT NULL,

                    rehearsal_location_id
                        INTEGER NOT NULL,

                    is_favourite INTEGER NOT NULL
                        DEFAULT 0
                        CHECK (
                            is_favourite IN (0, 1)
                        ),

                    notes TEXT,

                    created_at TEXT NOT NULL,

                    PRIMARY KEY (
                        band_id,
                        rehearsal_location_id
                    ),

                    FOREIGN KEY (
                        band_id
                    )
                        REFERENCES bands (
                            band_id
                        )
                        ON DELETE CASCADE,

                    FOREIGN KEY (
                        rehearsal_location_id
                    )
                        REFERENCES
                            rehearsal_locations (
                                rehearsal_location_id
                            )
                        ON DELETE CASCADE
                );

            CREATE INDEX IF NOT EXISTS
                idx_band_rehearsal_locations_band
            ON band_rehearsal_locations (
                band_id
            );
        `);

        /*
         * Rehearsal proposals
         */

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS
                rehearsal_proposals (
                    proposal_id
                        INTEGER PRIMARY KEY,

                    band_id INTEGER NOT NULL,

                    proposed_by_user_id
                        INTEGER NOT NULL,

                    start_at TEXT NOT NULL,
                    end_at TEXT NOT NULL,

                    location TEXT,
                    notes TEXT,

                    status TEXT NOT NULL
                        DEFAULT 'proposed'
                        CHECK (
                            status IN (
                                'proposed',
                                'confirmed',
                                'cancelled'
                            )
                        ),

                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,

                    rehearsal_location_id
                        INTEGER,

                    CHECK (
                        end_at > start_at
                    ),

                    FOREIGN KEY (
                        band_id
                    )
                        REFERENCES bands (
                            band_id
                        )
                        ON DELETE CASCADE,

                    FOREIGN KEY (
                        proposed_by_user_id
                    )
                        REFERENCES users (
                            user_id
                        )
                        ON DELETE RESTRICT,

                    FOREIGN KEY (
                        rehearsal_location_id
                    )
                        REFERENCES
                            rehearsal_locations (
                                rehearsal_location_id
                            )
                        ON DELETE SET NULL
                );

            CREATE INDEX IF NOT EXISTS
                idx_rehearsal_proposals_band_start
            ON rehearsal_proposals (
                band_id,
                start_at
            );

            CREATE INDEX IF NOT EXISTS
                idx_rehearsal_proposals_proposer
            ON rehearsal_proposals (
                proposed_by_user_id
            );

            CREATE INDEX IF NOT EXISTS
                idx_rehearsal_proposals_location
            ON rehearsal_proposals (
                rehearsal_location_id
            );
        `);

        /*
         * Local sync state.
         *
         * This isn't a PostgreSQL table.
         * It belongs to the device.
         */

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS
                sync_metadata (
                    sync_key TEXT
                        PRIMARY KEY NOT NULL,

                    sync_value TEXT,

                    updated_at TEXT NOT NULL
                        DEFAULT CURRENT_TIMESTAMP
                );
        `);
    },
};