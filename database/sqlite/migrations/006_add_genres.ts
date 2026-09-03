import type { SQLiteDatabase } from "expo-sqlite";

export const migration006 = {
    version: 6,
    name: "add_genres",

    async up(db: SQLiteDatabase): Promise<void> {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS genres (
                genre_id INTEGER PRIMARY KEY AUTOINCREMENT,
                genre_name TEXT NOT NULL COLLATE NOCASE UNIQUE,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS band_genres (
                band_id INTEGER NOT NULL,
                genre_id INTEGER NOT NULL,

                PRIMARY KEY (band_id, genre_id),

                FOREIGN KEY (band_id)
                    REFERENCES bands(band_id)
                    ON DELETE CASCADE,

                FOREIGN KEY (genre_id)
                    REFERENCES genres(genre_id)
                    ON DELETE CASCADE
            );

            INSERT OR IGNORE INTO genres (genre_name) VALUES
                ("Rock"),
                ("Pop"),
                ("Indie"),
                ("Metal"),
                ("Punk"),
                ("Blues"),
                ("Jazz"),
                ("Folk"),
                ("Country"),
                ("Funk"),
                ("Soul"),
                ("Reggae"),
                ("Ska"),
                ("Goth"),
                ("Grunge"),
                ("Shoegaze"),
                ("Hardcore"),
                ("Techno"),
                ("Hip-Hop"),
                ("Ambient"),
                ("Electronic");
        `);
    },
};