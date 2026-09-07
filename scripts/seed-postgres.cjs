const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const importPath = path.join(
    __dirname,
    "../assets/imports/support-bands.json"
);

const supportBandImport = JSON.parse(
    fs.readFileSync(importPath, "utf8")
);

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL environment variable is not set"
    );
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

function cleanText(value) {
    if (typeof value !== "string") {
        return null;
    }

    const cleaned = value.trim();

    return cleaned || null;
}

function extractGenres(genreStyle) {
    if (!genreStyle) {
        return [];
    }

    let value = genreStyle.trim();

    // Normalise some descriptive spreadsheet values
    value = value
        .replace(/^high-energy\s+/i, "")
        .replace(/\s+with\s+80s\s+influence$/i, "");

    return value
        .split(/[,/]/)
        .map((genre) => genre.trim())
        .filter(Boolean);
}

async function getOrCreateGenre(client, genreName) {
    const existing = await client.query(
        `
        SELECT genre_id
        FROM genres
        WHERE LOWER(genre_name) = LOWER($1)
        `,
        [genreName]
    );

    if (existing.rows.length > 0) {
        return existing.rows[0].genre_id;
    }

    const inserted = await client.query(
        `
        INSERT INTO genres (
            genre_name
        )
        VALUES ($1)
        RETURNING genre_id
        `,
        [genreName]
    );

    return inserted.rows[0].genre_id;
}

async function seedBand(client, source) {
    const bandName = cleanText(source.bandName);

    if (!bandName) {
        return "skipped";
    }

    const existing = await client.query(
        `
        SELECT band_id
        FROM bands
        WHERE LOWER(band_name) = LOWER($1)
          AND archived_at IS NULL
        `,
        [bandName]
    );

    let bandId;

    if (existing.rows.length > 0) {
        bandId = existing.rows[0].band_id;
    } else {
        const inserted = await client.query(
            `
            INSERT INTO bands (
                band_name,
                hometown,
                state_region,
                country_code,
                member_count,
                status,
                internal_notes,
                is_verified
            )
            VALUES (
                $1,
                'Perth',
                'Western Australia',
                'AU',
                $2,
                'active',
                $3,
                FALSE
            )
            RETURNING band_id
            `,
            [
                bandName,
                source.memberCount ?? null,
                cleanText(source.notes),
            ]
        );

        bandId = inserted.rows[0].band_id;
    }

    const genres = extractGenres(
        cleanText(source.genreStyle)
    );

    for (const genreName of genres) {
        const genreId = await getOrCreateGenre(
            client,
            genreName
        );

        await client.query(
            `
            INSERT INTO band_genres (
                band_id,
                genre_id
            )
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
            `,
            [bandId, genreId]
        );
    }

    return existing.rows.length > 0
        ? "existing"
        : "inserted";
}

async function main() {
    const client = await pool.connect();

    const result = {
        inserted: 0,
        existing: 0,
        skipped: 0,
    };

    try {
        await client.query("BEGIN");

        for (const source of supportBandImport.bands) {
            const status = await seedBand(
                client,
                source
            );

            result[status] += 1;
        }

        await client.query("COMMIT");

        console.log("Postgres seed complete:");
        console.log(result);
    } catch (error) {
        await client.query("ROLLBACK");

        console.error(
            "Postgres seed failed:",
            error
        );

        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

main();