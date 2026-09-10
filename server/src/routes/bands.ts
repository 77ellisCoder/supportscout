import { Router } from "express";

import { pool } from "../database/postgres";

export const bandsRouter = Router();

type GenreInput = {
    id: number;
    name: string;
};

bandsRouter.get("/", async (_req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                b.band_id AS "bandId",
                b.band_name AS "bandName",
                b.slug,
                b.hometown,
                b.state_region AS "stateRegion",
                b.country_code AS "countryCode",
                b.member_count AS "memberCount",
                b.formation_year AS "formationYear",
                b.status,
                b.short_description AS "shortDescription",
                b.is_our_band AS "isOurBand",
                b.is_verified AS "isVerified",

                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', g.genre_id,
                            'name', g.genre_name
                        )
                        ORDER BY g.genre_name
                    ) FILTER (
                        WHERE g.genre_id IS NOT NULL
                    ),
                    '[]'::json
                ) AS genres

            FROM bands b

            LEFT JOIN band_genres bg
                ON bg.band_id = b.band_id

            LEFT JOIN genres g
                ON g.genre_id = bg.genre_id

            WHERE b.archived_at IS NULL

            GROUP BY b.band_id

            ORDER BY b.band_name;
        `);

        res.json(result.rows);
    } catch (error) {
        console.error("GET /bands failed:", error);

        res.status(500).json({
            error: "Unable to load bands",
        });
    }
});

bandsRouter.get("/:id", async (req, res) => {
    try {
        const bandId = Number(req.params.id);

        if (!Number.isInteger(bandId)) {
            return res.status(400).json({
                error: "Invalid band ID",
            });
        }

        const result = await pool.query(
            `
            SELECT
                b.band_id AS "bandId",
                b.band_name AS "bandName",
                b.slug,
                b.hometown,
                b.state_region AS "stateRegion",
                b.country_code AS "countryCode",
                b.member_count AS "memberCount",
                b.formation_year AS "formationYear",
                b.status,
                b.short_description AS "shortDescription",
                b.internal_notes AS "internalNotes",
                b.is_our_band AS "isOurBand",
                b.is_verified AS "isVerified",
                b.booking_contact_name AS "bookingContactName",
                b.contact_email AS "contactEmail",
                b.facebook_url AS "facebookUrl",
                b.instagram_url AS "instagramUrl",
                b.website_url AS "websiteUrl",
                b.created_at AS "createdAt",
                b.updated_at AS "updatedAt",
                b.archived_at AS "archivedAt",

                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', g.genre_id,
                            'name', g.genre_name
                        )
                        ORDER BY g.genre_name
                    ) FILTER (
                        WHERE g.genre_id IS NOT NULL
                    ),
                    '[]'::json
                ) AS genres

            FROM bands b

            LEFT JOIN band_genres bg
                ON bg.band_id = b.band_id

            LEFT JOIN genres g
                ON g.genre_id = bg.genre_id

            WHERE b.band_id = $1
              AND b.archived_at IS NULL

            GROUP BY b.band_id
            `,
            [bandId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Band not found",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(
            "GET /bands/:id failed:",
            error
        );

        res.status(500).json({
            error: "Unable to load band",
        });
    }
});

bandsRouter.patch("/:id", async (req, res) => {
    const bandId = Number(req.params.id);

    if (
        !Number.isInteger(bandId) ||
        bandId <= 0
    ) {
        return res.status(400).json({
            error: "Invalid band ID",
        });
    }

    const {
        bandName,
        slug,
        hometown,
        stateRegion,
        countryCode,
        memberCount,
        formationYear,
        status,
        shortDescription,
        internalNotes,
        isOurBand,
        isVerified,
        bookingContactName,
        contactEmail,
        facebookUrl,
        instagramUrl,
        websiteUrl,
        genres,
    } = req.body;

    if (
        typeof bandName !== "string" ||
        !bandName.trim()
    ) {
        return res.status(400).json({
            error: "Band name is required",
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const existing =
            await client.query(
                `
                SELECT band_id
                FROM bands
                WHERE band_id = $1
                  AND archived_at IS NULL
                `,
                [bandId]
            );

        if (existing.rowCount === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                error: "Band not found",
            });
        }

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
                updated_at = NOW()
            WHERE band_id = $18
            `,
            [
                bandName.trim(),
                slug || null,
                hometown || null,
                stateRegion || null,
                countryCode || null,
                memberCount ?? null,
                formationYear ?? null,
                status,
                shortDescription || null,
                internalNotes || null,
                Boolean(isOurBand),
                Boolean(isVerified),
                bookingContactName || null,
                contactEmail || null,
                facebookUrl || null,
                instagramUrl || null,
                websiteUrl || null,
                bandId,
            ]
        );

        if (Array.isArray(genres)) {
            await client.query(
                `
                DELETE FROM band_genres
                WHERE band_id = $1
                `,
                [bandId]
            );

            const genreIds = [
                ...new Set(
                    genres
                        .map((genre) =>
                            Number(genre.id)
                        )
                        .filter((id) =>
                            Number.isInteger(id)
                        )
                ),
            ];

            if (genreIds.length > 0) {
                const validGenres =
                    await client.query(
                        `
                        SELECT genre_id
                        FROM genres
                        WHERE genre_id = ANY($1::bigint[])
                        `,
                        [genreIds]
                    );

                if (
                    validGenres.rowCount !==
                    genreIds.length
                ) {
                    throw new Error(
                        "One or more genres are invalid"
                    );
                }

                for (const genreId of genreIds) {
                    await client.query(
                        `
                        INSERT INTO band_genres (
                            band_id,
                            genre_id
                        )
                        VALUES ($1, $2)
                        `,
                        [bandId, genreId]
                    );
                }
            }
        }

        await client.query("COMMIT");

        const result =
            await pool.query(
                `
                SELECT
                    b.band_id AS "bandId",
                    b.band_name AS "bandName",
                    b.slug,
                    b.hometown,
                    b.state_region AS "stateRegion",
                    b.country_code AS "countryCode",
                    b.member_count AS "memberCount",
                    b.formation_year AS "formationYear",
                    b.status,
                    b.short_description AS "shortDescription",
                    b.internal_notes AS "internalNotes",
                    b.is_our_band AS "isOurBand",
                    b.is_verified AS "isVerified",
                    b.booking_contact_name AS "bookingContactName",
                    b.contact_email AS "contactEmail",
                    b.facebook_url AS "facebookUrl",
                    b.instagram_url AS "instagramUrl",
                    b.website_url AS "websiteUrl",
                    b.created_at AS "createdAt",
                    b.updated_at AS "updatedAt",
                    b.archived_at AS "archivedAt",

                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', g.genre_id,
                                'name', g.genre_name
                            )
                            ORDER BY g.genre_name
                        ) FILTER (
                            WHERE g.genre_id IS NOT NULL
                        ),
                        '[]'::json
                    ) AS genres

                FROM bands b

                LEFT JOIN band_genres bg
                    ON bg.band_id = b.band_id

                LEFT JOIN genres g
                    ON g.genre_id = bg.genre_id

                WHERE b.band_id = $1

                GROUP BY b.band_id
                `,
                [bandId]
            );

        res.json(result.rows[0]);
    } catch (error) {
        await client.query("ROLLBACK");

        console.error(
            `PATCH /bands/${bandId} failed:`,
            error
        );

        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Unable to update band",
        });
    } finally {
        client.release();
    }
});

bandsRouter.post("/", async (req, res) => {
    const {
        bandName,
        slug,
        hometown,
        stateRegion,
        countryCode,
        memberCount,
        formationYear,
        status,
        shortDescription,
        internalNotes,
        isOurBand,
        isVerified,
        bookingContactName,
        contactEmail,
        facebookUrl,
        instagramUrl,
        websiteUrl,
        genres,
    } = req.body;

    const genreInputs: GenreInput[] =
        Array.isArray(genres)
            ? genres
            : [];

    if (
        typeof bandName !== "string" ||
        !bandName.trim()
    ) {
        return res.status(400).json({
            error: "Band name is required",
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

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
                website_url
            )
            VALUES (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11, $12,
                $13, $14, $15, $16, $17
            )
            RETURNING
                band_id::int AS "bandId",
                band_name AS "bandName",
                slug,
                hometown,
                state_region AS "stateRegion",
                country_code AS "countryCode",
                member_count AS "memberCount",
                formation_year AS "formationYear",
                status,
                short_description AS "shortDescription",
                internal_notes AS "internalNotes",
                is_our_band AS "isOurBand",
                is_verified AS "isVerified",
                booking_contact_name AS "bookingContactName",
                contact_email AS "contactEmail",
                facebook_url AS "facebookUrl",
                instagram_url AS "instagramUrl",
                website_url AS "websiteUrl",
                created_at AS "createdAt",
                updated_at AS "updatedAt",
                archived_at AS "archivedAt"
            `,
            [
                bandName.trim(),
                slug || null,
                hometown || null,
                stateRegion || null,
                countryCode || null,
                memberCount ?? null,
                formationYear ?? null,
                status ?? "active",
                shortDescription || null,
                internalNotes || null,
                Boolean(isOurBand),
                Boolean(isVerified),
                bookingContactName || null,
                contactEmail || null,
                facebookUrl || null,
                instagramUrl || null,
                websiteUrl || null,
            ]
        );

        const band = result.rows[0];

        const genreIds = [
            ...new Set(
                genreInputs
                    .map((genre) =>
                        Number(genre.id)
                    )
                    .filter((id) =>
                        Number.isInteger(id)
                    )
            ),
        ];

        for (const genreId of genreIds) {
            await client.query(
                `
                INSERT INTO band_genres (
                    band_id,
                    genre_id
                )
                VALUES ($1, $2)
                `,
                [band.bandId, genreId]
            );
        }

        await client.query("COMMIT");

        res.status(201).json({
            ...band,
            genres: genreIds.map((id) => {
                const genre = genreInputs.find(
                    (item) =>
                        Number(item.id) === id
                );

                return {
                    id,
                    name: genre?.name ?? "",
                };
            }),
        });
    } catch (error) {
        await client.query("ROLLBACK");

        console.error(
            "POST /bands failed:",
            error
        );

        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Unable to create band",
        });
    } finally {
        client.release();
    }
});