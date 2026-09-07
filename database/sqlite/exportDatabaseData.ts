import { getDatabase } from "./Database";

export async function exportDatabaseData() {
    const db = await getDatabase();

    const bands = await db.getAllAsync(`
        SELECT *
        FROM bands
        ORDER BY band_id
    `);

    const venues = await db.getAllAsync(`
        SELECT *
        FROM venues
        ORDER BY venue_id
    `);

    const genres = await db.getAllAsync(`
        SELECT *
        FROM genres
        ORDER BY genre_id
    `);

    const bandGenres = await db.getAllAsync(`
        SELECT *
        FROM band_genres
        ORDER BY band_id, genre_id
    `);

    const gigs = await db.getAllAsync(`
        SELECT *
        FROM gigs
        ORDER BY gig_id
    `);

    const gigBands = await db.getAllAsync(`
        SELECT *
        FROM gig_bands
        ORDER BY gig_id, band_id
    `);

    const drinkTokens = await db.getAllAsync(`
        SELECT *
        FROM gig_band_drink_tokens
        ORDER BY token_id
    `);

    return {
        exportedAt: new Date().toISOString(),
        bands,
        venues,
        genres,
        bandGenres,
        gigs,
        gigBands,
        drinkTokens,
    };
}