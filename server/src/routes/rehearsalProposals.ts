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

export const rehearsalProposalsRouter =
    Router();

rehearsalProposalsRouter.post(
    "/",
    requireAuth,
    async (
        req: AuthenticatedRequest,
        res
    ) => {
        try {
            const userId =
                req.auth?.userId;

            if (!userId) {
                return res
                    .status(401)
                    .json({
                        error:
                            "Authentication required",
                    });
            }

            const {
                bandId,
                startAt,
                endAt,
                rehearsalLocationId,
                location,
                notes,
            } =
                req.body ?? {};

            if (
                !Number.isFinite(
                    Number(
                        bandId
                    )
                )
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Valid bandId is required",
                    });
            }

            const start =
                new Date(
                    startAt
                );

            const end =
                new Date(
                    endAt
                );

            if (
                Number.isNaN(
                    start.getTime()
                ) ||
                Number.isNaN(
                    end.getTime()
                )
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Valid startAt and endAt are required",
                    });
            }

            if (
                end <= start
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "endAt must be after startAt",
                    });
            }

            const membership =
                await pool.query(
                    `
                    SELECT 1

                    FROM user_bands

                    WHERE band_id = $1
                      AND user_id = $2

                    LIMIT 1
                    `,
                    [
                        Number(
                            bandId
                        ),
                        userId,
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

            let selectedLocationId:
                number | null =
                null;

            if (
                rehearsalLocationId !==
                null &&
                rehearsalLocationId !==
                undefined
            ) {
                selectedLocationId =
                    Number(
                        rehearsalLocationId
                    );

                if (
                    !Number.isFinite(
                        selectedLocationId
                    )
                ) {
                    return res
                        .status(400)
                        .json({
                            error:
                                "Invalid rehearsal location",
                        });
                }

                const locationResult =
                    await pool.query(
                        `
                        SELECT 1

                        FROM rehearsal_locations

                        WHERE rehearsal_location_id = $1
                        AND active = TRUE

                        LIMIT 1
                        `,
                        [
                            selectedLocationId,
                        ]
                    );

                if (
                    locationResult.rowCount ===
                    0
                ) {
                    return res
                        .status(400)
                        .json({
                            error:
                                "Rehearsal location not found",
                        });
                }
            }

            const result =
                await pool.query(
                    `
                    INSERT INTO rehearsal_proposals (
                        band_id,
                        proposed_by_user_id,
                        start_at,
                        end_at,
                        rehearsal_location_id,
                        location,
                        notes
                    )
                    VALUES (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6,
                        $7
                    )

                    RETURNING
                        proposal_id::int
                            AS "proposalId",

                        band_id::int
                            AS "bandId",

                        proposed_by_user_id::int
                            AS "proposedByUserId",

                        rehearsal_location_id::int
                            AS "rehearsalLocationId",

                        start_at
                            AS "startAt",

                        end_at
                            AS "endAt",

                        location,

                        notes,

                        status,

                        created_at
                            AS "createdAt",

                        updated_at
                            AS "updatedAt"
                    `,
                    [
                        Number(
                            bandId
                        ),

                        userId,

                        start.toISOString(),

                        end.toISOString(),

                        selectedLocationId,

                        selectedLocationId
                            ? null
                            : (
                                typeof location ===
                                    "string" &&
                                    location.trim()
                                    ? location.trim()
                                    : null
                            ),

                        typeof notes ===
                            "string" &&
                            notes.trim()
                            ? notes.trim()
                            : null,
                    ]
                );

            return res
                .status(201)
                .json(
                    result.rows[0]
                );
        } catch (
        error
        ) {
            console.error(
                "Unable to create rehearsal proposal:",
                error
            );

            return res
                .status(500)
                .json({
                    error:
                        "Unable to create rehearsal proposal",
                });
        }
    }
);