import { Router } from "express";

import { pool } from "../database/postgres";

export const bandsRouter = Router();

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
                            'genreId', g.genre_id,
                            'genreName', g.genre_name
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
                            'genreId', g.genre_id,
                            'genreName', g.genre_name
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