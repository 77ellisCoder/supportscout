import { getDatabase } from "../../database/sqlite/Database";
import type { Genre } from "../../models/Genre";

type GenreRow = {
    genre_id: number;
    genre_name: string;
};

function mapGenre(row: GenreRow): Genre {
    return {
        id: row.genre_id,
        name: row.genre_name,
    };
}

export const GenreRepository = {

    async getAll(search?: string): Promise<Genre[]> {
    const db = await getDatabase();

    const rows = search?.trim()
      ? await db.getAllAsync<GenreRow>(
        `
          SELECT *
          FROM genres
          WHERE genre_name LIKE ?
          ORDER BY genre_name COLLATE NOCASE
        `,
        `%${search.trim()}%`
      )
      : await db.getAllAsync<GenreRow>(
        `
          SELECT *
          FROM genres
          ORDER BY genre_name COLLATE NOCASE
        `
      );

    return rows.map(mapGenre);
  },

    async getById(genreId: number): Promise<Genre | null> {
        const db = await getDatabase();

        const row = await db.getFirstAsync<{
            genre_id: number;
            genre_name: string;
        }>(
            `SELECT genre_id, genre_name
             FROM genres
             WHERE genre_id = ?`,
            genreId
        );

        return row
            ? {
                  id: row.genre_id,
                  name: row.genre_name,
              }
            : null;
    },

    async getByIds(genreIds: number[]): Promise<Genre[]> {
        if (genreIds.length === 0) {
            return [];
        }

        const db = await getDatabase();

        const placeholders = genreIds.map(() => "?").join(", ");
        const rows = await db.getAllAsync<{
            genre_id: number;
            genre_name: string;
        }>(
            `SELECT genre_id, genre_name
             FROM genres
             WHERE genre_id IN (${placeholders})
             ORDER BY genre_name COLLATE NOCASE`,
            ...genreIds
        );

        return rows.map((row) => ({
            id: row.genre_id,
            name: row.genre_name,
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

    async getByBandId(bandId: number): Promise<Genre[]> {
        const db = await getDatabase();

        const rows = await db.getAllAsync<{
            genre_id: number;
            genre_name: string;
        }>(
            `
            SELECT g.genre_id, g.genre_name
            FROM genres g
            INNER JOIN band_genres bg ON g.genre_id = bg.genre_id
            WHERE bg.band_id = ?
            ORDER BY g.genre_name COLLATE NOCASE
            `,
            bandId
        );

        return rows.map((row) => ({
            id: row.genre_id,
            name: row.genre_name,
        }));
    },
};