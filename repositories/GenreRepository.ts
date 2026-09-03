import { getDatabase } from "../database/sqlite/Database";

export type Genre = {
    genreId: number;
    genreName: string;
};

export const GenreRepository = {
    async getAll(): Promise<Genre[]> {
        const db = await getDatabase();

        const rows = await db.getAllAsync<{
            genre_id: number;
            genre_name: string;
        }>(
            `SELECT genre_id, genre_name
             FROM genres
             ORDER BY genre_name COLLATE NOCASE`
        );

        return rows.map((row) => ({
            genreId: row.genre_id,
            genreName: row.genre_name,
        }));
    },

    async create(genreName: string): Promise<number> {
        const db = await getDatabase();

        const name = genreName.trim();

        if (!name) {
            throw new Error("Genre name is required");
        }

        const result = await db.runAsync(
            `INSERT INTO genres (genre_name)
             VALUES (?)`,
            name
        );

        return result.lastInsertRowId;
    },
};