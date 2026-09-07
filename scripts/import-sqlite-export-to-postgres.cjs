require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL environment variable is not set"
    );
}

const EXPORT_FILE = path.resolve(
    process.cwd(),
    "assets/imports/supportscout-db-export.json"
);

if (!fs.existsSync(EXPORT_FILE)) {
    throw new Error(
        `SQLite export not found: ${EXPORT_FILE}`
    );
}

const data = JSON.parse(
    fs.readFileSync(EXPORT_FILE, "utf8")
);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

function toBoolean(value) {
    return value === 1 || value === true;
}

async function importData() {
    const client = await pool.connect();

    // SQLite ID -> PostgreSQL ID
    const bandIdMap = new Map();
    const venueIdMap = new Map();
    const genreIdMap = new Map();
    const gigIdMap = new Map();

    try {
        console.log("Starting SupportScout SQLite → PostgreSQL migration...");
        console.log("");

        await client.query("BEGIN");

        //
        // GENRES
        //
        console.log(`Importing ${data.genres.length} genres...`);

        for (const genre of data.genres) {
            const result = await client.query(
                `
                INSERT INTO genres (
                    genre_name,
                    created_at
                )
                VALUES ($1, $2)
                ON CONFLICT (LOWER(genre_name))
                DO UPDATE SET
                    genre_name = EXCLUDED.genre_name
                RETURNING genre_id
                `,
                [
                    genre.genre_name,
                    genre.created_at,
                ]
            );

            genreIdMap.set(
                genre.genre_id,
                Number(result.rows[0].genre_id)
            );
        }

        //
        // BANDS
        //
        console.log(`Importing ${data.bands.length} bands...`);

        for (const band of data.bands) {
            const existing = await client.query(
                `
                SELECT band_id
                FROM bands
                WHERE LOWER(band_name) = LOWER($1)
                  AND archived_at IS NULL
                LIMIT 1
                `,
                [band.band_name]
            );

            let pgBandId;

            if (existing.rowCount > 0) {
                pgBandId = Number(
                    existing.rows[0].band_id
                );

                await client.query(
                    `
                    UPDATE bands
                    SET
                        band_name = $1,
                        slug = $2,
                        hometown = $3,
                        state_region = $4,
                        country_code = $5,
                        member_count = $6,
                        formation_year = $7,
                        status = $8,
                        short_description = $9,
                        internal_notes = $10,
                        is_our_band = $11,
                        is_verified = $12,
                        booking_contact_name = $13,
                        contact_email = $14,
                        facebook_url = $15,
                        instagram_url = $16,
                        website_url = $17,
                        created_at = $18,
                        updated_at = $19,
                        archived_at = $20
                    WHERE band_id = $21
                    `,
                    [
                        band.band_name,
                        band.slug,
                        band.hometown,
                        band.state_region,
                        band.country_code,
                        band.member_count,
                        band.formation_year,
                        band.status,
                        band.short_description,
                        band.internal_notes,
                        toBoolean(band.is_our_band),
                        toBoolean(band.is_verified),
                        band.booking_contact_name,
                        band.contact_email,
                        band.facebook_url,
                        band.instagram_url,
                        band.website_url,
                        band.created_at,
                        band.updated_at,
                        band.archived_at,
                        pgBandId,
                    ]
                );

                console.log(
                    `  updated band: ${band.band_name}`
                );
            } else {
                const result = await client.query(
                    `
                    INSERT INTO bands (
                        band_name,
                        slug,
                        hometown,
                        state_region,
                        country_code,
                        member_count,
                        formation_year,
                        status,
                        short_description,
                        internal_notes,
                        is_our_band,
                        is_verified,
                        booking_contact_name,
                        contact_email,
                        facebook_url,
                        instagram_url,
                        website_url,
                        created_at,
                        updated_at,
                        archived_at
                    )
                    VALUES (
                        $1, $2, $3, $4, $5,
                        $6, $7, $8, $9, $10,
                        $11, $12, $13, $14, $15,
                        $16, $17, $18, $19, $20
                    )
                    RETURNING band_id
                    `,
                    [
                        band.band_name,
                        band.slug,
                        band.hometown,
                        band.state_region,
                        band.country_code,
                        band.member_count,
                        band.formation_year,
                        band.status,
                        band.short_description,
                        band.internal_notes,
                        toBoolean(band.is_our_band),
                        toBoolean(band.is_verified),
                        band.booking_contact_name,
                        band.contact_email,
                        band.facebook_url,
                        band.instagram_url,
                        band.website_url,
                        band.created_at,
                        band.updated_at,
                        band.archived_at,
                    ]
                );

                pgBandId = Number(
                    result.rows[0].band_id
                );

                console.log(
                    `  inserted band: ${band.band_name}`
                );
            }

            bandIdMap.set(
                band.band_id,
                pgBandId
            );
        }

        //
        // VENUES
        //
        console.log("");
        console.log(`Importing ${data.venues.length} venues...`);

        for (const venue of data.venues) {
            const existing = await client.query(
                `
                SELECT venue_id
                FROM venues
                WHERE LOWER(venue_name) = LOWER($1)
                  AND archived_at IS NULL
                LIMIT 1
                `,
                [venue.venue_name]
            );

            let pgVenueId;

            if (existing.rowCount > 0) {
                pgVenueId = Number(
                    existing.rows[0].venue_id
                );

                await client.query(
                    `
                    UPDATE venues
                    SET
                        venue_name = $1,
                        slug = $2,
                        suburb = $3,
                        state_region = $4,
                        country_code = $5,
                        address = $6,
                        capacity = $7,
                        venue_type = $8,
                        website_url = $9,
                        booking_url = $10,
                        booking_email = $11,
                        short_description = $12,
                        internal_notes = $13,
                        status = $14,
                        is_verified = $15,
                        created_at = $16,
                        updated_at = $17,
                        archived_at = $18
                    WHERE venue_id = $19
                    `,
                    [
                        venue.venue_name,
                        venue.slug,
                        venue.suburb,
                        venue.state_region,
                        venue.country_code,
                        venue.address,
                        venue.capacity,
                        venue.venue_type,
                        venue.website_url,
                        venue.booking_url,
                        venue.booking_email,
                        venue.short_description,
                        venue.internal_notes,
                        venue.status,
                        toBoolean(venue.is_verified),
                        venue.created_at,
                        venue.updated_at,
                        venue.archived_at,
                        pgVenueId,
                    ]
                );

                console.log(
                    `  updated venue: ${venue.venue_name}`
                );
            } else {
                const result = await client.query(
                    `
                    INSERT INTO venues (
                        venue_name,
                        slug,
                        suburb,
                        state_region,
                        country_code,
                        address,
                        capacity,
                        venue_type,
                        website_url,
                        booking_url,
                        booking_email,
                        short_description,
                        internal_notes,
                        status,
                        is_verified,
                        created_at,
                        updated_at,
                        archived_at
                    )
                    VALUES (
                        $1, $2, $3, $4, $5, $6,
                        $7, $8, $9, $10, $11, $12,
                        $13, $14, $15, $16, $17, $18
                    )
                    RETURNING venue_id
                    `,
                    [
                        venue.venue_name,
                        venue.slug,
                        venue.suburb,
                        venue.state_region,
                        venue.country_code,
                        venue.address,
                        venue.capacity,
                        venue.venue_type,
                        venue.website_url,
                        venue.booking_url,
                        venue.booking_email,
                        venue.short_description,
                        venue.internal_notes,
                        venue.status,
                        toBoolean(venue.is_verified),
                        venue.created_at,
                        venue.updated_at,
                        venue.archived_at,
                    ]
                );

                pgVenueId = Number(
                    result.rows[0].venue_id
                );

                console.log(
                    `  inserted venue: ${venue.venue_name}`
                );
            }

            venueIdMap.set(
                venue.venue_id,
                pgVenueId
            );
        }

        //
        // BAND GENRES
        //
        console.log("");
        console.log(
            `Importing ${data.bandGenres.length} band/genre links...`
        );

        for (const link of data.bandGenres) {
            const bandId = bandIdMap.get(
                link.band_id
            );

            const genreId = genreIdMap.get(
                link.genre_id
            );

            if (!bandId || !genreId) {
                throw new Error(
                    `Unable to map band_genres row: ${JSON.stringify(link)}`
                );
            }

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

        //
        // GIGS
        //
        console.log("");
        console.log(`Importing ${data.gigs.length} gigs...`);

        for (const gig of data.gigs) {
            const venueId =
                gig.venue_id === null
                    ? null
                    : venueIdMap.get(gig.venue_id);

            if (
                gig.venue_id !== null &&
                !venueId
            ) {
                throw new Error(
                    `Unable to map venue ${gig.venue_id} for gig ${gig.gig_id}`
                );
            }

            /*
             * We deliberately find the existing gig using
             * event/date/venue rather than assuming SQLite
             * and PostgreSQL IDs match.
             */
            const existing = await client.query(
                `
                SELECT gig_id
                FROM gigs
                WHERE gig_date::date = $1::date
                  AND event_name IS NOT DISTINCT FROM $2
                  AND venue_id IS NOT DISTINCT FROM $3
                LIMIT 1
                `,
                [
                    gig.gig_date,
                    gig.event_name,
                    venueId,
                ]
            );

            let pgGigId;

            if (existing.rowCount > 0) {
                pgGigId = Number(
                    existing.rows[0].gig_id
                );

                await client.query(
                    `
                    UPDATE gigs
                    SET
                        venue_id = $1,
                        gig_date = $2,
                        event_name = $3,
                        notes = $4,
                        status = $5,
                        created_at = $6,
                        updated_at = $7
                    WHERE gig_id = $8
                    `,
                    [
                        venueId,
                        gig.gig_date,
                        gig.event_name,
                        gig.notes,
                        gig.status,
                        gig.created_at,
                        gig.updated_at,
                        pgGigId,
                    ]
                );

                console.log(
                    `  updated gig: ${gig.event_name ?? gig.gig_date}`
                );
            } else {
                const result = await client.query(
                    `
                    INSERT INTO gigs (
                        venue_id,
                        gig_date,
                        event_name,
                        notes,
                        status,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        $1, $2, $3, $4,
                        $5, $6, $7
                    )
                    RETURNING gig_id
                    `,
                    [
                        venueId,
                        gig.gig_date,
                        gig.event_name,
                        gig.notes,
                        gig.status,
                        gig.created_at,
                        gig.updated_at,
                    ]
                );

                pgGigId = Number(
                    result.rows[0].gig_id
                );

                console.log(
                    `  inserted gig: ${gig.event_name ?? gig.gig_date}`
                );
            }

            gigIdMap.set(
                gig.gig_id,
                pgGigId
            );
        }

        //
        // GIG BANDS
        //
        console.log("");
        console.log(
            `Importing ${data.gigBands.length} gig/band links...`
        );

        for (const link of data.gigBands) {
            const gigId = gigIdMap.get(
                link.gig_id
            );

            const bandId = bandIdMap.get(
                link.band_id
            );

            if (!gigId || !bandId) {
                throw new Error(
                    `Unable to map gig_bands row: ${JSON.stringify(link)}`
                );
            }

            await client.query(
                `
                INSERT INTO gig_bands (
                    gig_id,
                    band_id,
                    billing_order,
                    role
                )
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (gig_id, band_id)
                DO UPDATE SET
                    billing_order = EXCLUDED.billing_order,
                    role = EXCLUDED.role
                `,
                [
                    gigId,
                    bandId,
                    link.billing_order,
                    link.role,
                ]
            );
        }

        //
        // DRINK TOKENS
        //
        console.log("");
        console.log(
            `Importing ${data.drinkTokens.length} drink tokens...`
        );

        /*
         * Delete the current tokens for imported gig/band
         * combinations first. This makes rerunning the
         * migration safe and prevents duplicate tokens.
         */
        const tokenPairs = new Set(
            data.drinkTokens.map(
                (token) =>
                    `${token.gig_id}:${token.band_id}`
            )
        );

        for (const pair of tokenPairs) {
            const [sqliteGigId, sqliteBandId] =
                pair.split(":").map(Number);

            const gigId =
                gigIdMap.get(sqliteGigId);

            const bandId =
                bandIdMap.get(sqliteBandId);

            if (!gigId || !bandId) {
                throw new Error(
                    `Unable to map drink token pair ${pair}`
                );
            }

            await client.query(
                `
                DELETE FROM gig_band_drink_tokens
                WHERE gig_id = $1
                  AND band_id = $2
                `,
                [gigId, bandId]
            );
        }

        for (const token of data.drinkTokens) {
            const gigId =
                gigIdMap.get(token.gig_id);

            const bandId =
                bandIdMap.get(token.band_id);

            if (!gigId || !bandId) {
                throw new Error(
                    `Unable to map drink token ${token.token_id}`
                );
            }

            await client.query(
                `
                INSERT INTO gig_band_drink_tokens (
                    gig_id,
                    band_id,
                    used,
                    used_at
                )
                VALUES ($1, $2, $3, $4)
                `,
                [
                    gigId,
                    bandId,
                    toBoolean(token.used),
                    token.used_at,
                ]
            );
        }

        await client.query("COMMIT");

        console.log("");
        console.log("======================================");
        console.log("SupportScout migration complete");
        console.log("======================================");
        console.log(`Bands:       ${data.bands.length}`);
        console.log(`Venues:      ${data.venues.length}`);
        console.log(`Genres:      ${data.genres.length}`);
        console.log(`Band genres: ${data.bandGenres.length}`);
        console.log(`Gigs:        ${data.gigs.length}`);
        console.log(`Gig bands:   ${data.gigBands.length}`);
        console.log(`Drink tokens:${data.drinkTokens.length}`);
        console.log("");
    } catch (error) {
        await client.query("ROLLBACK");

        console.error("");
        console.error("Migration FAILED.");
        console.error("PostgreSQL transaction rolled back.");
        console.error(error);

        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

importData();