import { Router } from "express";

import { pool } from "../database/postgres";

export const gigsRouter = Router();

gigsRouter.get("/", async (_req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                g.gig_id AS "gigId",
                g.venue_id AS "venueId",
                TO_CHAR(
                    g.gig_date,
                    'YYYY-MM-DD'
                ) AS "gigDate",
                g.event_name AS "eventName",
                g.notes,
                g.status,
                g.created_at AS "createdAt",
                g.updated_at AS "updatedAt",

                v.venue_name AS "venueName",
                v.suburb,

                COUNT(gb.band_id)::int AS "bandCount"

            FROM gigs g

            LEFT JOIN venues v
                ON v.venue_id = g.venue_id

            LEFT JOIN gig_bands gb
                ON gb.gig_id = g.gig_id

            GROUP BY
                g.gig_id,
                v.venue_name,
                v.suburb

            ORDER BY
                g.gig_date DESC,
                g.gig_id DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(
            "GET /gigs failed:",
            error
        );

        res.status(500).json({
            error: "Unable to load gigs",
        });
    }
});

gigsRouter.get("/:id", async (req, res) => {
    const gigId = Number(req.params.id);

    if (
        !Number.isInteger(gigId) ||
        gigId <= 0
    ) {
        return res.status(400).json({
            error: "Invalid gig ID",
        });
    }

    try {
        const gigResult =
            await pool.query(
                `
                SELECT
                    g.gig_id AS "gigId",
                    g.venue_id AS "venueId",
                    TO_CHAR(
                        g.gig_date,
                        'YYYY-MM-DD'
                    ) AS "gigDate",
                    g.event_name AS "eventName",
                    g.notes,
                    g.status,
                    g.created_at AS "createdAt",
                    g.updated_at AS "updatedAt",

                    v.venue_name AS "venueName",
                    v.suburb

                FROM gigs g

                LEFT JOIN venues v
                    ON v.venue_id = g.venue_id

                WHERE g.gig_id = $1
                `,
                [gigId]
            );

        if (gigResult.rowCount === 0) {
            return res.status(404).json({
                error: "Gig not found",
            });
        }

        const bandResult =
            await pool.query(
                `
                SELECT
                    b.band_id AS "bandId",
                    b.band_name AS "bandName",
                    gb.billing_order AS "billingOrder",
                    gb.role,
                    b.is_our_band AS "isOurBand"

                FROM gig_bands gb

                INNER JOIN bands b
                    ON b.band_id = gb.band_id

                WHERE gb.gig_id = $1

                ORDER BY
                    gb.billing_order ASC,
                    b.band_name ASC
                `,
                [gigId]
            );

        const gig = gigResult.rows[0];

        res.json({
            ...gig,

            bandIds: bandResult.rows.map(
                (band) =>
                    Number(band.bandId)
            ),

            bands: bandResult.rows.map(
                (band) => ({
                    ...band,
                    bandId: Number(
                        band.bandId
                    ),
                    isOurBand:
                        Boolean(
                            band.isOurBand
                        ),
                })
            ),
        });
    } catch (error) {
        console.error(
            `GET /gigs/${gigId} failed:`,
            error
        );

        res.status(500).json({
            error: "Unable to load gig",
        });
    }
});

gigsRouter.post("/", async (req, res) => {
    const {
        venueId,
        gigDate,
        eventName,
        notes,
        status,
        lineup,
    } = req.body;

    if (
        typeof gigDate !== "string" ||
        !gigDate.trim()
    ) {
        return res.status(400).json({
            error: "Gig date is required",
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result =
            await client.query(
                `
                INSERT INTO gigs (
                    venue_id,
                    gig_date,
                    event_name,
                    notes,
                    status
                )
                VALUES ($1, $2, $3, $4, $5)

                RETURNING
                    gig_id AS "gigId",
                    venue_id AS "venueId",
                    TO_CHAR(
                        gig_date,
                        'YYYY-MM-DD'
                    ) AS "gigDate",
                    event_name AS "eventName",
                    notes,
                    status,
                    created_at AS "createdAt",
                    updated_at AS "updatedAt"
                `,
                [
                    venueId ?? null,
                    gigDate.trim(),
                    eventName || null,
                    notes || null,
                    status,
                ]
            );

        const gig =
            result.rows[0];

        const gigId =
            Number(gig.gigId);

        if (Array.isArray(lineup)) {
            for (
                let index = 0;
                index < lineup.length;
                index++
            ) {
                const item =
                    lineup[index];

                await client.query(
                    `
                    INSERT INTO gig_bands (
                        gig_id,
                        band_id,
                        billing_order,
                        role
                    )
                    VALUES ($1, $2, $3, $4)
                    `,
                    [
                        gigId,
                        Number(
                            item.bandId
                        ),
                        index + 1,
                        item.role,
                    ]
                );
            }
        }

        await client.query("COMMIT");

        res.status(201).json({
            ...gig,
            gigId,
        });
    } catch (error) {
        await client.query("ROLLBACK");

        console.error(
            "POST /gigs failed:",
            error
        );

        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Unable to create gig",
        });
    } finally {
        client.release();
    }
});

gigsRouter.patch("/:id", async (req, res) => {
    const gigId =
        Number(req.params.id);

    if (
        !Number.isInteger(gigId) ||
        gigId <= 0
    ) {
        return res.status(400).json({
            error: "Invalid gig ID",
        });
    }

    const {
        venueId,
        gigDate,
        eventName,
        notes,
        status,
        lineup,
    } = req.body;

    if (
        typeof gigDate !== "string" ||
        !gigDate.trim()
    ) {
        return res.status(400).json({
            error: "Gig date is required",
        });
    }

    const client =
        await pool.connect();

    try {
        await client.query("BEGIN");

        const existing =
            await client.query(
                `
                SELECT gig_id
                FROM gigs
                WHERE gig_id = $1
                `,
                [gigId]
            );

        if (
            existing.rowCount === 0
        ) {
            await client.query(
                "ROLLBACK"
            );

            return res.status(404).json({
                error: "Gig not found",
            });
        }

        await client.query(
            `
            UPDATE gigs
            SET
                venue_id = $1,
                gig_date = $2,
                event_name = $3,
                notes = $4,
                status = $5,
                updated_at = NOW()
            WHERE gig_id = $6
            `,
            [
                venueId ?? null,
                gigDate.trim(),
                eventName || null,
                notes || null,
                status,
                gigId,
            ]
        );

        await client.query(
            `
            DELETE FROM gig_bands
            WHERE gig_id = $1
            `,
            [gigId]
        );

        if (Array.isArray(lineup)) {
            for (
                let index = 0;
                index < lineup.length;
                index++
            ) {
                const item =
                    lineup[index];

                await client.query(
                    `
                    INSERT INTO gig_bands (
                        gig_id,
                        band_id,
                        billing_order,
                        role
                    )
                    VALUES ($1, $2, $3, $4)
                    `,
                    [
                        gigId,
                        Number(
                            item.bandId
                        ),
                        index + 1,
                        item.role,
                    ]
                );
            }
        }

        await client.query(
            `
            DELETE FROM gig_band_drink_tokens
            WHERE gig_id = $1
              AND band_id NOT IN (
                  SELECT band_id
                  FROM gig_bands
                  WHERE gig_id = $1
              )
            `,
            [gigId]
        );

        await client.query("COMMIT");

        res.json({
            success: true,
        });
    } catch (error) {
        await client.query("ROLLBACK");

        console.error(
            `PATCH /gigs/${gigId} failed:`,
            error
        );

        res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Unable to update gig",
        });
    } finally {
        client.release();
    }
});