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

gigsRouter.get(
    "/band/:bandId",
    async (req, res) => {
        try {
            const bandId =
                Number(req.params.bandId);

            if (!Number.isInteger(bandId)) {
                return res.status(400).json({
                    error: "Invalid band ID",
                });
            }

            const period =
                req.query.period;

            if (
                period !== "past" &&
                period !== "upcoming"
            ) {
                return res.status(400).json({
                    error:
                        "Period must be past or upcoming",
                });
            }

            const dateCondition =
                period === "past"
                    ? "g.gig_date < CURRENT_DATE"
                    : "g.gig_date >= CURRENT_DATE";

            const result =
                await pool.query(
                    `
                    SELECT
                        g.gig_id::int
                            AS "gigId",
                        g.gig_name
                            AS "gigName",

                        TO_CHAR(
                            g.gig_date,
                            'YYYY-MM-DD'
                        ) AS "gigDate",

                        g.start_time
                            AS "startTime",
                        g.end_time
                            AS "endTime",

                        g.venue_id::int
                            AS "venueId",

                        v.venue_name
                            AS "venueName",

                        g.status,

                        COUNT(
                            DISTINCT lineup.band_id
                        )::int
                            AS "bandCount"

                    FROM gigs g

                    INNER JOIN gig_bands target_band
                        ON target_band.gig_id =
                            g.gig_id
                        AND target_band.band_id =
                            $1

                    LEFT JOIN venues v
                        ON v.venue_id =
                            g.venue_id

                    LEFT JOIN gig_bands lineup
                        ON lineup.gig_id =
                            g.gig_id

                    WHERE
                        g.archived_at IS NULL
                        AND ${dateCondition}

                    GROUP BY
                        g.gig_id,
                        v.venue_name

                    ORDER BY
                        g.gig_date ${period === "past"
                        ? "DESC"
                        : "ASC"
                    },
                        g.start_time ASC
                    `,
                    [bandId]
                );

            res.json(result.rows);
        } catch (error) {
            console.error(
                "Failed to fetch gigs by band:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to fetch gigs by band",
            });
        }
    }
);

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

// -----------------------------------------------------------------------------
// Drink rider allocation
// -----------------------------------------------------------------------------

gigsRouter.get(
    "/:gigId/bands/:bandId/drink-tokens",
    async (req, res) => {
        const gigId = Number(req.params.gigId);
        const bandId = Number(req.params.bandId);

        if (
            !Number.isInteger(gigId) ||
            gigId <= 0 ||
            !Number.isInteger(bandId) ||
            bandId <= 0
        ) {
            return res.status(400).json({
                error: "Invalid gig or band ID",
            });
        }

        try {
            const result = await pool.query(
                `
                SELECT
                    token_id::int AS "tokenId",
                    gig_id::int AS "gigId",
                    band_id::int AS "bandId",
                    used,
                    used_at AS "usedAt"
                FROM gig_band_drink_tokens
                WHERE gig_id = $1
                  AND band_id = $2
                ORDER BY token_id ASC
                `,
                [gigId, bandId]
            );

            res.json(result.rows);
        } catch (error) {
            console.error(
                "GET drink tokens failed:",
                error
            );

            res.status(500).json({
                error:
                    "Unable to load drink tokens",
            });
        }
    }
);

gigsRouter.post(
    "/:gigId/bands/:bandId/drink-tokens",
    async (req, res) => {
        const gigId = Number(req.params.gigId);
        const bandId = Number(req.params.bandId);
        const count = Number(req.body.count);

        if (
            !Number.isInteger(gigId) ||
            gigId <= 0 ||
            !Number.isInteger(bandId) ||
            bandId <= 0
        ) {
            return res.status(400).json({
                error: "Invalid gig or band ID",
            });
        }

        if (
            !Number.isInteger(count) ||
            count <= 0
        ) {
            return res.status(400).json({
                error:
                    "Count must be a positive integer",
            });
        }

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            // Make sure this band is actually
            // part of this gig.
            const gigBandResult =
                await client.query(
                    `
                    SELECT 1
                    FROM gig_bands
                    WHERE gig_id = $1
                      AND band_id = $2
                    `,
                    [gigId, bandId]
                );

            if (
                gigBandResult.rowCount === 0
            ) {
                await client.query(
                    "ROLLBACK"
                );

                return res.status(404).json({
                    error:
                        "Band is not part of this gig",
                });
            }

            for (
                let i = 0;
                i < count;
                i++
            ) {
                await client.query(
                    `
                    INSERT INTO gig_band_drink_tokens (
                        gig_id,
                        band_id
                    )
                    VALUES ($1, $2)
                    `,
                    [gigId, bandId]
                );
            }

            await client.query("COMMIT");

            res.status(201).json({
                success: true,
            });
        } catch (error) {
            await client.query("ROLLBACK");

            console.error(
                "POST drink tokens failed:",
                error
            );

            res.status(500).json({
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to add drink tokens",
            });
        } finally {
            client.release();
        }
    }
);

gigsRouter.delete(
    "/:gigId/bands/:bandId/drink-tokens/unused",
    async (req, res) => {
        const gigId = Number(req.params.gigId);
        const bandId = Number(req.params.bandId);

        if (
            !Number.isInteger(gigId) ||
            gigId <= 0 ||
            !Number.isInteger(bandId) ||
            bandId <= 0
        ) {
            return res.status(400).json({
                error: "Invalid gig or band ID",
            });
        }

        try {
            const result = await pool.query(
                `
                DELETE FROM gig_band_drink_tokens
                WHERE token_id = (
                    SELECT token_id
                    FROM gig_band_drink_tokens
                    WHERE gig_id = $1
                      AND band_id = $2
                      AND used = FALSE
                    ORDER BY token_id DESC
                    LIMIT 1
                )
                RETURNING token_id
                `,
                [gigId, bandId]
            );

            if (
                result.rowCount === 0
            ) {
                return res.status(404).json({
                    error:
                        "No unused drink token found",
                });
            }

            res.json({
                success: true,
            });
        } catch (error) {
            console.error(
                "DELETE unused drink token failed:",
                error
            );

            res.status(500).json({
                error:
                    "Unable to remove drink token",
            });
        }
    }
);