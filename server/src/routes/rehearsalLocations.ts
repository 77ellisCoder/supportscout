import {
    Router,
} from "express";

import {
    pool,
} from "../database/postgres";

import {
    AuthenticatedRequest,
    requireAuth,
} from "../middleware/requireAuth";

export const rehearsalLocationsRouter =
    Router();

rehearsalLocationsRouter.get(
    "/",
    requireAuth,
    async (
        req: AuthenticatedRequest,
        res
    ) => {
        try {
            const userId =
                req.auth?.userId;

            const bandId =
                Number(
                    req.query.bandId
                );

            if (!userId) {
                return res
                    .status(401)
                    .json({
                        error:
                            "Authentication required",
                    });
            }

            if (
                !Number.isFinite(
                    bandId
                )
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Valid bandId is required",
                    });
            }

            const membership =
                await pool.query(
                    `
                    SELECT 1

                    FROM user_bands

                    WHERE user_id = $1
                      AND band_id = $2

                    LIMIT 1
                    `,
                    [
                        userId,
                        bandId,
                    ]
                );

            if (
                membership.rowCount ===
                0
            ) {
                return res
                    .status(403)
                    .json({
                        error:
                            "You are not a member of this band",
                    });
            }

            const result =
                await pool.query(
                    `
                    SELECT
                        rl.rehearsal_location_id::int
                            AS "rehearsalLocationId",

                        rl.name,

                        rl.address,

                        rl.suburb,

                        rl.state,

                        rl.postcode,

                        rl.phone,

                        rl.email,

                        rl.website,

                        rl.booking_url
                            AS "bookingUrl",

                        rl.default_session_minutes::int
                            AS "defaultSessionMinutes",

                        rl.indicative_rate::float
                            AS "indicativeRate",

                        rl.notes,

                        COALESCE(
                            brl.is_favourite,
                            FALSE
                        )
                            AS "isFavourite",

                        brl.notes
                            AS "bandNotes"

                    FROM rehearsal_locations rl

                    LEFT JOIN band_rehearsal_locations brl
                        ON brl.rehearsal_location_id =
                            rl.rehearsal_location_id
                       AND brl.band_id = $1

                    WHERE
                        rl.active = TRUE

                        AND EXISTS (
                            SELECT 1

                            FROM band_rehearsal_locations brl

                            WHERE
                                brl.rehearsal_location_id =
                                    rl.rehearsal_location_id

                                AND brl.band_id =
                                    ANY($1::bigint[])
                        )

                    ORDER BY
                        rl.name ASC
                    `,
                    [
                        bandId,
                    ]
                );

            return res.json(
                result.rows
            );
        } catch (
        error
        ) {
            console.error(
                "Unable to load rehearsal locations:",
                error
            );

            return res
                .status(500)
                .json({
                    error:
                        "Unable to load rehearsal locations",
                });
        }
    }
);